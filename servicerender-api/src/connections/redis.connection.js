/**
 * Redis Connection Module
 *
 * This module establishes and manages connections to Redis servers,
 * supporting both secure (rediss://) and local (redis://) connections.
 * It handles connection events, security, and provides fallback mechanisms.
 */

const redis = require("redis");

// Constants for easier configuration
const REDIS_DEFAULTS = {
  LOCAL_URL: "redis://127.0.0.1:6379",
  MAX_RETRIES: 5,
  FALLBACK_MAX_RETRIES: 2,
  RETRY_DELAY_MS: 50,
  MAX_DELAY_MS: 1000,
};

/**
 * Creates and connects to a Redis client with automatic fallback
 * @returns {Promise<redis.RedisClientType>} Connected Redis client or null if all connections fail
 */
module.exports = async () => {
  try {
    // Get configuration from environment variables
    const redisUrl = process.env.REDIS_URL || REDIS_DEFAULTS.LOCAL_URL;

    console.log("Attempting to connect to Redis...");

    // Create Redis client with only URL (no auth) for local development
    const options = {
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          // Limit retries to avoid infinite reconnection loops
          if (retries > REDIS_DEFAULTS.MAX_RETRIES) {
            console.log("Maximum reconnection attempts reached");
            return false; // Stop trying to reconnect
          }
          return Math.min(
            retries * REDIS_DEFAULTS.RETRY_DELAY_MS,
            REDIS_DEFAULTS.MAX_DELAY_MS
          );
        },
      },
    };

    // Only add authentication if credentials are explicitly provided and not empty
    if (
      process.env.REDIS_USERNAME &&
      process.env.REDIS_USERNAME.trim() !== ""
    ) {
      options.username = process.env.REDIS_USERNAME;
    }

    if (
      process.env.REDIS_PASSWORD &&
      process.env.REDIS_PASSWORD.trim() !== ""
    ) {
      options.password = process.env.REDIS_PASSWORD;
    }

    // Create Redis client
    const client = redis.createClient(options);

    // Set up event handlers
    client.on("ready", () => {
      console.log("Connected to Redis successfully! 🎉");
    });

    client.on("error", (err) => {
      console.error("Redis connection error ❌", err);
    });

    client.on("reconnecting", () => {
      console.log("Reconnecting to Redis...");
    });

    // Attempt connection
    await client.connect();
    return client;
  } catch (error) {
    console.error("Failed to connect to primary Redis ❌", error.message);

    // Try local fallback connection without auth
    try {
      console.log("Trying fallback local Redis connection...");

      const fallbackClient = redis.createClient({
        url: REDIS_DEFAULTS.LOCAL_URL,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > REDIS_DEFAULTS.FALLBACK_MAX_RETRIES) return false; // Limit fallback retries
            return Math.min(
              retries * REDIS_DEFAULTS.RETRY_DELAY_MS,
              REDIS_DEFAULTS.MAX_DELAY_MS
            );
          },
        },
      });

      fallbackClient.on("ready", () => {
        console.log("Connected to fallback Redis successfully! 🎉");
      });

      fallbackClient.on("error", (err) => {
        console.error("Fallback Redis connection error ❌", err);
      });

      await fallbackClient.connect();
      return fallbackClient;
    } catch (fallbackError) {
      console.error(
        "All Redis connection attempts failed ❌",
        fallbackError.message
      );
      return null;
    }
  }
};
