const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const saucesControl = require("../controllers/sauces");

router.get("/", auth, saucesControl.getAllSauces);
router.get("/:id", auth, saucesControl.getOneSauce);
router.post("/", auth, multer, saucesControl.addSauce);
router.put("/:id", auth, multer, saucesControl.modifySauce);
router.delete("/:id", auth, multer, saucesControl.deleteSauce);
router.post("/:id/like", auth, saucesControl.likesManagement);
module.exports = router;
