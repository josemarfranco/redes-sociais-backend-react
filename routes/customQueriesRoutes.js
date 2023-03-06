const express = require("express");

const customQueriesController = require("../controllers/customQueriesController");
const loginController = require("../controllers/loginController");

const router = express.Router();

router.get("/queries/generalfeed", [
  loginController.checkAuth,
  customQueriesController.generalFeed,
]);
router.get("/queries/feed/:id", [
  loginController.checkAuth,
  customQueriesController.feedByUserId,
]);
router.get("/queries/peoplecards", [
  loginController.checkAuth,
  customQueriesController.peopleCardSuggestion,
]);

module.exports = router;
