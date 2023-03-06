const express = require("express");

const loginController = require("../controllers/loginController");

const router = express.Router();

router.post("/login", loginController.login);
router.get("/auth", loginController.routeProtector);

module.exports = router;
