import axios from "axios";
import { showAlert } from "./alerts";

export const signUp = async (name, email, password, passwordConfirm, role) => {
  if (!role) role = "active";
  try {
    const res = await axios({
      method: "POST",
      url: "/api/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Signed Up successfully!");
      if (document.referrer.includes("new")) window.history.back();
      else location.assign("/");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      if (document.referrer.includes("new")) window.history.back();
      else location.assign("/");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/users/logout",
    });
    if ((res.data.status = "success")) location.assign("/");
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};
