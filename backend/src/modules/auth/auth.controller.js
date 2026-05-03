const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    const data = await authService.registerUser(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };