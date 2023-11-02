/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { pullReports } from "server/mongodb/actions/Report";
import { getUser } from "server/mongodb/actions/User";
//import PDFDocument from "pdfkit";
import PDFDocument from "../pdfkit.standalone";

// Create PDF
export async function pdf(stream, reportId) {
  let currentCategory = "";
  let doc;

  // Pull information from all listed reports
  let reports = await pullReports(reportId);

  // Find user information from reportIds
  let user = await getUser(reports[0].email);

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
  doc.fillColor("black");
  reports.forEach((report) => {
    const category = report.category;
    var longCategory;

    // Group by year and quarter
    if (currentCategory !== category) {
      currentCategory = category;

      switch (category) {
        case "Conduct":
          longCategory = "Standards, Conduct, Character & Military Bearings";
          break;
        case "Duties":
          longCategory = "Primary / Additional Duties";
          break;
        case "Teamwork":
          longCategory = "Teamwork / Followership";
          break;
        case "Training":
          longCategory = "Training Requirements";
          break;
        default:
          longCategory = category;
          break;
      }

      doc.fontSize(16);
      doc.fillColor("grey");
      doc.fillColor("black");
      doc.font("Times-Bold");
      doc.text(`Category: ${longCategory}\n`);
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
