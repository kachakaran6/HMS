import mongoose from "mongoose";

export const dbConn = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(`Some error while connecting db ${err}`);
    });
};
