require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`SUNDAY API running at http://localhost:${PORT}`);
  });
};

startServer();
