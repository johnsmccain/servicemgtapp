const express = require("express");
const authenticate = require("./middleware/auth.middleware");
const authorize = require("./middleware/authz.middleware");
const dotenv = require("dotenv");
const mongoConnection = require("./connections/mongo.connection");
const redisConnection = require("./connections/redis.connection");

// Load environment variables
dotenv.config();

const app = express();

// Define a port
const PORT = process.env.PORT || 5000;

// Initialize database connections
(async () => {
  try {
    // Connect to MongoDB (existing)
    await mongoConnection();
    console.log("MongoDB connection initialized");
    
    // Connect to Redis (new)
    const redisClient = await redisConnection();
    if (redisClient) {
      console.log("Redis client ready for use");
      
      // Store Redis client in app locals for use in routes
      app.locals.redis = redisClient;
    }
  } catch (error) {
    console.error("Error initializing connections:", error);
  }
})();

// Sample route (Public)
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Protected route (Admin only)
app.get("/admin-dashboard", authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// redis health route
app.get("/redis-health", async (req, res) => {
  try {
    if (!app.locals.redis) {
      return res
        .status(500)
        .json({ status: "error", message: "Redis client not available" });
    }

    await app.locals.redis.set("health_check", "ok");
    const result = await app.locals.redis.get("health_check");

    if (result === "ok") {
      return res.json({
        status: "success",
        message: "Redis connection is healthy",
      });
    } else {
      return res
        .status(500)
        .json({ status: "error", message: "Redis health check failed" });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// For graceful shutdown
process.on("SIGINT", async () => {
  try {
    if (app.locals.redis) {
      await app.locals.redis.quit();
      console.log("Redis connection closed");
    }
    console.log("Shutting down server gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});