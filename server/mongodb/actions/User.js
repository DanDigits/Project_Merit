import bcrypt from "bcryptjs";
import mongoDB from "../dbConnection";
import UserSchema from "../models/User";

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
        verified: false,
        isAdmin: false,
        isPasswordLocked: true,
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
  const user = await UserSchema.findOne(
    { email: userId },
    "-password -__v -_id -isPasswordLocked" //Return without user password, id, password lock status, __v mongo info.
    //"-__v -_id"
  ).catch(function (err) {
    return err;
  });
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
    user = await UserSchema.findOne({ emailVerification: userId });
    userId = user.email;
  }

  // Resetting password while being logged in (e.g. verify with current password)
  if (password != undefined && newPassword != undefined) {
    await verifyUser(userData?.emailVerification); //If user is email verified, undo password lock
    const didMatch = await bcrypt.compare(userData.password, user.password);
    if (!didMatch) {
      user.message = "INCORRECT"; //If current password does not match, return error
    } else if (didMatch && user.isPasswordLocked == false) {
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
      user.message = "UNABLE"; //Error response if unable to reset password when user logged in
    }
  } else if (
    password == undefined &&
    newPassword != undefined &&
    user.isPasswordLocked == false
  ) {
    // Forgot password so isnt logged in, verifyUser() verified email code for password reset
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
    user.isPasswordLocked == true
  ) {
    // General user information update
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

// Delete a user from the database
export async function deleteUser(userId) {
  await mongoDB();
  const user = await UserSchema.findOneAndDelete({ email: userId }).catch(
    function (err) {
      return err;
    }
  );
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
      isPasswordLocked: false,
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

// Set the users isPasswordLocked field to prevent unauthorized password resets (and recompute email 2FA hash)
export async function passwordLock(userId) {
  let random = await bcrypt.hash("gouewyrnpvsuoyashodpifjnbosuihsofb~", 3);
  let user = await UserSchema.findOneAndUpdate(
    { email: userId },
    {
      isPasswordLocked: true,
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
  let user = await UserSchema.findOneAndUpdate(
    { email: userId },
    { verified: false }
  ).catch(function (err) {
    console.log(err);
    return "ERROR";
  });
  return user;
}

// Promote or demote user in relation to current Admin role status
export async function makeAdmin(userId) {
  let user = await UserSchema?.findOne({ email: userId });
  if (user?.isAdmin == true) {
    user = await UserSchema.findOneAndUpdate(
      { email: userId },
      { isAdmin: false }
    ).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  } else if (user?.isAdmin == false) {
    user = await UserSchema.findOneAndUpdate(
      { email: userId },
      { isAdmin: true }
    ).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  } else {
    return "ERROR";
  }
  return user;
}

// export async function getAllUsers() {
//   let all =
// }

// Get group information
export async function getGroup(group) {
  let members = [];
  let personnel = await UserSchema?.find(
    { group },
    "-password -__v -_id -isPasswordLocked -emailVerification -verified"
  ).catch(function (err) {
    console.log(err);
    return "ERROR";
  });
  let supervisors = await UserSchema?.find(
    { supervisedGroup: group },
    "-password -__v -_id -isPasswordLocked -emailVerification -verified"
  ).catch(function (err) {
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
  const orphans = await UserSchema?.find({ group: [] }).catch(function (err) {
    console.log(err);
    return "ERROR";
  });
  return orphans;
}

export async function getAllUsers() {
  const users = await UserSchema?.find({ email: { $exists: true } }).catch(
    function (err) {
      console.log(err);
      return "ERROR";
    }
  );
  return users;
}
