/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { headers } from "next/headers";
import fs from "fs";
import { PassThrough } from "stream";
import {
  createReport,
  getReport,
  getUserReports,
  deleteReport,
  modifyReport,
} from "server/mongodb/actions/Report";
import { pdf } from "server/pdf/generatePDF";

export async function POST(Request) {
  const requestHeaders = headers();
  const request = requestHeaders.get("request");
  let res;

  switch (request) {
    case "1": {
      // Create a report
      res = await createReport(await Request.json());

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
    case "2": {
      // if (process.env.NODE_ENV == "development") {
      //   // Patchwork for a PDFkit/NextJS bug
      //   const root = __dirname.split(".next")[0];
      //   const dataFolder = `${root}node_modules/pdfkit/js/data`;
      //   const destinationFolder = `${root}.next/server/vendor-chunks/data`;
      //   await fs.cp(dataFolder, `${root}.next/server/vendor-chunks/data`, {recursive: true}, (err) => {
      //     return new Response("FILESYSTEM ERROR", { status: 400 });
      //   });
      // }

      // Download a PDF of given report(s)
      const req = await Request.json();
      const stream = new PassThrough();
      let filename = "MyPDF";
      pdf(stream, req);

      // HTTP response, may be ineffective due to how stream operates
      if (stream) {
        return new Response(stream, {
          headers: {
            //...response.headers,
            "Content-Type": "application/pdf",
            "Content-disposition": `attachment;filename="${filename}.pdf"`,
          },
          status: 200,
        });
      } else {
        return new Response("ERROR", { status: 400 });
      }
    }
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
  const req = await Request.json();
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
