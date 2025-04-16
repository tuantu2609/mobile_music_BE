const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        accessTokenAuth: {
          // Thay thế bearerAuth bằng accessTokenAuth
          type: "apiKey", // Loại authentication là apiKey
          in: "header", // Token được truyền trong header
          name: "accessToken", // Tên header
          description:
            "Access token to authenticate requests. Use 'accessToken' as the header name.",
        },
      },
    },
    security: [
      {
        accessTokenAuth: [], // Áp dụng accessTokenAuth cho toàn bộ API
      },
    ],
  },
  apis: ["./routes/*.js"], // Chỉ đường dẫn đến file route chứa Swagger doc
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
