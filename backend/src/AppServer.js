const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const redisClient = require("../utils/redisClient");

class AppServer {
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer);
    this.redis = redisClient();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureSocketIO();
  }

  configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  configureRoutes() {
    this.app.use("/api/v1/services", require("../routes/services.routes")());
  }

  configureSocketIO() {
    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Existing socket handlers from chat implementation
      socket.on("msgFromClient", (data) => {
        this.handleClientMessage(socket, data);
      });

      // New Redis integration
      socket.on("forRedis", async (userData) => {
        await this.redis.set(userData.phoneNumber, socket.id);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  async handleClientMessage(socket, data) {
    const recipientSocketId = await this.redis.get(data.to);

    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("serverResponse", {
        from: data.from,
        message: data.message,
      });
    }
  }

  start(port = process.env.PORT || 5000) {
    this.httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

module.exports = AppServer;
