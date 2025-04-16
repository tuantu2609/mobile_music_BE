const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());
const { swaggerUi, swaggerSpec } = require("./swagger");

// Integrate Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const songRoutes = require("./routes/songRoutes");
app.use("/api/songs", songRoutes);

const db = require("./models");

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
