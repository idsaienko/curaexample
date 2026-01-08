const User = require("../models/User.js");

// POST - Create user
 const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: "User created successfully 🎉", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - Get all users
 const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser, 
  getUsers
}