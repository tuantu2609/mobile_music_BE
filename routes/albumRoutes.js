const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const router = express.Router();
const {
  getAlbumDetails,
  getAllAlbums,
} = require("../controllers/albumController");

router.get("/:id", validateToken, getAlbumDetails);

router.get("/", validateToken, getAllAlbums);

module.exports = router;
