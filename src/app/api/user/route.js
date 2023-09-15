/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
//import { headers } from "next/headers";
import { signUp, changeDetails } from "server/mongodb/actions/User";

export async function POST(Request) {
  //console.log(await Request.json());
  const res = await signUp(await Request.json());
  if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res == "ConflictError") {
    return new Response("ERROR", { status: 400 });
  } else if (res.name) {
    return new Response(res, { status: 400 });
  } else if (res) {
    return new Response(res, { status: 200 });
  }
}

// Decide how update information will be passed
export async function PATCH(Request) {
  const headersInstance = headers();
  const user = headersInstance.get("user");

  const res = await modifyReport(user, Request);
}
