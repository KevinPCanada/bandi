// Imports Mongoose for database interaction and dotenv to load environment variables.
import mongoose from 'mongoose';
import 'dotenv/config'; 

// Defines and exports an asynchronous function to connect to the MongoDB database.
const connectDB = async () => {
  try {
    // Attempts to connect to MongoDB using the connection string from the .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Catches any connection errors, logs them, and exits the application.
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;

