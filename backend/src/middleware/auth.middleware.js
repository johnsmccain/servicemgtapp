const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const authenticateToken = (req, res, next) => {
    try {
        // Get token from headers, body, or query params
        const token =
            req.header("Authorization")?.split(" ")[1] || // Bearer Token
            req.body.token ||
            req.query.token;

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No Token Provided." });
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or Expired Token." });
            }

            // Attach decoded user info to req.user
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(400).json({ message: "Server Error", error: error.message });
    }
};

module.exports = authenticateToken;