import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from "../actions/auth";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case SIGNUP_SUCCESS:
      return {
        user: null,
        loading: false,
        user: action.payload,
      };
    case SIGNIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
