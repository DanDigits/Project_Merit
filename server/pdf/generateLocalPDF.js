/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import mongodb from "../mongodb/dbConnection";
import { PassThrough } from "stream";
import PDFDocument from "pdfkit";
import fs from "fs";
import moment from "moment";

// Replace userData and performanceReports with MongoDB data
const userData = {
  name: "John Doe",
  rank: "Sergeant",
};

const performanceReports = [
  {
    title: "Test return",
    email: "mpeele",
    date: "2023-09-26",
    quarter: 2,
    report: "This should pop up a choice",
  },
  {
    title: "Test return 2",
    email: "mpeele",
    date: "2023-09-27",
    quarter: 2,
    report: "This is the second test return",
  },
  {
    title: "First trip",
    email: "amber",
    date: "2023-09-18",
    quarter: 1,
    report: "adsfasdfas",
  },
  {
    title: "Emily test",
    email: "emily",
    date: "2023-05-18",
    quarter: 4,
    report: "This is just a test",
  },
  {
    title: "Emily test 2",
    email: "emily",
    date: "2022-11-18",
    quarter: 1,
    report:
      "In the quiet stillness of the early morning, the world seemed to hold its breath. The first hints of dawn painted the sky in hues of pink and orange, casting long shadows that danced across the landscape. Birds stirred in their nests, their sleepy chirps gradually growing louder as they greeted the new day. As the sun's rays stretched across the horizon, the world came to life. People began to stir, their footsteps echoing on the cobblestone streets, and the aroma of freshly baked bread wafted from a nearby bakery. In the distance, a river flowed lazily, reflecting the changing colors of the sky, and a gentle breeze rustled the leaves on the trees, creating a soft, soothing melody. This moment felt like a precious gift, a brief respite from the chaos of everyday life. It was a time to appreciate the beauty of the world, to take a deep breath, and to savor the promise of a new day filled with possibilities.",
  },
  // Add more reports
];
// Sort performance reports by descending date
performanceReports.sort((a, b) => new Date(b.date) - new Date(a.date));

// Create PDF
export async function pdf() {
  const doc = new PDFDocument();

  // Create a writable stream to save the PDF to a file
  const stream = fs.createWriteStream(
    "server/pdf/Enlisted_Performance_Review.pdf"
  );

  doc.pipe(stream);

  // Title in blue, centered
  doc
    .fillColor("red")
    .font("Times-Roman")
    .fontSize(20)
    .text("Enlisted Performance Review Narratives", {
      align: "center",
    });

  doc.moveDown();

  // Add a new line
  // doc.text("\n");

  // User's name and rank in black, aligned to the left
  doc
    .fillColor("gray")
    .fontSize(14)
    .text(`Name: ${userData.name}`, { align: "right" });

  // doc.moveDown();

  doc.text(`Rank: ${userData.rank}`, { align: "right" });

  doc.moveDown();

  // Loop through performance reports
  let currentYear = "";
  let currentQuarter = "";

  doc.fillColor("black");

  performanceReports.forEach((report) => {
    const reportDate = moment(report.date);
    const year = reportDate.format("YYYY");
    const quarter = report.quarter;

    // Group by year and quarter
    if (currentYear !== year || currentQuarter !== quarter) {
      currentYear = year;
      currentQuarter = quarter;
      doc.moveDown();
      doc.moveDown();
      doc.fontSize(14);
      doc.fillColor("lightblue");
      doc.text(`${year}\n`);
      doc.fillColor("black");
      doc.font("Times-Bold");
      doc.text(`Quarter ${quarter}\n`);
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
