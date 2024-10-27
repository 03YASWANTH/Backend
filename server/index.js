const { connectDB } = require("./config/connectDatabase");
const { AdminRouter } = require("./routes/admin");
const { FacultyRouter } = require("./routes/faculty");

const app = require("express")();
app.use(require("express").json());
app.use(require("cors")());

require("dotenv").config({
  path: "./.env",
});

app.use(require("body-parser").json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/faculty", FacultyRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
