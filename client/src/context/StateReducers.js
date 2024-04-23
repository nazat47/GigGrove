"use client";
import { reducerCase } from "./constants";

export const initialState = {
  showLoginModal: false,
  showRegisterModal: false,
  currentUser: undefined,
  isSeller: false,
  gigData: null,
  hasOrdered: false,
  reloadReviews: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCase.TOGGLE_LOGIN:
      return {
        ...state,
        showLoginModal: action.showLoginModal,
        showRegisterModal: action.showRegisterModal,
      };
    case reducerCase.TOGGLE_REGISTER:
      return {
        ...state,
        showRegisterModal: action.showRegisterModal,
        showLoginModal: action.showLoginModal,
      };
    case reducerCase.CLOSE_AUTH_MODAL:
      return {
        ...state,
        showRegisterModal: false,
        showLoginModal: false,
      };
    case reducerCase.SET_USER:
      return {
        ...state,
        currentUser: action.user,
      };
    case reducerCase.SWITCH_MODE:
      return {
        ...state,
        isSeller: !state.isSeller,
      };
    case reducerCase.GIG_DATA:
      return {
        ...state,
        gigData: action.gigData,
      };
    case reducerCase.HAS_ORDERED_GIG:
      return {
        ...state,
        hasOrdered: action.hasOrdered,
      };
    case reducerCase.ADD_REVIEW:
      return {
        ...state,
        gigData: {
          ...state.gigData,
          reviews: [...state.gigData.reviews, action.newReviews],
        },
      };
    case reducerCase.LOGOUT:
      return {
        ...state,
        currentUser: undefined,
      };
    default:
      return state;
  }
};
export default reducer;
