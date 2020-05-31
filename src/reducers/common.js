import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  SETTINGS_SAVED,
  LOGIN,
  REGISTER,
  HOME_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  REGISTER_REFERENT,
  REFERENT_UPDATED,
  CREATE_ORGANISME,
  UPDATE_ORGANISME,
  CREATE_ORGANISME_REFERENT,
  UPDATE_ORGANISME_REFERENT,
  CREATE_POINT_SERVICE,
  UPDATE_POINT_SERVICE,
  CREATE_SERVICE,
  UPDATE_SERVICE,
  CREATE_DEMANDE_SERVICE,
  UPDATE_DEMANDE_SERVICE,
} from "../constants/actionTypes";

const defaultState = {
  appName: "RQRSDA",
  token: null,
  viewChangeCounter: 0,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
        isUser: action.payload ? action.payload.currentUser : null,
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: "/", token: null, currentUser: null };
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : "/profile",
        currentUser: action.error ? null : action.payload.user,
      };

    case LOGIN:
      window.location.reload();
      return {
        ...state,
        redirectTo: action.error ? null : "/profile",
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
      };
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : "/users",
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
      };

    case HOME_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return {
        ...state,
        viewChangeCounter: state.viewChangeCounter + 1,
      };

    case REGISTER_REFERENT:
      return {
        ...state,
        redirectTo: action.error ? null : "/referents",
      };
    case REFERENT_UPDATED:
      return {
        ...state,
        redirectTo: action.error ? null : "/referent/" + action.payload.Email,
      };

    case CREATE_ORGANISME:
      return {
        ...state,
        redirectTo: action.error ? null : "/organismes",
      };
    case UPDATE_ORGANISME:
      return {
        ...state,
        redirectTo: action.error ? null : "/organismes",
      };

    case CREATE_ORGANISME_REFERENT:
      return {
        ...state,
        redirectTo: action.error ? null : "/organismereferents",
      };
    case UPDATE_ORGANISME_REFERENT:
      return {
        ...state,
        redirectTo: action.error
          ? null
          : "/organismereferent/" + action.payload.Email,
      };

    case CREATE_POINT_SERVICE:
      return {
        ...state,
        redirectTo: action.error ? null : "/pointservices",
      };
    case UPDATE_POINT_SERVICE:
      return {
        ...state,
        redirectTo: action.error
          ? null
          : "/pointservice/" + action.payload.Email,
      };

    case CREATE_SERVICE:
      return {
        ...state,
        redirectTo: action.error ? null : "/services",
      };
    case UPDATE_SERVICE:
      return {
        ...state,
        redirectTo: action.error ? null : "/service/" + action.payload.Name,
      };

    case CREATE_DEMANDE_SERVICE:
      return {
        ...state,
        redirectTo: action.error ? null : "/demandeServices",
      };
    case UPDATE_DEMANDE_SERVICE:
      return {
        ...state,
        redirectTo: action.error
          ? null
          : "/demandeService/" + action.payload.Id,
      };

    default:
      return state;
  }
};
