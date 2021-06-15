/**
 * @import Moongose shema Sauce
 */
const Sauce = require("../models/sauces");
const fs = require("fs");

/**
 * Find all sauce object in database
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.getAllSauces = (request, response, next) => {
	Sauce.find()
		.then((sauces) => response.status(200).json(sauces))
		.catch((error) => response.status(400).json(error));
};

/**
 * Find unique sauce whith id
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.getOneSauce = (request, response, next) => {
	Sauce.findOne({ _id: request.params.id })
		.then((sauce) => response.status(200).json(sauce))
		.catch((error) => response.status(404).json(error));
};

/**
 * Generates a unique url for the image with the parameters of the request.
 * Create new sauce object with user request info and save then in database.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.addSauce = (request, response, next) => {
	const sauceObject = JSON.parse(request.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${request.protocol}://${request.get("host")}/images/${
			request.file.filename
		}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	sauce
		.save()
		.then(() => {
			response.status(201).json({
				message: "Sauce ajoutée avec succés !",
			});
		})
		.catch((error) => {
			response.status(400).json({
				error: error,
			});
		});
};

exports.modifySauce = (request, response, next) => {
	let sauceObject = request.body.sauce;

	Sauce.findOne({ _id: request.params.id })

		.then((sauce) => {
			if (request.file) {
				const filename = sauce.imageUrl.split("/images/")[1];
				fs.unlinkSync(`images/${filename}`);
				sauceObject = {
					...JSON.parse(sauceObject),
					imageUrl: `${request.protocol}://${request.get("host")}/images/${
						request.file.filename
					}`,
				};
			} else {
				sauceObject = { ...request.body };
			}
			Sauce.updateOne(
				{ _id: request.params.id },
				{ ...sauceObject, _id: request.params.id }
			)
				.then(() => response.status(200).json({ message: "Sauce modifiée !" }))
				.catch((error) => response.status(400).json({ error }));
		})
		.catch((error) => response.status(500).json({ error }));
};

exports.deleteSauce = (request, response, next) => {
	Sauce.findOne({ _id: request.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: request.params.id })
					.then(() =>
						response.status(200).json({ message: "Sauce supprimée !" })
					)
					.catch((error) => response.status(400).json({ error }));
			});
		})
		.catch((error) => response.status(500).json({ error }));
};

exports.likesManagement = (request, response, next) => {
	const likeOperator = request.body.like;
	const userId = request.body.userId;
	const sauceId = request.params.id;
	Sauce.findOne({ _id: sauceId })
		.then((sauce) => {
			const currentSauce = sauce;
			if (likeOperator === 1) {
				currentSauce.likes++;
				currentSauce.usersLiked.push(userId);
				Sauce.updateOne({ _id: sauceId }, currentSauce)
					.then(() =>
						response.status(200).json({ message: "Vous aimez cette sauce !" })
					)
					.catch((error) => response.status(400).json({ error }));
			}
			if (likeOperator === -1) {
				currentSauce.dislikes++;
				currentSauce.usersDisliked.push(userId);
				Sauce.updateOne({ _id: sauceId }, currentSauce)
					.then(() =>
						response
							.status(200)
							.json({ message: "Vous n'aimez pas cette sauce !" })
					)
					.catch((error) => response.status(400).json({ error }));
			}
			if (likeOperator === 0) {
				const userLikesIndex = sauce.usersLiked.indexOf(userId);
				const userDislikesIndex = sauce.usersDisliked.indexOf(userId);
				if (userLikesIndex !== -1) {
					currentSauce.likes--;
					currentSauce.usersLiked.splice(userLikesIndex, 1);
					Sauce.updateOne({ _id: sauceId }, currentSauce)
						.then(() =>
							response
								.status(200)
								.json({ message: "Vous avez retiré votre avis !" })
						)
						.catch((error) => response.status(400).json({ error }));
				}
				if (userDislikesIndex !== -1) {
					currentSauce.dislikes--;
					currentSauce.usersDisliked.splice(userLikesIndex, 1);
					Sauce.updateOne({ _id: sauceId }, currentSauce)
						.then(() =>
							response
								.status(200)
								.json({ message: "Vous avez retiré votre avis !" })
						)
						.catch((error) => response.status(400).json({ error }));
				}
			}
		})
		.catch((error) => response.status(400).json({ error }));
};
