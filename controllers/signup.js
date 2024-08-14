const  User  = require("../models/schema");
const bcrypt = require("bcryptjs");

// Creating a user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
};

module.exports = { new_user: createUser };
