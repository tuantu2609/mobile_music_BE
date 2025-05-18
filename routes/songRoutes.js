const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const multer = require("multer");
const upload = multer();
const { validateToken } = require("../middlewares/AuthMiddleware");

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
router.get("/", validateToken, songController.getAllSongs);

router.get("/new-releases", validateToken, songController.getNewReleases);

router.get("/:id", validateToken, songController.getSongById);

router.get("/:id/next", validateToken, songController.getNextSongs);

// Lấy tổng số lượt like của bài hát
router.get(
  "/:songId/total-likes",
  validateToken,
  songController.getTotalLikesOfSong
);

router.post("/upload", upload.single("songFile"), songController.uploadSong);
module.exports = router;
