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

// Mail related functions
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

export async function resendMail(userId, subject) {
  // New verification code for every email
  let userData = await passwordLock(userId);
  //console.log(userData);

  // Send verification email if user is new
  if (subject == "signup") {
    const mailData = {
      from: process.env.EMAIL_FROM,
      to: userData.email,
      subject: process.env.EMAIL_SUBJECT,
      text: "Sent from: " + process.env.EMAIL_FROM,
      html: `<div>${`Hello! Please verify your email at ${
        urls.baseUrl + urls.api.user.verify
      }?num=${userData.emailVerification}`}</div>`,
    };
    transporter.sendMail(mailData, function (err) {
      //console.log(mailData);
      if (err) {
        console.log(err);
      }
    }); // TODO: Expire email signup and delete unused database entry

    // Send 2FA email for forgotten password
  } else {
    const mailData = {
      from: process.env.EMAIL_FROM,
      to: userData.email,
      subject: process.env.EMAIL_SUBJECT,
      text: "Sent from: " + process.env.EMAIL_FROM,
      html: `<div>${`Hello! Please click this link to reset your password ${
        urls.baseUrl + urls.api.user.verify
      }?num=${userData.emailVerification}`}</div>`,
    };
    transporter.sendMail(mailData, function (err) {
      //console.log(mailData);
      if (err) {
        console.log(err);
      }
    });
    // Expire email code/link in 5 minutes
    setTimeout(passwordLock, 60000 * 5, res.email);
  }
}

// Routes
export async function GET(Request) {
  const requestHeaders = headers();
  const request = requestHeaders.get("request");
  const url = new URL(Request.url);
  let verificationCode = url?.searchParams?.get("num");
  let res;

  if (verificationCode == undefined) {
    // Switch case to differentiate GET requests
    switch (request) {
      case "1": {
        // Send email if user forgot password
        const forgot = requestHeaders?.get("forgot");
        res = await getUser(forgot);
        if (res?.email != undefined && res?.emailVerification != undefined) {
          resendMail(res.email, "forgotPassword");
        } else {
          return new Response("ERROR", { status: 400 });
        }
        break;
      }
      case "2": {
        // Return existing user information
        const user = requestHeaders?.get("user");
        res = await getUser(user);
        break;
      }
      case "3": {
        // Resend email
        const forgot = requestHeaders?.get("forgot");
        const user = requestHeaders?.get("user");
        if (forgot == undefined && user == undefined) {
          return new Response("ERROR", { status: 400 });
        } else if (forgot != undefined) {
          resendMail(forgot, "forgotPassword");
          res = "OK";
        } else if (user != undefined) {
          resendMail(user, "signup");
          res = "OK";
        } else {
          return new Response("ERROR", { status: 400 });
        }
        break;
      }
      default: {
        return new Response("ERROR", { status: 400 });
      }
    }

    // Email 2FA code exists in URL, verify user either for new signup or for forgot password reset
  } else if (verificationCode != undefined) {
    let extension = "";
    res = await verifyUser(verificationCode);
    if (res == "NUM") {
      extension = "?num=" + verificationCode;
    }
    redirect(urls.baseUrl + "/Auth/Login" + extension);
  } else {
    return new Response("ERROR", { status: 400 });
  }

  // HTTP Response
  if (res) {
    res = JSON.stringify(res);
    return new Response(res, { status: 200 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}

export async function POST(Request) {
  // Register new user with signup data
  Request.verified = false;
  let res = await signUp(await Request.json());
  if (res?.id != undefined && res != "ConflictError") {
    resendMail(res.email, "signup");

    // HTTP Response
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
  // Modify/Edit/Update user data
  const requestHeaders = headers();
  const user = requestHeaders.get("user");
  const res = await modifyUser(user, await Request.json());

  // HTTP Response
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
  // Delete a user
  const requestHeaders = headers();
  const user = requestHeaders.get("user");
  const res = await deleteUser(user);

  // HTTP Response
  if (res.id) {
    return new Response("OK", { status: 200 });
  } else if (res) {
    return new Response(res, { status: 400 });
  }
}
