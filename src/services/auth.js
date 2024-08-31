/* eslint-disable no-useless-catch */
import UnAuthor from "../services/baseApi/UnAuthorApi";
import instance from "../configs/axios";
import axios from "axios";
// import Author from "../services/baseApi/AuthorApi";
// const url = "/auth";

export const signIn = async (user) => {
  try {
    return await UnAuthor.post("/login", user);
  } catch (error) {
    throw error;
  }
};

export const signUp = (user) => {
  return UnAuthor.post(`/register`, user);
};

export const refreshToken = async () => {
  try {
    const data = await UnAuthor.post(
      `/refresh?refresh_token=${localStorage.getItem("refresh")}`
    );
    localStorage.setItem("access", data.access_token);
  } catch (error) {
    // refresh token is expired
    if (error.response.status === 400) {
      window.location.href = "/signin";
    }
  }
};

// export const resendActiveAccountEmail = (username) => {
//     return UnauthorApi.get(`${url}/registration/active-mail?username=${username}`);
// };

// export const sendResetPasswordEmail = (usernameOrEmail) => {
//     return UnauthorApi.get(`${url}/password/forgot-mail?usernameOrEmail=${usernameOrEmail}`);
// };

// export const getUsernameFromForgotPasswordToken = (token) => {
//     return UnauthorApi.get(`${url}/password/forgot/username?forgotPasswordToken=${token}`);
// };

// export const resetNewPassword = (token, newPassword) => {
//     const body = {
//         "forgotPasswordToken": token,
//         "newPassword": newPassword
//     };

//     return UnauthorApi.put(`${url}/password/new-password`, body);
// };

// export const changePassword = (oldPassword, newPassword) => {
//     const body = {
//         "oldPassword": oldPassword,
//         "newPassword": newPassword
//     };

//     return AuthorApi.put(`${url}/password/change`, body);
// };
