const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

router.get("/:id", artistController.getArtistDetails);

module.exports = router;
