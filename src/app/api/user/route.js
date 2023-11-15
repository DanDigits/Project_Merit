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
  suspendUser,
  getGroup,
  getGroupOrphans,
  getAllUsers,
  deleteGroup,
  renameGroup,
  getSupervisor,
  getGroups,
} from "server/mongodb/actions/User";
import urls from "../../../../utils/getPath";
import nodemailer from "nodemailer";
import { redirect } from "next/navigation";

/* Mail related functions */
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
// Send email, wasnt named sendEmail
export async function resendMail(userId, subject) {
  // New verification code for every email
  let userData = await passwordLock(userId);

  // Email user search failed
  if (userData?.email == undefined) {
    return "ERROR";
  } else if (subject == "signup") {
    // Send 2FA email if user is new
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
      if (err) {
        console.log(err);
      }
    });
    setTimeout(deleteUser, 60000 * 1440 * 3, userData.email); // REPLACE THIS WITH DAILY CHECK ON DB
  } else {
    // Send 2FA email to change password
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
      if (err) {
        console.log(err);
      }
    });
    setTimeout(passwordLock, 60000 * 5, userData.email);
  }
  return userData;
}

// Routes ----------------------------------------------------------------------------
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
          res = await resendMail(res.email, "forgotPassword");
        } else {
          return new Response("ERROR", { status: 400 });
        }
        break;
      }
      case "2": {
        // Return existing user information
        const user = requestHeaders?.get("user");
        res = await getUser(user);
        if (res?.email) {
          res = JSON.stringify(res);
          return new Response(res, { status: 200 });
        } else {
          return new Response("ERROR", { status: 400 });
        }
      }
      case "3": {
        // Resend respective email
        const forgot = requestHeaders?.get("forgot");
        const user = requestHeaders?.get("user");
        if (forgot == undefined && user == undefined) {
          return new Response("ERROR", { status: 400 });
        } else if (forgot != undefined && user == undefined) {
          res = await resendMail(forgot, "forgotPassword");
        } else if (user != undefined && forgot == undefined) {
          res = await resendMail(user, "signup");
        } else {
          return new Response("ERROR", { status: 400 });
        }
        break;
      }
      case "4": {
        // Get given group members/users
        const group = requestHeaders?.get("group");
        res = await getGroup(group);
        if (res == "ERROR") {
          return new Response(JSON.stringify(res), { status: 400 });
        } else {
          return new Response(JSON.stringify(res), { status: 200 });
        }
      }
      case "5": {
        // Get users without groups
        res = await getGroupOrphans();
        if (res == "ERROR") {
          return new Response(JSON.stringify(res), { status: 400 });
        } else {
          return new Response(JSON.stringify(res), { status: 200 });
        }
      }
      case "6": {
        // Get all users
        res = await getAllUsers();
        if (res == "ERROR") {
          return new Response(JSON.stringify(res), { status: 400 });
        } else {
          return new Response(JSON.stringify(res), { status: 200 });
        }
      }
      case "7": {
        // Get members under a supervisor
        const group = requestHeaders?.get("group");
        res = await getSupervisorTable(group);
        if (res == "ERROR") {
          return new Response(JSON.stringify(res), { status: 400 });
        } else {
          return new Response(JSON.stringify(res), { status: 200 });
        }
      }
      case "8": {
        // Get groups
        res = await getGroups();
        if (res == "ERROR") {
          return new Response(JSON.stringify(res), { status: 400 });
        } else {
          return new Response(res, { status: 200 });
        }
      }
      case "9": {
        // Get given group members/users
        const group = requestHeaders?.get("group");
        res = await getSupervisor(group);
        if (res == "ERROR") {
          return new Response(JSON.stringify(res), { status: 400 });
        } else {
          return new Response(JSON.stringify(res), { status: 200 });
        }
      }
      default: {
        return new Response("ERROR", { status: 400 });
      }
    }
  } else if (verificationCode != undefined) {
    // If email 2FA code exists in URL, verify user either for new signup or for forgot password reset
    let extension = "";
    res = await verifyUser(verificationCode);

    // Below fixes the redirect URL for the respective case
    if (res == "NUM") {
      extension = "?num=" + verificationCode;
    } else if (res == "EXPIRED") {
      extension = "?expired=true";
    } else if (res == "VERIFIED") {
      extension = "?verified=true";
    } else if (res == "ERROR" && user != undefined) {
      extension = "?verified=false";
    } else {
      extension = "?error=true";
    }
    redirect(urls.baseUrl + "/Auth/Login" + extension);
  } else {
    return new Response("ERROR", { status: 400 });
  }

  // HTTP Response
  if (res?.email) {
    return new Response(res.id, { status: 200 });
  } else {
    return new Response("ERROR", { status: 400 });
  }
}

// Register new user with signup data
export async function POST(Request) {
  let req = await Request.json();
  const requestHeaders = headers();
  let admin = requestHeaders?.get("admin");
  let registrar = await getUser(admin);

  // Check if user was created by an administrator, and set verified accordingly
  if (registrar?.role == "Admin") {
    req.verified = true;
    admin = true;
  } else {
    req.verified = false;
    req.role = "User";
    admin = false;
  }

  // Create user
  let res = await signUp(req);

  // HTTP Responses
  if (res.name) {
    if (res.name == "ValidationError") {
      return new Response(res, { status: 422 });
    } else {
      return new Response(res.message, { status: 400 });
    }
  } else if (res == "ConflictError") {
    return new Response(JSON.stringify("EXISTS"), { status: 409 });
  } else if (res?.id != undefined && admin == false) {
    resendMail(res.email, "signup");
    return new Response("OK", { status: 200 });
  } else if (res?.id != undefined && admin == true) {
    resendMail(res.email, "forgotPassword"); // Change temp password
    return new Response("OK", { status: 200 });
  } else {
    return new Response("SERVER ERROR", { status: 400 });
  }
}

// Modify/Edit/Update user data
export async function PATCH(Request) {
  let res;
  let req = await Request.json();
  const requestHeaders = headers();
  const user = requestHeaders?.get("user");
  const group = requestHeaders?.get("group");
  const admin = requestHeaders?.get("admin");

  if (user == undefined && admin == undefined) {
    res = await renameGroup(group, req);
  } else if (group == undefined && admin == undefined) {
    res = await modifyUser(user, req);
  } else if (admin != undefined) {
    if (user == undefined && group == undefined) {
      res = await makeAdmin(admin, req);
    } else if (user != undefined && group == undefined) {
      res = await modifyUser(user, (req.adminCredentials = admin));
    } else {
      res.message = "TOO MANY REQUESTS";
    }
  } else {
    res.message = "ERROR";
  }

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

// Delete a user, or a group
export async function DELETE(Request) {
  let res, req;
  req = await Request.json();
  const requestHeaders = headers();
  const group = requestHeaders?.get("group");

  if (group != undefined) {
    res = await deleteGroup(group);
  } else {
    res = await deleteUser(req);
  }

  // HTTP Response
  if (res) {
    return new Response("OK", { status: 200 });
  } else {
    return new Response(res, { status: 400 });
  }
}
