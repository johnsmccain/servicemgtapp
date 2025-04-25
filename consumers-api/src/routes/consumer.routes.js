const consumerController = require("../controller/consumer.controller");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const microServiceConnector = require("../utils/nodefetch");

module.exports = () => {
  const api = Router();

  api.post("/", async (req, res) => {
    try {
      const {
        consumerName,
        phoneNumber,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        password,
      } = req.body;

      const saltRounds = 10;
      const newPassword = await bcrypt.hash(password, saltRounds);

      let response = await consumerController.createConsumer(
        consumerName,
        phoneNumber,
        locationUpdate,
        permanentAddress,
        temporaryAddress,
        newPassword
      );
      res.status(200).json({ response: true, payload: response });
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  api.post("/ratings", async (req, res) => {
    try {
      const {
        phoneNumber,
        timeliness,
        communication,
        valueForMoney,
        customerService,
        professionalism,
      } = req.body;

      let body = {
        phoneNumber,
        timeliness,
        communication,
        valueForMoney,
        customerService,
        professionalism,
      };

      const ratingResponse = await microServiceConnector(
        "http://localhost:5000/api/v1/services/ratings",
        "PATCH",
        body
      );

      if (ratingResponse.response == true) {
        res
          .status(200)
          .json({ response: true, payload: "Thank you for your ratings" });
      } else {
        throw new error("error occurred rating");
      }
    } catch (error) {
      res.status(500).json({ response: false, payload: error.message });
    }
  });

  return api;
};
