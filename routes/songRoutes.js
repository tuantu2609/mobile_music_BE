const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const multer = require("multer");
const upload = multer();

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Lấy danh sách bài hát
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: Trả về danh sách bài hát
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", songController.getAllSongs);

router.get("/new-releases", songController.getNewReleases);

router.get("/:id", songController.getSongById);

router.get("/:id/next", songController.getNextSongs);

router.post("/upload", upload.single("songFile"), songController.uploadSong);
module.exports = router;
