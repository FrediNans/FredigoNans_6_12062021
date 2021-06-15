/**
 * @module JsonWebToken tokken utility
 */
const jwt = require("jsonwebtoken");

/**
 * @module
 * Get the tokken in header of request and extract the id.
 * Get id in body of request.
 * Compare these id's and return an error if they are different.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
module.exports = (request, response, next) => {
	try {
		const token = request.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "RANDOM_SECRET_KEY");
		const userId = decodedToken.userId;
		if (request.body.userId && request.body.userId !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch {
		response.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};
