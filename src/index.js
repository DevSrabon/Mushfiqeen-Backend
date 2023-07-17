const app = require("./app");
const database = require("./utils/db");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8000;

// Database
database();

app.listen(port, () => console.log("Server is running on " + port));
