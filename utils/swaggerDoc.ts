import swaggerJsDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Paint Documentation",
    version: "1.0.0",
    description: "Paint Doc helps you to use Paint API",
  },
  servers: [{ url: "https://closed-moored-evergreen.glitch.me" }],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.ts"],
};

const swaggerDoc = swaggerJsDoc(options);
export default swaggerDoc;
