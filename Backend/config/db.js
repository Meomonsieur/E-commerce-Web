const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(" Checking MONGO_URI:", process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error(" MONGO_URI không được định nghĩa trong .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI); // Xóa các option cũ

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
