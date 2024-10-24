const mng = require("mongoose");
require("dotenv").config({
  path: "../.env",  
});

async function connectDB() {
  try 
  {
    const connection = await mng.connect(process.env.MONGO_URI);
    console.log("Connected to DB successfully at host:");
  } 
  catch (error) 
  {
    console.error("Failed to connect to the DB:", error.message);
  }
}

module.exports = { connectDB };