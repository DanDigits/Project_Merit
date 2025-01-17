import mongoose from "mongoose";

export default async () => {
  if (mongoose.connections[0].readyState) return;

  await mongoose
    .connect(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
    })
    .catch((e) => {
      console.error("Error connecting to database.");
      throw e;
    });
};
