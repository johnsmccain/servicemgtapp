/**
 * Comprehensive Redis Connection Test Script
 *
 * This script tests the Redis connection module with various scenarios:
 * 1. Successful connection to local Redis
 * 2. Error handling with invalid credentials
 * 3. Fallback behavior when primary Redis fails
 */

require("dotenv").config();
const redisConnection = require("./src/connections/redis.connection");

// Store original environment variables
const originalUrl = process.env.REDIS_URL;
const originalUsername = process.env.REDIS_USERNAME;
const originalPassword = process.env.REDIS_PASSWORD;

async function testValidConnection() {
  console.log("\n=== TEST 1: Valid Connection (Local Redis) ===");
  try {
    // To ensure we're using local Redis for this test
    process.env.REDIS_URL = "redis://127.0.0.1:6379";
    process.env.REDIS_USERNAME = "";
    process.env.REDIS_PASSWORD = "";

    const client = await redisConnection();

    if (client) {
      console.log("✅ Successfully connected to local Redis");

      // Test basic operations
      await client.set("test_key", "Connection successful!");
      const result = await client.get("test_key");
      console.log(`✅ Redis operation test: ${result}`);

      // Clean up
      await client.del("test_key");
      await client.quit();
      console.log("✅ Connection properly closed");
    } else {
      console.error("❌ Failed to connect to local Redis");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function testInvalidCredentials() {
  console.log("\n=== TEST 2: Invalid Credentials Handling ===");
  try {
    // Set invalid credentials
    process.env.REDIS_URL = "redis://127.0.0.1:6379";
    process.env.REDIS_USERNAME = "invalid_user";
    process.env.REDIS_PASSWORD = "invalid_password";

    console.log("Attempting to connect with invalid credentials...");

    // This should fail but not crash our application
    const client = await redisConnection();

    if (client) {
      console.log(
        "⚠️ Connected despite invalid credentials (Redis might not have auth enabled)"
      );
      await client.quit();
    } else {
      console.log("✅ Connection properly failed with invalid credentials");
    }
  } catch (error) {
    console.log("✅ Error handling working:", error.message);
  }
}

async function testRemoteFallback() {
  console.log("\n=== TEST 3: Remote Fallback Behavior ===");
  try {
    // Set non-existent remote Redis server with fallback
    process.env.REDIS_URL = "rediss://non-existent-host:6379";
    process.env.REDIS_USERNAME = "";
    process.env.REDIS_PASSWORD = "";

    console.log("Attempting to connect to non-existent remote Redis...");

    // This should fail remote but potentially succeed on local fallback
    const client = await redisConnection();

    if (client) {
      console.log("✅ Successfully fell back to local Redis");
      await client.quit();
    } else {
      console.log("❌ Fallback mechanism failed");
    }
  } catch (error) {
    console.error("❌ Unexpected error in fallback test:", error.message);
  }
}

async function runAllTests() {
  try {
    console.log("=== COMPREHENSIVE REDIS CONNECTION TESTS ===");

    await testValidConnection();
    await testInvalidCredentials();
    await testRemoteFallback();

    console.log("\n=== ALL TESTS COMPLETED ===");
  } catch (error) {
    console.error("Error during tests:", error);
  } finally {
    // Restore original environment variables
    process.env.REDIS_URL = originalUrl;
    process.env.REDIS_USERNAME = originalUsername;
    process.env.REDIS_PASSWORD = originalPassword;

    console.log("Environment variables restored");
  }
}

// Run all tests
runAllTests();