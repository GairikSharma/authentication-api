const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/schema");

const secretKey =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
console.log(`Secret Key: ${secretKey}`);

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const currUser = await User.findOne({ email });

    if (!currUser) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const isMatch = await bcrypt.compare(password, currUser.password);
    if (isMatch) {
      const token = jwt.sign({ email: currUser.email }, secretKey, {
        expiresIn: "7d",
      });

      return res.status(201).json({
        message: "Login successful",
        token: token,
        user: {
          name: currUser.name,
          email: currUser.email,
        },
      });
    } else {
      return res.status(403).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

module.exports = { login_user: loginUser, authToken: authenticateToken };
