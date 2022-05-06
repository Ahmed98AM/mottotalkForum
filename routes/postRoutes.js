const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    authController.restricTo("poster"),
    postController.uploadPostCover,
    postController.resizePostCover,
    postController.createPost
  );
router
  .route("/:id")
  .get(postController.getPost)
  .patch(
    postController.uploadPostCover,
    postController.resizePostCover,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;
