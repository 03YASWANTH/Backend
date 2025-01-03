const { connectDB } = require("./config/connectDatabase");
const { AdminRouter } = require("./routes/admin");
const { CounsellorRouter } = require("./routes/faculty");
const express = require("express");
const app = express();
app.use(express.json());
app.use(require("cors")());


require("dotenv").config({
  path: "./.env",
});

app.use(require("body-parser").json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1/counsellor', CounsellorRouter);


app.listen(process.env.PORT, () => {
  console.log("Server is running on",process.env.PORT);
});