/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { pullReports } from "server/mongodb/actions/Report";
import { getUser } from "server/mongodb/actions/User";
//import PDFDocument from "pdfkit";
import PDFDocument from "../pdfkit.standalone";
import moment from "moment";

// Create PDF
export async function pdf(stream, reportId) {
  let currentYear = "";
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
    .text(`Name: ${user.firstName}`, { align: "left" });
  doc.text(`Rank: ${user.rank}`, { align: "left" });
  doc.moveDown();

  // Title
  doc
    .fillColor("black")
    .font("Times-Roman")
    .fontSize(20)
    .text("Enlisted Performance Review Narratives", {
      align: "center",
    });
  doc.moveDown();

  // Loop through performance reports
  doc.fillColor("black");
  reports.forEach((report) => {
    const reportDate = moment(report.date);
    const year = reportDate.format("YYYY");
    const category = report.category;

    // Group by year and quarter
    if (currentYear !== year || currentCategory !== category) {
      currentYear = year;
      currentCategory = category;
      doc.fontSize(14);
      doc.fillColor("grey");
      doc.text(`${year}\n`);
      doc.fillColor("black");
      doc.font("Times-Bold");
      doc.text(`Category ${category}\n`);
      doc.text("\n");
      doc.font("Times-Roman");
    }

    // Display date, title, and data for each report
    doc
      .fontSize(12)
      .font("Times-Italic")
      .text(`Date: ${report.date}`, { continued: true })
      .text("\n")
      .font("Times-Roman");

    doc
      .text(`${report.title}`, { align: "center" })
      .moveDown()
      .fontSize(10)
      .text(report.report)
      .text("\n")
      .moveDown();
  });

  // Finalize the PDF and save it to a file
  doc.end();
  console.log("Finished");
}
