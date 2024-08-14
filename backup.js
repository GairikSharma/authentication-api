const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const port = 7000;


const app = express();
app.use(express.json());
app.use(cors());

const users = [];
const secretKey = crypto.randomBytes(64).toString("hex");
console.log(secretKey);


app.get("/", (req, res) => {
  res.send("Hello from the server...");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    users.push(user);
    res.status(201).send("User created successfully...");
    console.log(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

//Login with token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const currUser = users.find((i) => i.email === email);

  if (!currUser) {
    return res.status(404).send("No user found with this email");
  }

  try {
    const isMatch = await bcrypt.compare(password, currUser.password);
    if (isMatch) {
      const token = jwt.sign({ email: currUser.email }, secretKey, {
        expiresIn: "7d",
      });
      res.status(201).json({ message: "login successfull", token: token });
    } else {
      res.status(403).send("Incorrect password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", loginUserController.login_user)

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).send("This is a protected route.");
});


app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
