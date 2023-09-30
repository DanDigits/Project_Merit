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
  const user = await UserSchema.findOne({ email: userData.email });
  if (user) {
    const res = "ConflictError";
    return res;
  }
  await mongoDB();
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
        verified: userData.verified,
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
  ).catch(function (err) {
    return err;
  });
  return user;
}

export async function modifyUser(userId, userData) {
  await mongoDB();
  let user;

  if (userData?.password != undefined) {
    return bcrypt
      .hash(userData.password, 10)
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
    return user;
  }
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
  console.log(userId);
  await mongoDB();
  const user = await UserSchema.findByIdAndUpdate(userId, {
    verified: true,
  }).catch(function (err) {
    return err;
  });
  return user;
}
