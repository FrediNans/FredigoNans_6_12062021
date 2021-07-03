/**
 * @module Express Micro framework
 * @module BodyParser Body parsing middleware
 * @module Mongoose Manages the Mongodb database
 * @module Path Utilities for working with file and directory paths
 */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const expressSecure = require(process.env.EXPRESS_SECURE);
const dataCleaner = require(process.env.DATA_CLEANER);
const requestLimiter = require(process.env.REQUEST_LIMITER);
const dbUrl = process.env.DB_URL;

/**
 * @module Route Import routes
 */
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

/**
 * limit each IP to 20 requests per minute
 */
const limiter = requestLimiter({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 50,
});
/**
 * @access Connection to the database
 */
mongoose
	.connect(`mongodb+srv://${dbUrl}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussi !"))
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
app.use(expressSecure());
app.use(dataCleaner());
app.use(limiter);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
