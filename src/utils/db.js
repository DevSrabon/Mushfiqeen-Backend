const mongoose = require("mongoose");
require("dotenv").config();

// Database connection setup
const database = (module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Musfiqeen",
  };

  try {
    mongoose.connect(process.env.DATABASE, connectionParams);
    console.log("Database connected succesfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
});
