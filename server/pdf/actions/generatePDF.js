/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { pullReports } from "server/mongodb/actions/Report";
import { getUser } from "server/mongodb/actions/User";
//import PDFDocument from "pdfkit";
import PDFDocument from "../pdfkit.standalone";

// Create PDF
export async function pdf(stream, reportId) {
  let doc;

  // Pull information from all listed reports
  let reports = await pullReports(reportId);

  // Find user information from reportIds
  let user = await getUser(reports[0].email);

  // Group reports by category and sort within each category by date
  reports.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category); // Sort by category first
    }
    // If in the same category, sort by date in descending order
    return new Date(b.date) - new Date(a.date);
  });

  // Create PDF object and pipe information to parameter stream
  doc = new PDFDocument({ bufferPages: true });
  doc.pipe(stream);

  // Name and rank header
  doc
    .fillColor("black")
    .font("Times-Roman")
    .fontSize(14)
    .text(
      `Name: ${user.rank} ${user.firstName} ${user.lastName} ${user.suffix}`,
      { align: "right" }
    );
  doc.moveDown(2);

  // Title
  doc
    .fillColor("black")
    .font("Times-Roman")
    .fontSize(30)
    .text("Performance Review Narratives", {
      align: "center",
    });
  doc.moveDown(2);

  // Loop through performance reports
  let currentCategory = "";
  doc.fillColor("black");

  reports.forEach((report) => {
    const category = report.category;
    var longCategory;

    // Group by category
    if (currentCategory !== category) {
      currentCategory = category;

      switch (category) {
        case "Mission":
          longCategory = "Executing the Mission";
          break;
        case "Leadership":
          longCategory = "Leading People";
          break;
        case "Resources":
          longCategory = "Managing Resources";
          break;
        case "Unit":
          longCategory = "Improving the Unit";
          break;
        default:
          longCategory = category;
          break;
      }

      doc.fontSize(16);
      doc.fillColor("grey");
      doc.fillColor("black");
      doc.font("Times-Bold");
      doc.text(`MPA: ${longCategory}\n`);
      doc.text("\n");
      doc.font("Times-Roman");
    }

    // Display date, title, and data for each report
    doc
      .fontSize(14)
      .font("Times-Italic")
      .text(`Date: ${report.date}`, { continued: "true", align: "left" })
      .font("Times-Roman");

    doc
      .text(`${report.title}`, { align: "center", underline: "true" })
      .moveDown()
      .fontSize(12)
      .text(report.report)
      .text("\n\n")
      .moveDown();
  });

  // Finalize the PDF and save it to a file
  doc.end();
  console.log("Finished");
}
