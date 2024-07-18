export const SIGNIN_REQUEST = "SIGNIN_REQUEST";
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_FAILURE = "SIGNIN_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const signInRequest = (credentials) => ({
  type: SIGNIN_REQUEST,
  payload: credentials,
});

export const signInSuccess = (user) => ({
  type: SIGNIN_SUCCESS,
  payload: user,
});

export const signInFailure = (error) => ({
  type: SIGNIN_FAILURE,
  payload: error.message,
});

export const signUpRequest = (userData) => ({
  type: SIGNUP_REQUEST,
  payload: userData,
});

export const signUpSuccess = (user) => ({
  type: SIGNUP_SUCCESS,
  payload: user,
});

export const signUpFailure = (error) => ({
  type: SIGNUP_FAILURE,
  payload: error,
});
