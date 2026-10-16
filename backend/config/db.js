import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://<username>:<password>@cluster0.mongodb.net/food-del")
    .then(() => console.log("DB Connected"));
};