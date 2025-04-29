const express = require("express");
const router = express.Router();
const { getAlbumDetails } = require("../controllers/albumController");

router.get("/:id", getAlbumDetails);

module.exports = router;
