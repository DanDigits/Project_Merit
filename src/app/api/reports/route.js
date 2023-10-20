/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { headers } from "next/headers";
import PDFDocument from "pdfkit";
import { fs } from "fs";
import {
  createReport,
  getReport,
  getUserReports,
  deleteReport,
  modifyReport,
} from "server/mongodb/actions/Report";
import { pdf } from "server/pdf/generatePDF";

export async function POST(Request) {
  // Create a report
  const res = await createReport(await Request.json());

  // HTTP Response
  if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res.id) {
    return new Response(res.id, { status: 201 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}

export async function GET() {
  const requestHeaders = headers();
  const request = requestHeaders.get("request");
  let res;

  // Switch case to differentiate GET requests
  switch (request) {
    case "1": {
      // Get 20 of a Users reports, ordered by date most recent
      const user = requestHeaders.get("user"); // or "email";
      const index = requestHeaders.get("index");
      res = await getUserReports(user, index);
      break;
    }
    case "2": {
      // Get most recent user report with user username/email
      const user = requestHeaders.get("user");
      res = await getReport(user);
      break;
    }
    case "3": {
      // Get total number of reports for fiscal year and quarter,
      // and number for each category for the given quarter
      const user = requestHeaders.get("user");
      const date = new Date();
      res = await getUserReports(user, date);
      break;
    }
    case "4": {
      // Get specific report with report ID
      const report = requestHeaders.get("report");
      res = await getReport(report);
      break;
    }
    case "5": {
      // Download a single report PDF
      res = pdf();
      // return new Response(await res, {
      //   headers: {
      //     //...response.headers,
      //     "Content-Type": "application/pdf",
      //     "Content-disposition": `attachment;filename="pdfy.pdf"`,
      //   },
      //   status: 200
      // });
      break;
    }
    case "6": {
      // const root = __dirname.split(".next")[0];
      // const destinationFolder = `${root}.next/server/vendor-chunks/data`;
      // const dataFolder = `${root}node_modules/pdfkit/js/data`;
      // const file = `${destinationFolder}/Helvetica.afm`;
      // const exists = await fileExists(file);
      // if (exists === false) {
      //   fs.cp(dataFolder, destinationFolder, { recursive: true }, (err) => {
      //     if (err) {
      //       console.error(err);
      //     }
      //   });
      // }
      const root = __dirname.split(".next")[0];
      const destinationFolder = `${root}.next/server/vendor-chunks/data`;
      const dataFolder = `${root}node_modules/pdfkit/js/data`;
      const file = `${destinationFolder}/Helvetica.afm`;
    
      try {
        const exists = await fileExists(file);
        if (exists === false) {
          await promisify(fs.cp)(dataFolder, destinationFolder, { recursive: true });
        }
      } catch (err) {
        console.error(err);
      }

      // Download a checklist of report PDFs
      let filename = "newPDF";
      const doc = new PDFDocument();
      doc.pipe(res);
      doc.fontSize(25).text("Some header");
      doc.end();
      return new Response(res, {
        headers: {
          //...response.headers,
          "Content-Type": "application/pdf",
          "Content-disposition": `attachment;filename="${filename}.pdf"`,
        },
        status: 200,
      });
    }
    default: {
      return new Response("ERROR", { status: 400 });
    }
  }

  // HTTP Response
  if (res?.name != undefined) {
    res = JSON.stringify(res);
    return new Response(res, { status: 404 });
  } else if (res === "ERROR") {
    res = JSON.stringify(res);
    return new Response(res, { status: 400 });
  } else if (res) {
    res = JSON.stringify(res);
    return new Response(res, { status: 200 });
  } else {
    res = JSON.stringify(res);
    return new Response(res, { status: 400 });
  }
}

export async function DELETE(Request) {
  console.error("\n" + (await Request));
  const req = await Request.json();
  console.error("\n" + req);
  const res = await deleteReport(req);

  if (res == undefined) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response(res, { status: 400 });
  }
}

export async function PATCH(Request) {
  // Update/Edit a report
  const requestHeaders = headers();
  const report = requestHeaders.get("report");
  const res = await modifyReport(report, await Request.json());

  // HTTP Response
  if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res.id) {
    return new Response(res.id, { status: 200 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}
