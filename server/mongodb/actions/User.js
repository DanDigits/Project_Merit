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
      throw new Error("The password you entered is incorrect!");
    }
  } else {
    throw new Error("User does not exist!");
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
        reportType: userData.reportType,
        verified: false,
        isPasswordLocked: true,
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
    "-password -__v -_id"
    //"-__v -_id"
  ).catch(function (err) {
    return err;
  });
  return user;
}

export async function modifyUser(userId, userData) {
  await mongoDB();
  let user,
    password = userData?.password,
    newPassword = userData?.newPassword;
  if (userId.includes("@")) {
    user = await UserSchema.findOne({ email: userId });
  } else {
    user = await UserSchema.findOne({ _id: userId });
    userId = user.email;
  }

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
  } else if (
    password == undefined &&
    newPassword != undefined &&
    userData?.firstName == undefined &&
    userData?.lastName == undefined &&
    userData?.suffix == undefined
  ) {
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
    user = await UserSchema.findOneAndUpdate({ email: userId }, userData).catch(
      function (err) {
        return err;
      }
    );
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

export async function verifyUser(userId) {
  await mongoDB();
  let user = await UserSchema.findOne({ _id: userId });
  if (user.verified == true && user.isPasswordLocked == true) {
    user = await UserSchema.findByIdAndUpdate(userId, {
      isPasswordLocked: false,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
    setTimeout(60000 * 5);
    user = await UserSchema.findByIdAndUpdate(userId, {
      isPasswordLocked: true,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  } else if (user.verified == false && user.isPasswordLocked == true) {
    user = await UserSchema.findByIdAndUpdate(userId, {
      verified: true,
    }).catch(function (err) {
      console.log(err);
      return "ERROR";
    });
  }
  return "OK";
}
