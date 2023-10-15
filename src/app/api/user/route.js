/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { headers } from "next/headers";
import {
  modifyUser,
  signUp,
  verifyUser,
  deleteUser,
  getUser,
  passwordLock,
} from "server/mongodb/actions/User";
import urls from "../../../../utils/getPath";
import nodemailer from "nodemailer";
import { redirect } from "next/navigation";

const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_SERVER_PORT,
  host: process.env.EMAIL_SERVER_HOST,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: false,
  requireTLS: true,
});

export async function GET(Request) {
  const requestHeaders = headers();
  const user = requestHeaders?.get("user");
  const forgot = requestHeaders?.get("forgot");
  let res;

  // Send email if user forgot password
  if (forgot != undefined && user == undefined) {
    res = await getUser(forgot);
    if (res?.email != undefined && res?.emailVerification != undefined) {
      const mailData = {
        from: process.env.EMAIL_FROM,
        to: forgot,
        subject: process.env.EMAIL_SUBJECT,
        text: "Sent from: " + process.env.EMAIL_FROM,
        html: `<div>${`Hello! Please click this link to reset your password ${
          urls.baseUrl + urls.api.user.verify
        }?num=${res.emailVerification}`}</div>`,
      };
      transporter.sendMail(mailData, function (err) {
        //console.log(mailData);
        if (err) {
          console.log(err);
        }
      });
      setTimeout(passwordLock, 60000 * 5, res.email);
    } else {
      return new Response("ERROR", { status: 400 });
    }

    // Verify new user
  } else if (user == undefined && forgot == undefined) {
    const url = new URL(Request.url);
    let extension = "";
    let emailCode = url?.searchParams?.get("num");
    if (emailCode != undefined) {
      res = await verifyUser(emailCode);
      if (res == "NUM") {
        extension = "?num=" + emailCode;
      }
    } else {
      return new Response("ERROR", { status: 400 });
    }
    redirect(urls.baseUrl + "/Auth/Login" + extension);

    // Return existing user information
  } else if (user != undefined && forgot == undefined) {
    res = await getUser(user);
  }

  if (res) {
    res = JSON.stringify(res);
    return new Response(res, { status: 200 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}

export async function POST(Request) {
  Request.verified = false;
  const req = await Request.json();
  const res = await signUp(req);
  if (res?.id != undefined || res?.id != "ConflictError") {
    const mailData = {
      from: process.env.EMAIL_FROM,
      to: req.email,
      subject: process.env.EMAIL_SUBJECT,
      text: "Sent from: " + process.env.EMAIL_FROM,
      html: `<div>${`Hello! Please verify your email at ${
        urls.baseUrl + urls.api.user.verify
      }?num=${res.emailVerification}`}</div>`,
    };
    transporter.sendMail(mailData, function (err) {
      console.log(mailData);
      if (err) {
        console.log(err);
      }
    });

    return new Response("OK", { status: 200 });
  } else if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res == "ConflictError") {
    return new Response("EXISTS", { status: 400 });
  } else if (res.name) {
    return new Response(res.message, { status: 400 });
  } else {
    return new Response("SERVER ERROR", { status: 400 });
  }
}

export async function PATCH(Request) {
  const requestHeaders = headers();
  const user = requestHeaders.get("user");
  const res = await modifyUser(user, await Request.json());

  if (res.name == "ValidationError" /*|| res.message == "INCORRECT"*/) {
    // if (res.name) {
    //   res.message = res;
    // }
    return new Response(res.message, { status: 422 }); // res.message may not be proper response object
  } else if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res.id) {
    return new Response(res.id, { status: 200 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}

export async function DELETE() {
  const requestHeaders = headers();
  const user = requestHeaders.get("user");
  const res = await deleteUser(user);

  if (res.id) {
    return new Response("OK", { status: 200 });
  } else if (res) {
    return new Response(res, { status: 400 });
  }
}
