const User = require("../users/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwt");

const ALLOWED_DOMAIN = "@thapar.edu";

const registerUser = async ({ name, email, password }) => {
  if (!email.endsWith(ALLOWED_DOMAIN)) {
    throw new Error("Only campus emails allowed");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    verified: true,
  });

  return {
    user,
    token: generateToken({ id: user._id }),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    user,
    token: generateToken({ id: user._id }),
  };
};

module.exports = { registerUser, loginUser };