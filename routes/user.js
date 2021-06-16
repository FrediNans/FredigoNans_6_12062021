const express = require("express");
const router = express.Router();
const userControl = require("../controllers/user");
const passwordValidator = require("../middleware/passwordValidator");

router.post("/signup", passwordValidator, userControl.signup);
router.post("/login", userControl.login);
module.exports = router;
