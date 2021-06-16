/**
 * @module Express Micro framework
 * @module BodyParser Body parsing middleware
 * @module Mongoose Manages the Mongodb database
 * @module Path Utilities for working with file and directory paths
 */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

/**
 * @module Route Import routes
 */
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

/**
 * limit each IP to 20 requests per minutes
 */
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 50,
});
/**
 * @access Connection to the database
 */
mongoose
	.connect(
		"mongodb+srv://Nans:@Azerty58@cluster0.otmvw.mongodb.net/test?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

/**
 * Creation of the Express application
 */
const app = express();

/**
 * Configurration of the response header
 */
app.use((request, response, next) => {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	response.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

/**
 *
 */
app.use(bodyParser.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
