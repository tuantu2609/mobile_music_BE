const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());

app.use("/avatars", express.static("public/avatars"));

app.use(express.json());

const { swaggerUi, swaggerSpec } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const songRoutes = require("./routes/songRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const playRoutes = require("./routes/playRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const albumRoutes = require("./routes/albumRoutes");

app.use("/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/plays", playRoutes);
app.use("/songs", songRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Music API Server is running!");
});

const db = require("./models");

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
