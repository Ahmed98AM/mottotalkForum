import "@babel/polyfill";
import { signUp, login, logout } from "./login";
import { newPost, newComment } from "./addItems";
import { editPost, deletePost, deleteComment, deleteUser } from "./editItems";
import { showAlert } from "./alerts";

const mainPage = document.querySelector(".main-page");
const postsPage = document.querySelector(".posts-page");
const usersPage = document.querySelector(".users-page");
const postPage = document.querySelector(".post-page");
const signUpForm = document.querySelector(".form--signup");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const newPostForm = document.querySelector(".form--newPost");
const newCommentForm = document.querySelector(".form--newComment");
const editPostForm = document.querySelector(".form--editPost");
const deletePostBtnArray = document.querySelectorAll(".btn-del-post");
const deleteUserBtnArray = document.querySelectorAll(".btn-del-user");
const deleteCommentBtnArray = document.querySelectorAll(".btn-del-comment");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (mainPage) {
  document.getElementById("mainNav").style.display = "none";
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
if (signUpForm)
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const role = document.getElementById("role").value;
    signUp(name, email, password, passwordConfirm, role);
  });
if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (newPostForm)
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", document.getElementById("post-title").value);
    form.append("desc", document.getElementById("post-desc").value);
    form.append(
      "poster",
      document.getElementById("post-desc").getAttribute("data-userId")
    );

    document.getElementById("post-cover").files[0]
      ? form.append("cover", document.getElementById("post-cover").files[0])
      : form.append("cover", "default-post.jpg");
    showAlert("success", "Cover Image is probably uploading please wait!");
    newPost(form, "data");
  });
if (newCommentForm) {
  let liked = true;
  const liked_btn = document.querySelector(".liked-btn");
  const disLiked_btn = document.querySelector(".disLiked-btn");
  liked_btn.addEventListener("click", (e) => {
    e.preventDefault();
    liked = true;
  });
  disLiked_btn.addEventListener("click", (e) => {
    e.preventDefault();
    liked = false;
  });
  newCommentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const comment = document.getElementById("comment-content");
    const commentContent = comment.value;
    const postId = comment.getAttribute("data-postId");
    const userId = comment.getAttribute("data-userId");
    newComment(commentContent, liked, postId, userId);
  });
}
if (editPostForm) {
  editPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    const coverFile = document.getElementById("post-cover").files[0];
    if (coverFile) form.append("cover", coverFile);
    form.append("title", document.getElementById("post-title").value);
    form.append("desc", document.getElementById("post-desc").value);
    const postId = document
      .getElementById("post-desc")
      .getAttribute("data-postId");
    showAlert("success", "Cover Image is probably uploading please wait!");
    editPost(form, postId);
  });
}
if (postsPage) {
  const deletePostBtnArrayVals = Array.from(deletePostBtnArray).map((btn) => {
    return btn.getAttribute("data-postId");
  });
  deletePostBtnArray.forEach(function (btn, btnIndex) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const postId = deletePostBtnArrayVals[btnIndex];
      deletePost(postId);
    });
  });
}
if (postPage) {
  const deleteCommentBtnArrayVals = Array.from(deleteCommentBtnArray).map(
    (btn) => {
      return btn.getAttribute("data-commentId");
    }
  );
  deleteCommentBtnArray.forEach(function (btn, btnIndex) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const commentId = deleteCommentBtnArrayVals[btnIndex];
      deleteComment(commentId);
    });
  });
}
if (usersPage) {
  const deleteUserBtnArrayVals = Array.from(deleteUserBtnArray).map((btn) => {
    return btn.getAttribute("data-userId");
  });
  deleteUserBtnArray.forEach(function (btn, btnIndex) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const userId = deleteUserBtnArrayVals[btnIndex];
      deleteUser(userId);
    });
  });
}
