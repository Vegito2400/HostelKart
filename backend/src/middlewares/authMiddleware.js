const jwt = require("jsonwebtoken");
const User = require("../modules/users/user.model");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-passwordHash");

      next();
    } catch (error) {
      res.status(401);
      next(new Error("Not authorized, token failed"));
    }
  } else {
    res.status(401);
    next(new Error("No token provided"));
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403);
  next(new Error("Admin access required"));
};

module.exports = { protect, adminOnly };
