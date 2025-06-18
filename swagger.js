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
          type: "apiKey", 
          in: "header", 
          name: "accessToken",
          description:
            "Access token to authenticate requests. Use 'accessToken' as the header name.",
        },
      },
    },
    security: [
      {
        accessTokenAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
