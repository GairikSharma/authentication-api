const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
dotenv.config()
const port = 7000;


const createUserController = require("./controllers/signup");
const loginUserController = require("./controllers/login");
const authToken = require("./controllers/login");
const token = authToken.authToken;

const app = express();
app.use(express.json());
app.use(cors());

//Connencting to the database
let connectToDatabase = require("./connection/connection");
connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello from the server...");
});

app.post("/register", createUserController.new_user);
app.post("/login", loginUserController.login_user);

app.get("/protected", token, (req, res) => {
  res.status(200).send("This is a protected route.");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

