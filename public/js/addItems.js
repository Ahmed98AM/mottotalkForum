import axios from "axios";
import { showAlert } from "./alerts";

export const newPost = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/posts",
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Added Post successfully!");
      location.assign("/posts");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const newComment = async (comment, liked, postId, userId) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/comments",
      data: {
        comment,
        liked,
        post: postId,
        user: userId,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Added Comment successfully!");
      location.assign(`/posts/${postId}`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
