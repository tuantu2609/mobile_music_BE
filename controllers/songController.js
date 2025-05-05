const { Song, Artist, Album } = require("../models");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { Op } = require("sequelize");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        {
          model: Artist,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Album,
          attributes: ["id", "name", "release_date"],
          required: false,
        },
      ],
      limit: 50,
      order: [["popularity", "DESC"]],
    });
    res.json(songs);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getNewReleases = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        {
          model: Artist,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Album,
          attributes: ["id", "name", "release_date"],
          required: false,
        },
      ],
      limit: 20,
      order: [
        ["release_date", "DESC"],
        [{ model: Album }, "release_date", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(songs);
  } catch (error) {
    console.error("Fetch New Releases error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getSongById = async (req, res) => {
  const { id } = req.params;

  try {
    const song = await Song.findByPk(id, {
      include: [
        {
          model: Artist,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Album,
          attributes: ["id", "name", "release_date"],
          required: false,
        },
      ],
    });

    if (!song) {
      return res.status(404).json({ error: "Song Not found" });
    }

    res.json(song);
  } catch (error) {
    console.error("Error fetch song detail:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getNextSongs = async (req, res) => {
  const { id } = req.params;
  const { limit = 1, exclude = "" } = req.query;

  try {
    const excludeIds = exclude.split(",").concat(id);

    const songs = await Song.findAll(); // không cần order theo popularity

    // Lọc bài không nằm trong exclude
    const filtered = songs.filter((song) => !excludeIds.includes(song.id));

    // Xáo trộn ngẫu nhiên
    const shuffled = filtered.sort(() => Math.random() - 0.5);

    // Trả về số lượng cần
    const nextSongs = shuffled.slice(0, Number(limit));

    res.json(nextSongs);
  } catch (error) {
    console.error("Error fetching next songs:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const uploadSong = async (req, res) => {
  try {
    // Kiểm tra nếu không có file thì trả lỗi
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Lấy dữ liệu từ body
    const { songTitle, artistID, albumID, releaseDate, isPlayable, lyrics } =
      req.body;

    // Kiểm tra các trường bắt buộc
    if (!songTitle) {
      return res.status(400).json({ message: "Song title is required." });
    }

    if (!artistID || !albumID) {
      return res
        .status(400)
        .json({ message: "Artist ID and Album ID are required." });
    }

    // Kiểm tra sự tồn tại của Artist và Album
    const artist = await Artist.findByPk(artistID);
    const album = await Album.findByPk(albumID);

    if (!artist || !album) {
      return res.status(404).json({ message: "Artist or Album not found." });
    }

    // Kiểm tra nếu bài hát đã tồn tại trong album
    const existingSong = await Song.findOne({
      where: { title: songTitle, album_id: albumID },
    });

    if (existingSong) {
      return res.status(400).json({
        message: "A song with the same title already exists in this album.",
      });
    }

    // Tiến hành upload file lên Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // cho file âm thanh
        folder: "songs", // đặt thư mục trên Cloudinary
      },
      async (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({
            message: "Upload to Cloudinary failed.",
            error: error.message,
          });
        }

        try {
          // Lấy URL của bài hát từ Cloudinary
          const songURL = uploadResult.secure_url;
          const songDuration = uploadResult.duration;

          // Lưu thông tin bài hát vào database
          const newSong = await Song.create({
            title: songTitle,
            explicit: false, // Mặc định là false
            album_cover: songURL, // Lưu URL bài hát vào album_cover (hoặc bạn có thể lưu vào một trường khác nếu cần)
            popularity: 0, // Mặc định là 0
            preview_url: songURL, // Lưu preview_url (có thể là URL tương tự)
            release_date: releaseDate || new Date(), // Mặc định là ngày hiện tại nếu không có
            is_playable: isPlayable || true, // Mặc định là true
            duration_ms: songDuration || 0, // Thời gian bài hát
            album_id: albumID, // Liên kết với album
            lyrics: lyrics || "", // Lưu lời bài hát vào trường lyrics mới
          });

          res.status(201).json({
            message: "Song uploaded successfully and is awaiting approval.",
            data: newSong,
          });
        } catch (dbError) {
          console.error("Database Error:", dbError);
          res.status(500).json({
            message: "Failed to save song data to database.",
            error: dbError.message,
          });
        }
      }
    );

    // Bắt đầu upload bài hát
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "Server error during upload.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSongs,
  getNewReleases,
  getSongById,
  getNextSongs,
  uploadSong,
};
