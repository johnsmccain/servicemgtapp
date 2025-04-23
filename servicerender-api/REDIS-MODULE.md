# Redis Connection Module

A reusable Redis connection module for Express.js applications that supports both secure (rediss://) and local (redis://) connections with automatic fallback.

## Features

- Secure Redis connections (rediss://)
- Local Redis fallback if remote connection fails
- Environment variable based configuration
- Connection event handling (ready, error, reconnecting)
- Automatic reconnection with configurable retry limits
- Proper error handling for authentication issues

## Installation

1. Install the Redis package:

```bash
npm install redis
```

2. Add the Redis configuration to your `.env` file:

```ini
# For secure Redis (with authentication)
REDIS_URL=rediss://your-redis-host:6379
REDIS_USERNAME=your-username
REDIS_PASSWORD=your-password

# OR for local Redis (without authentication)
REDIS_URL=redis://127.0.0.1:6379
REDIS_USERNAME=
REDIS_PASSWORD=
```

3. Create the file `src/connections/redis.connection.js` with the provided Redis client code

## Usage

### In Your Express Application

```javascript
const express = require("express");
const dotenv = require("dotenv");
const mongoConnection = require("./connections/mongo.connection");
const redisConnection = require("./connections/redis.connection");

// Load environment variables
dotenv.config();

const app = express();

// Initialize connections
(async () => {
  try {
    // Connect to MongoDB (if applicable)
    await mongoConnection();
    
    // Connect to Redis
    const redisClient = await redisConnection();
    if (redisClient) {
      app.locals.redis = redisClient; // Store for use in routes
      console.log("Redis client ready for use");
    }
  } catch (error) {
    console.error("Error initializing connections:", error);
  }
})();

// Example route using Redis
app.get("/cache-example", async (req, res) => {
  try {
    if (!app.locals.redis) {
      return res.status(500).json({ error: "Redis not available" });
    }
    
    const cachedData = await app.locals.redis.get("example-key");
    if (cachedData) {
      return res.json({ source: "cache", data: JSON.parse(cachedData) });
    }
    
    // Your logic to fetch data if not in cache
    const data = { message: "Fresh data" };
    
    // Cache the result (expire in 60 seconds)
    await app.locals.redis.set("example-key", JSON.stringify(data), { EX: 60 });
    
    res.json({ source: "fresh", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    if (app.locals.redis) {
      await app.locals.redis.quit();
      console.log("Redis connection closed");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});
```

### Testing

Use the comprehensive test script to validate your Redis connection:

```bash
node test-redis.js
```

This will test:
- Valid local connections
- Error handling with invalid credentials
- Fallback behavior when remote connections fail

## Configuration

Edit the constants in `redis.connection.js` to customize behavior:

```javascript
const REDIS_DEFAULTS = {
  LOCAL_URL: "redis://127.0.0.1:6379",
  MAX_RETRIES: 5,
  FALLBACK_MAX_RETRIES: 2,
  RETRY_DELAY_MS: 50,
  MAX_DELAY_MS: 1000
};
```

## Troubleshooting

- **Authentication Errors**: Ensure your credentials are correct, or remove them for local Redis
- **Connection Refused**: Check that Redis is running on the specified host and port
- **Unexpected Disconnections**: Increase MAX_RETRIES if your network is unstable