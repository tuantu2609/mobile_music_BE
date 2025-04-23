const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Private routes
router.get("/profile", validateToken, userController.getProfile);

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/login-google", userController.loginGoogle);

// Like/unlike songs
router.post("/like-song", validateToken, userController.likeSong);
router.delete("/unlike-song", validateToken, userController.unlikeSong);

// Like/unlike playlists
router.post("/like-playlist", validateToken, userController.likePlaylist);
router.delete("/unlike-playlist", validateToken, userController.unlikePlaylist);

// Follow/unfollow artists
router.post("/follow-artist", validateToken, userController.followArtist);
router.delete("/unfollow-artist", validateToken, userController.unfollowArtist);

// Get liked data
router.get("/liked-songs", validateToken, userController.getLikedSongs);
router.get("/liked-playlists", validateToken, userController.getLikedPlaylists);
router.get("/followed-artists", validateToken, userController.getFollowedArtists);

router.post("/download-song", validateToken, userController.downloadSong);
router.get("/downloaded-songs", validateToken, userController.getDownloadedSongs);


module.exports = router;
