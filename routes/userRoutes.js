const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);
router
  .route("/app-stats")
  .get(authController.restricTo("admin"), userController.appStats);

router.get("/me", userController.getId, userController.getUser);
router
  .route("/")
  .get(authController.restricTo("admin"), userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.restricTo("admin"), userController.updateUser)
  .delete(authController.restricTo("admin"), userController.deleteUser);

module.exports = router;
