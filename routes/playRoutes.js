const express = require("express");
const router = express.Router();
const playController = require("../controllers/playController");

router.post("/play", playController.recordPlay);
router.get("/recently-played/:userId", playController.getRecentlyPlayed);

module.exports = router;
