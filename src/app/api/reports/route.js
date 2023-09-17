/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { headers } from "next/headers";
import {
  createReport,
  getReport,
  getUserReports,
  deleteReport,
  modifyReport,
} from "server/mongodb/actions/Report";

export async function POST(Request) {
  const res = await createReport(await Request.json());
  if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res.id) {
    return new Response(res.id, { status: 201 });
  }
}

export async function GET() {
  const headersInstance = headers();
  const user = headersInstance.get("user"); // or "email"
  const report = headersInstance.get("report");
  var res;

  if (user) {
    res = await getUserReports(user);
  } else if (report) {
    res = await getReport(report);
  } else {
    return new Response("ERROR", { status: 400 });
  }

  if (res.name) {
    return new Response(res, { status: 404 });
  } else if (res) {
    return new Response(res, { status: 200 });
  } else {
    return new Response(res, { status: 400 });
  }
}

// Decide how delete implementation will work, currently uses "report" header
export async function DELETE() {
  const headersInstance = headers();
  const report = headersInstance.get("report");

  const res = await deleteReport(report);
  if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res) {
    return new Response(res.id, { status: 200 });
  }
}

export async function PATCH(Request) {
  const headersInstance = headers();
  const report = headersInstance.get("report");

  const res = await modifyReport(report, await Request.json());
  if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res) {
    return new Response(res.id, { status: 200 });
  }
}
