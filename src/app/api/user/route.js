/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
//import { headers } from "next/headers";
import { login, signUp } from "server/mongodb/actions/User";

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
