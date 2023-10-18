import bcrypt from "bcryptjs";
import mongoDB from "../dbConnection";
import UserSchema from "../models/User";

export async function login({ email, password }) {
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
  return user;
}

export async function signUp(userData) {
  await mongoDB();
  const user = await UserSchema.findOne({ email: userData.email });
  if (user) {
    const res = "ConflictError";
    return res;
  }
  let random = await bcrypt.hash("gouewyrnpvsuoyashodpifjnbosuihsofb~", 3);
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
        isPasswordLocked: true,
        emailVerification: random,
      }).catch(function (err) {
        return err;
      })
    )
    .then((user) => {
      return user;
    });
}

export async function getUser(userId) {
  await mongoDB();
  const user = await UserSchema.findOne(
    { email: userId },
    "-password -__v -_id -isPasswordLocked"
    //"-__v -_id"
  ).catch(function (err) {
    return err;
  });
  return user;
}

export async function modifyUser(userId, userData) {
  await mongoDB();
  await verifyUser(userData?.emailVerification);
  let user,
    password = userData?.password,
    newPassword = userData?.newPassword;
  if (userId.includes("@")) {
    user = await UserSchema.findOne({ email: userId });
  } else {
    user = await UserSchema.findOne({ emailVerification: userId });
    userId = user.email;
  }

  // Resetting password while being logged in (e.g. enter old, enter new)
  if (password != undefined && newPassword != undefined) {
    const didMatch = await bcrypt.compare(userData.password, user.password);
    if (!didMatch) {
      user.message = "INCORRECT";
    } else if (didMatch) {
      //} else if (didMatch && user.isPasswordLocked == false) {
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
      user.message = "UNABLE";
    }

    // Forgot password, verifyUser() verifies email code
  } else if (
    password == undefined &&
    newPassword != undefined &&
    user.isPasswordLocked == false
  ) {
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

    // General user information update
  } else if (
    password == undefined &&
    newPassword == undefined &&
    user.isPasswordLocked == true
  ) {
    user = await UserSchema.findOneAndUpdate({ email: userId }, userData).catch(
      function (err) {
        return err;
      }
    );

    // Error response if no conditions are met
  } else {
    user.message = "ERROR";
    return user;
  }
  return user;
}

export async function deleteUser(userId) {
  await mongoDB();
  const user = await UserSchema.findOneAndDelete({ email: userId }).catch(
    function (err) {
      return err;
    }
  );
  return user;
}

export async function verifyUser(code) {
  await mongoDB();
  let user = await UserSchema?.findOne({ emailVerification: code });

  if (user == undefined) {
    return "EXPIRED";
  } else if (user?.verified == false) {
    user = await UserSchema.findByIdAndUpdate(user.id, {
      verified: true,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
    passwordLock(user.email);
    return "VERIFIED";
  } else if (user?.verified == true) {
    user = await UserSchema.findByIdAndUpdate(user.id, {
      isPasswordLocked: false,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
    setTimeout(passwordLock, 60000 * 15, user.email);
    return "NUM";
  } else {
    return "ERROR";
  }
}

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
