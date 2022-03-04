const express = require("express");

const router = express.Router();
const checkAuth = require("../../middleware/checkAuth");
const resetAuth = require("../../middleware/resetAuth");

const UserController = require("./User.Controler");

router.post("/register", UserController.register);
router.get("/list", checkAuth, UserController.list);
router.post("/login", UserController.login);
router.post("/signup", UserController.signup);
router.post("/forgot-password", UserController.forgotpassword);
router.put("/change-password/:id", resetAuth, UserController.changePasswordById);
router.put("/reset-password/:id", UserController.resetPasswordById);
router.put("/:id", UserController.updateById);
router.get("/:id", UserController.getById);
router.delete("/:id", UserController.deleteById);

module.exports = router;
