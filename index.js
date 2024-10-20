const { connectDB } = require("./config/connectDatabase");
const { AdminRouter } = require("./routes/admin");

const app = require("express")();

require("dotenv").config({
  path: "./.env",
});

app.use(require("body-parser").json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/api/v1/admin', AdminRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on http://localhost:3000");
});