const express = require("express");
const router = express.Router();
const {
  getAlbumDetails,
  getAllAlbums,
} = require("../controllers/albumController");

router.get("/:id", getAlbumDetails);

router.get("/", getAllAlbums);

module.exports = router;
