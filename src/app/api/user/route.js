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
} from "server/mongodb/actions/User";
import urls from "../../../../utils/getPath";
import nodemailer from "nodemailer";

export async function GET(Request) {
  const headersInstance = headers();
  const user = headersInstance.get("user");
  let res;

  if (!user) {
    const url = new URL(Request.url);
    const userId = url.searchParams.get("num");
    if (userId) {
      res = await verifyUser(userId);
    } else {
      return new Response("ERROR", { status: 400 });
    }
  } else if (user) {
    res = await getUser(user);
  }

  if (res && user) {
    return new Response(res, { status: 200 });
  } else if (res && !user) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}

export async function POST(Request) {
  const req = await Request.json();
  const res = await signUp(req);
  if (res.id) {
    // Send email verification link
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

    const mailData = {
      from: process.env.EMAIL_FROM,
      to: req.email,
      subject: process.env.EMAIL_SUBJECT,
      text: "Sent from: " + process.env.EMAIL_FROM,
      html: `<div>${`Hello! Please verify your email at ${
        urls.baseUrl + urls.api.user.verify
      }?num=${res.id}`}</div>`,
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
  const headersInstance = headers();
  const user = headersInstance.get("user");
  const res = await modifyUser(user, await Request.json());

  if (res.name == "ValidationError") {
    return new Response(res, { status: 422 });
  } else if (res.message) {
    return new Response(res.message, { status: 400 });
  } else if (res) {
    return new Response(res.id, { status: 200 });
  }
}

export async function DELETE() {
  const headersInstance = headers();
  const user = headersInstance.get("user");
  const res = await deleteUser(user);

  if (res.id) {
    return new Response("OK", { status: 200 });
  } else if (res) {
    return new Response(res, { status: 400 });
  }
}
