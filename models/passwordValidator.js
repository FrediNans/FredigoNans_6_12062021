const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
	.is()
	.min(8) // Minimum length 8
	.is()
	.max(100) // Maximum length 100
	.has()
	.uppercase() // Must have uppercase letters
	.has()
	.lowercase() // Must have lowercase letters
	.has()
	.digits() // Must have digit
	.has()
	.not()
	.spaces() // Should not have spaces
	.has()
	.symbols(); // Must have symbol

module.exports = passwordSchema;
