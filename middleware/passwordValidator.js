const passwordSchema = require("../models/passwordValidator");

module.exports = (request, response, next) => {
	if (!passwordSchema.validate(request.body.password)) {
		return response.status(400).json({
			error:
				"Le mot de passe doit contenir entre 8 et 20 caractères, comprenant au moins 1 majuscule, une minuscule, un chiffre et un symbole, sans espaces",
		});
	}
	next();
};
