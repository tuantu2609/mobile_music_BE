const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");

/**
 * @swagger
 * /api/songs:
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

module.exports = router;
