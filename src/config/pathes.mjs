export const MFLIX_COMMENTS = "/comments";
export const MFLIX_MOVIES_RATED = "/movies/rated";
export const ACCOUNTS_ACCOUNT = "/account";
export const ADD_UPDATE_COMMENT = "/mflix" + MFLIX_COMMENTS;
export const DELETE_GET_COMMENT = MFLIX_COMMENTS + "/:id";
export const GET_MOVIES_RATED = "/mflix" + MFLIX_MOVIES_RATED;
export const ADD_UPDATE_ACCOUNT = "/accounts" + ACCOUNTS_ACCOUNT;
export const DELETE_GET_ACCOUNT = ACCOUNTS_ACCOUNT + "/:username";
export const SET_ROLE_ACCOUNT = ADD_UPDATE_ACCOUNT + "/role";
export const ACCOUNTS_SET_ROLE = ACCOUNTS_ACCOUNT + "/role";
export const ACCOUNTS_LOGIN = ACCOUNTS_ACCOUNT + "/login";
export const LOGIN = "/accounts/account/login";