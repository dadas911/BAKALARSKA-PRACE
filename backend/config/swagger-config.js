import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Webová aplikace pro správu rodinných financí",
            version: "1.0.0",
            description:
                "Dokumentace backend API webové aplikace pro správu rodinných financí.",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}/api`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
