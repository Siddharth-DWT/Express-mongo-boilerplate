const express = require("express");
const router = express.Router();
const checkAuth = require("../../middleware/checkAuth");
const resetAuth = require("../../middleware/resetAuth");

const UserCtrl = require("./User.Controler");

router.post("/Register", UserCtrl.Register);
router.get("/list", checkAuth, UserCtrl.list);
router.post("/login", UserCtrl.login);
router.post("/signup", UserCtrl.signup);
router.post("/forgotpassword", UserCtrl.forgotpassword);
router.put("/change-password/:id", resetAuth, UserCtrl.changePasswordById);
router.put("/reset-password/:id", UserCtrl.resetPasswordById);
router.put("/:id", UserCtrl.updateById);
router.get("/:id", UserCtrl.getById);
router.delete("/:userId", UserCtrl.deleteById);

module.exports = router;
