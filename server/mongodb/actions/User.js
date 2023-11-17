/* eslint-disable no-unused-vars */
import bcrypt from "bcryptjs";
import mongoDB from "../dbConnection";
import UserSchema from "../models/User";
import ReportSchema from "../models/Report";
import { mongo } from "mongoose";

// Login user to site
export async function login({ email, password }) {
  const date = new Date();

  if (email == null || password == null) {
    throw new Error("All parameters must be provided!");
  }
  await mongoDB();
  const user = await UserSchema.findOne({ email });
  if (user != null) {
    const didMatch = await bcrypt.compare(password, user.password);
    if (!didMatch) {
      throw new Error("Invalid credentials");
    }
  } else {
    throw new Error("Invalid credentials");
  }
  if (user.verified == false) {
    throw new Error("Unverified account");
  }
  if (user.suspended == true) {
    throw new Error("Suspended account");
  }

  //Update last signed in date
  modifyUser(email, { lastLogin: date.toISOString().substring(0, 10) });
  return user;
}

// Sign up user
export async function signUp(userData) {
  await mongoDB();
  const user = await UserSchema.findOne({ email: userData.email });
  if (user) {
    const res = "ConflictError"; //User exists so return error
    return res;
  }
  let randomHash = await bcrypt.hash("gouewyrnpvsuoyashodpifjnbosuihsofb~", 3); //This line creates a hash to use(send) with email for 2FA authentication
  return bcrypt
    .hash(userData.password, 10)
    .then((hashedPassword) =>
      UserSchema.create({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        suffix: userData.suffix,
        rank: userData.rank,
        verified: userData.verified,
        role: userData.role,
        emailVerification: randomHash,
        group: userData?.group,
        supervisedGroup: userData?.supervisedGroup,
        lastLogin: userData?.lastLogin,
      }).catch(function (err) {
        return err;
      })
    )
    .then((user) => {
      return user;
    });
}

// Return user information
export async function getUser(userId) {
  await mongoDB();
  let user,
    filter = "-password -__v -_id -passwordLocked"; //Return without user password, id, password lock status, __v mongo info.
  //If statement to retrieve user from database
  if (userId?.includes("@")) {
    user = await UserSchema.findOne({ email: userId }, filter).catch(function (
      err
    ) {
      return err;
    });
  } else {
    user = await UserSchema.findOne({ _id: userId }, filter).catch(function (
      err
    ) {
      return err;
    });
  }
  return user;
}

// Update user information in database
export async function modifyUser(userId, userData) {
  await mongoDB();
  let user,
    password = userData?.password,
    newPassword = userData?.newPassword;
  //If statement to retrieve user from database, and set userId to the users email
  if (userId.includes("@")) {
    user = await UserSchema.findOne({ email: userId });
  } else {
    user = await UserSchema.findOne({ _id: userId });
    userId = user.email;
  }

  // Resetting password while being logged in (e.g. verify with current password)
  if (password != undefined && newPassword != undefined) {
    await verifyUser(userData?.emailVerification); //If user is email verified, undo password lock
    const didMatch = await bcrypt.compare(userData.password, user.password);
    if (!didMatch) {
      user.message = "INCORRECT"; //If current password does not match, return error
    } else if (didMatch && user.passwordLocked == false) {
      return bcrypt
        .hash(userData.newPassword, 10)
        .then((hashedPassword) =>
          UserSchema.findOneAndUpdate(
            { email: userId },
            { password: hashedPassword }
          ).catch(function (err) {
            return err;
          })
        )
        .then((user) => {
          return user;
        });
    } else {
      user.message = "UNABLE"; //Error response if unable to reset password when user is logged in
    }
  } else if (
    password == undefined &&
    newPassword != undefined &&
    user.passwordLocked == false
  ) {
    // Forgot password; user is not logged in. verifyUser() verified email code for password reset
    await verifyUser(userData?.emailVerification); //If user is email verified, undo password lock
    let random = await bcrypt.hash("gouewyrnpvsuoyashodpifjnbosuihsofb~", 3);
    return bcrypt
      .hash(userData.newPassword, 10)
      .then((hashedPassword) =>
        UserSchema.findOneAndUpdate(
          { email: userId },
          { password: hashedPassword },
          { emailVerification: random }
        ).catch(function (err) {
          return err;
        })
      )
      .then((user) => {
        return user;
      });
  } else if (
    password == undefined &&
    newPassword == undefined &&
    user.passwordLocked == true
  ) {
    // General user update
    // Verify user credentials if admin header exists in request, and force security if verification fails
    if (userData?.adminCredentials != undefined) {
      const verifyAdminCredentials = await getUser(userData?.adminCredentials);
      if (verifyAdminCredentials?.role !== "Admin") {
        userData.role = user?.role;
        userData.verified = user?.verified;
        userData.passwordLocked = true;
        userData.suspended = user?.suspended;

        // Check if user is already present in a group; prevent changing group with error return
        // (user group not empty) && (group in request different from user group) && (group request not empty)
        if (
          (user?.group != undefined ||
            user?.group != [] ||
            user?.group != "") &&
          userData?.group != user?.group &&
          (userData?.group != undefined ||
            userData?.group != [] ||
            userData?.group != "")
        ) {
          user.message = "CONFLICT";
          return user;
        }
      }
    }

    // Update user
    user = await UserSchema.findOneAndUpdate({ email: userId }, userData).catch(
      function (err) {
        return err;
      }
    );
  } else {
    // Error response if no conditions are met
    user.message = "ERROR";
    return user;
  }

  return user;
}

// Rename a group by looping through the members, and updating
export async function renameGroup(group, groupData) {
  await mongoDB();
  let i = 0;
  const user = await UserSchema?.find({ group }).catch(function (err) {
    return err;
  });
  while (user?.[i] != undefined) {
    user[i].group = groupData.newGroup;
    await UserSchema?.findOneAndUpdate(
      { email: user[i].email },
      { group: user[i].group }
    );
    i++;
  }

  i = 0;
  const supervisor = await UserSchema?.find({ supervisedGroup: group }).catch(
    function (err) {
      return err;
    }
  );
  while (supervisor?.[i] != undefined) {
    //console.log(supervisor[i].supervisedGroup);
    //console.log(group);
    supervisor[i].supervisedGroup = groupData.newGroup;
    await UserSchema?.findOneAndUpdate(
      { email: supervisor[i].email },
      { supervisedGroup: supervisor[i].supervisedGroup }
    );
    i++;
  }

  user.id = "OK";
  return user;
}

// Delete a user and their reports
export async function deleteUser(userId) {
  await mongoDB();
  // This code is for deleting a single user at a time
  // user = await UserSchema.findOneAndDelete({ email: userId }).catch(
  //   function (err) {
  //     return err;
  //   }
  // );
  let i = 0;
  let j = 0;
  let length = userId?.email?.length;
  let user, reports, report;

  if (length == undefined) {
    return "ERROR";
  } else {
    while (i < length) {
      user = await UserSchema?.findOneAndDelete({
        email: userId?.email[i],
      }).catch(function (err) {
        return err;
      });
      reports = await ReportSchema?.find(
        { email: userId?.email[i] },
        "_id"
      ).catch(function (err) {
        console.log("NO REPORTS FOR USER");
      });
      while (reports[j] != undefined) {
        report = await ReportSchema?.findByIdAndDelete(reports[j].id).catch(
          function (err) {
            return err;
          }
        );
        j++;
      }
      i++;
    }
  }
  return i;
}

// Delete a group by looping through the members, and removing
export async function deleteGroup(group) {
  await mongoDB();
  let i = 0;
  const user = await UserSchema?.find({ group }).catch(function (err) {
    return err;
  });
  while (user?.[i] != undefined) {
    user[i].group = "";
    console.log(user[i].group);
    await UserSchema?.findOneAndUpdate(
      { email: user[i].email },
      { group: user[i].group }
    );
    i++;
  }

  i = 0;
  const supervisor = await UserSchema?.find({ supervisedGroup: group }).catch(
    function (err) {
      return err;
    }
  );
  while (supervisor?.[i] != undefined) {
    supervisor[i].supervisedGroup = "";
    //console.log(supervisor[i].supervisedGroup);
    await UserSchema?.findOneAndUpdate(
      { email: supervisor[i].email },
      { supervisedGroup: supervisor[i].supervisedGroup }
    );
    i++;
  }
  user.id = "OK";
  return user;
}

// Verify a user from a 2FA email code
export async function verifyUser(code) {
  await mongoDB();
  let user = await UserSchema?.findOne({ emailVerification: code });

  if (user == undefined) {
    //Email 2FA code expired
    return "EXPIRED";
  } else if (user?.verified == false) {
    //Verify the user
    user = await UserSchema.findByIdAndUpdate(user.id, {
      verified: true,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
    passwordLock(user.email); //Recreate email hash
    return "VERIFIED";
  } else if (user?.verified == true) {
    //Unlock the users password to allow for reset, then lock the password after the set amount of time.
    user = await UserSchema.findByIdAndUpdate(user.id, {
      passwordLocked: false,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
    setTimeout(passwordLock, 60000 * 15, user.email); // 60000 = 1 minute
    return "NUM";
  } else {
    return "ERROR";
  }
}

// Set the users passwordLocked field to prevent unauthorized password resets (and recompute email 2FA hash)
export async function passwordLock(userId) {
  await mongoDB();
  let random = await bcrypt.hash("gouewyrnpvsuoyashodpifjnbosuihsofb~", 3);
  let user = await UserSchema.findOneAndUpdate(
    { email: userId },
    {
      passwordLocked: true,
      emailVerification: random,
    }
  ).catch(function (err) {
    console.log(err);
    return "ERROR";
  });
  user.emailVerification = random;
  return user;
}

// Prevent user from logging in
export async function suspendUser(userId) {
  await mongoDB();
  // const verifyAdminCredentials = await getUser(userData?.adminCredentials);
  //     if (verifyAdminCredentials?.role !== "Admin") {
  //       userData.role = user?.role;
  //       userData.verified = user?.verified;
  //       userData.passwordLocked = true;
  //       userData.suspended = user?.suspended;

  //       // Check if user is already present in a group; prevent changing group with error return
  //       // (user group not empty) && (group in request different from user group) && (group request not empty)
  //       if (
  //         (user?.group != undefined ||
  //           user?.group != [] ||
  //           user?.group != "") &&
  //         userData?.group != user?.group &&
  //         (userData?.group != undefined ||
  //           userData?.group != [] ||
  //           userData?.group != "")
  //       ) {
  //         user.message = "CONFLICT";
  //         return user;
  //       }
  //     }
  let user = await UserSchema.findOne({ email: userId });
  if (user.suspended == true) {
    user = await UserSchema.findOneAndUpdate(
      { email: userId },
      { suspended: false }
    ).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  } else {
    user = await UserSchema.findOneAndUpdate(
      { email: userId },
      { suspended: true }
    ).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  }
  return user;
}

// Get group information
export async function getGroup(group) {
  await mongoDB();
  let members = [];
  let categories = "Mission Leadership Resources Unit";
  let supervisorFilter = "firstName lastName rank suffix email";
  let filter =
    "email firstName lastName rank suffix mostRecentReportDate totalReports currentQuarter quarterReports" +
    " " +
    categories;

  let supervisors = await UserSchema?.find(
    { supervisedGroup: group },
    supervisorFilter
  )
    .sort({ lastName: 1, firstName: 1 })
    .catch(function (err) {
      console.log(err);
      return "ERROR";
    });

  let personnel = await UserSchema?.find({ group }, filter)
    .sort({ lastName: 1, firstName: 1 })
    .catch(function (err) {
      console.log(err);
      return "ERROR";
    });

  if (personnel == undefined) {
    personnel = "";
  }
  if (supervisors == undefined) {
    supervisors = "";
  }

  //Push retrieved arrays onto members 2D array
  //members[0][n] are supervisors, members[1][n] are personnel
  members.push(supervisors);
  members.push(personnel);

  return members;
}

export async function getGroupOrphans() {
  await mongoDB();
  const orphans = await UserSchema?.find({ group: [] }).catch(function (err) {
    console.log(err);
    return "ERROR";
  });
  return orphans;
}

export async function getAllUsers() {
  await mongoDB();
  let filter =
    "email rank firstName lastName suffix id role group supervisedGroup totalReports mostRecentReportDate lastLogin suspended";
  const users = await UserSchema?.find({ email: { $exists: true } }, filter)
    .sort({ lastName: 1, firstName: 1 })
    .catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  return users;
}

export async function getSupervisor(group) {
  let supervisors = [],
    i = 0,
    currentGroup = await getGroup(group);

  // If current group isnt empty, push supervisor profile to supervisors array
  while (currentGroup?.[0]?.[i] != undefined) {
    supervisors.push(currentGroup[0][i]);
    i++;
  }

  return supervisors;
}

export async function getGroups() {
  await mongoDB();
  let i = 0;
  let array = [];
  let groups = await UserSchema?.find().distinct("group");

  // Filter out empty strings
  groups = groups.filter((group) => group !== "" && group != null);

  while (i < groups?.length) {
    let supervisor = await UserSchema?.find(
      { supervisedGroup: groups[i] },
      "firstName lastName rank suffix email"
    );
    array.push([groups[i], supervisor[0]]);
    i++;
  }
  return array;
}

export async function removeMultipleUsers(users) {
  await mongoDB();
  let user,
    res = [],
    i = 0;
  let length = users?.email?.length;

  if (length == undefined) {
    return "ERROR";
  } else {
    while (i < length) {
      user = await UserSchema?.findOneAndUpdate(
        { email: users?.email[i] },
        { group: [] }
      ).catch(function (err) {
        return err;
      });
      i++;
    }
  }
  res.id = length;
  return res;
}
