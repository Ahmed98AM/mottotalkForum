const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const dbLink = process.env.DATABASE_LINK.replace(
  "<username>",
  process.env.DATABASE_USERNAME
)
  .replace("<password>", process.env.DATABASE_PASSWORD)
  .replace("<name>", process.env.DATABASE_NAME);
mongoose
  .connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection Successful!");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT, () => {
  console.log("server is running ...");
});
