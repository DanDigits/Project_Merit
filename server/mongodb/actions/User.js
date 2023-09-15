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
      }).catch(function (err) {
        return err;
      })
    )
    .then((user) => {
      return user;
    });
}

// Incomplete
export async function changeDetails(userData, userInfo) {
  await mongoDB();
  const user = await UserSchema.findOneAndUpdate(
    { userEmail: userData.email }, // May not be needed, may be fine with just userData -> user header
    userInfo // Figure out exactly how information will be passed into function
  ).catch(function (err) {
    return err;
  });
  return user;
}
