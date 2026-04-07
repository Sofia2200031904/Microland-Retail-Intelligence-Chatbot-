const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is missing. Using in-memory sample data.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to sample data.");
    console.warn(error.message);
    return false;
  }
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectToDatabase,
  isDatabaseConnected
};

