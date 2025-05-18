const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Lấy danh sách playlists
 *     tags: [Playlists]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Giới hạn số playlist trả về
 *     responses:
 *       200:
 *         description: Trả về danh sách playlists
 */
router.get("/", playlistController.getPlaylists);

module.exports = router;
