const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/login").get(viewController.showLoginForm);
router.route("/signup").get(viewController.showSignupForm);
router.use(authController.isLoggedIn);
router.route("/").get(viewController.showMainPage);
router.route("/posts").get(viewController.getAllPosts);

router
  .route("/posts/new")
  .get(authController.protect, viewController.showNewPostForm);
router
  .route("/posts/:postId/newComment")
  .get(authController.protect, viewController.showNewCommentForm);
router
  .route("/posts/me")
  .get(authController.protect, viewController.getMePosts);
router.route("/posts/:id").get(viewController.getPost);
router
  .route("/posts/:id/edit")
  .get(authController.protect, viewController.showEditPostForm);
router
  .route("/users")
  .get(
    authController.protect,
    authController.restricTo("admin"),
    viewController.getAllUsers
  );

module.exports = router;
