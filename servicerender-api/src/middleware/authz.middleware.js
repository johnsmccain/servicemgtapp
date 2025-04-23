function authorize(allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !req.user.userType) {
        return res.status(400).json({ message: "User type is missing or undefined" });
      }
  
      if (!allowedRoles.includes(req.user.userType)) {
        return res.status(403).json({ message: "You do not have permission to access this route" });
      }
  
      next(); // Proceed to the next middleware
    };
  }
  
  module.exports = authorize;
  