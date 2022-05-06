import axios from "axios";
import { showAlert } from "./alerts";

export const editPost = async (data, postId) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/posts/${postId}`,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Edited post successfully!");
      location.assign("/posts");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const deletePost = async (postId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/posts/${postId}`,
    });
    if (res.status === 204) {
      showAlert("success", "Deleted post successfully!");
      location.reload(true);
    }
  } catch (err) {
    showAlert("error", "Something went Wrong!");
  }
};
export const deleteComment = async (commentId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/comments/${commentId}`,
    });
    if (res.status === 204) {
      showAlert("success", "Deleted comment successfully!");
      location.reload(true);
    }
  } catch (err) {
    showAlert("error", "Something went Wrong!");
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/users/${userId}`,
    });
    if (res.status === 204) {
      showAlert("success", "Deleted user successfully!");
      location.reload(true);
    }
  } catch (err) {
    showAlert("error", "Something went Wrong!");
  }
};
