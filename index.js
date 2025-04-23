const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());

app.use("/avatars", express.static("public/avatars"));

// Middleware cho JSON
app.use(express.json());

// Swagger Docs
const { swaggerUi, swaggerSpec } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
const songRoutes = require("./routes/songRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/songs", songRoutes);
app.use("/api/users", userRoutes); // <-- Thêm user route

// TEST default route
app.get("/", (req, res) => {
  res.send("Music API Server is running!");
});

// DB
const db = require("./models");

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
