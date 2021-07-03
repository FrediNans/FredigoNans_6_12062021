/**
 * @import Moongose shema Sauce
 */
const Sauce = require("../models/sauces");

/**
 * @module fs to interact with the filesystem
 */
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

/**
 * Modify the sauce object with the parameters of the request.
 * If there is a change of image, import the new one and suppress the old one.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
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

/**
 * Removes the sauce object as well as the stuck image.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
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

/**
 * Manage likes and dislikes.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.likesManagement = (request, response, next) => {
	const likeOperator = request.body.like;
	const userId = request.body.userId;
	const sauceId = request.params.id;
	Sauce.findOne({ _id: sauceId })
		.then((sauce) => {
			switch (likeOperator) {
				case 1:
					sauce.likes++;
					sauce.usersLiked.push(userId);
					break;
				case -1:
					sauce.dislikes++;
					sauce.usersDisliked.push(userId);
					break;
				case 0:
					const userLikesIndex = sauce.usersLiked.indexOf(userId);
					const userDislikesIndex = sauce.usersDisliked.indexOf(userId);
					if (userLikesIndex !== -1) {
						sauce.likes--;
						sauce.usersLiked.splice(userLikesIndex, 1);
					} else {
						sauce.dislikes--;
						sauce.usersDisliked.splice(userDislikesIndex, 1);
					}
					break;
			}
			Sauce.updateOne({ _id: sauceId }, sauce)
				.then(() =>
					response.status(200).json({ message: "Votre avis est enregistré !" })
				)
				.catch((error) => response.status(400).json({ error }));
		})
		.catch((error) => response.status(400).json({ error }));
};
