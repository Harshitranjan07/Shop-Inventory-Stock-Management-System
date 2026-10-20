
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User role '${req.user ? req.user.role : 'none'}' does not have permission to access this resource`
      });
    }
    next();
  };
};

module.exports = allowRoles;
