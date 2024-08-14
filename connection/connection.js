const mongoose = require('mongoose')

async function connectToDatabase() {
  try {
    await mongoose.connect(
      process.env.DB_URL
    );
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToDatabase;