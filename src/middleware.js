import agent from './agent';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER,
  REACTIVATE,
  DEACTIVATE,
  SETTINGS_SAVED,
  USER_SAVED,

  REGISTER_REFERENT,
  REFERENT_UPDATED,

  CREATE_ORGANISME,
  UPDATE_ORGANISME,

  CREATE_ORGANISME_REFERENT,
  UPDATE_ORGANISME_REFERENT,

  CREATE_SERVICE,
  UPDATE_SERVICE,

  CREATE_POINT_SERVICE,
  UPDATE_POINT_SERVICE,

  UPDATE_DEMANDE_SERVICE,
  CREATE_DEMANDE_SERVICE,
  ADD_MOTIF
  
} from './constants/actionTypes';

const promiseMiddleware = store => next => action => {
  
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

        const currentView = store.getState().viewChangeCounter;
        const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('RESULT', res);
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      error => {
        const currentState = store.getState();
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );
    return;
  }
  next(action);
};

const localStorageMiddleware = store => next => action => {
  switch (action.type) {
    case LOGIN:
      if (!action.error) {
        if (!!action.payload.lang) {
            window.localStorage.setItem('chosenLang', action.payload.lang);
        }
        if (!!action.payload.user) {
          window.localStorage.setItem('jwt', action.payload.user.token);
          window.localStorage.setItem('role', action.payload.user.role);
          window.localStorage.setItem('currentUser', action.payload.user);

          agent.setToken(action.payload.user.token);
        }
      } else {
        alert(action.payload.error);
      }
      break;
    
    case LOGOUT:
      window.localStorage.setItem('jwt', '');
      window.localStorage.setItem('currentUser', '');
      window.localStorage.setItem('role', '');
      agent.setToken(null);
      break;
    
    case DEACTIVATE:
    
    case REACTIVATE:
      if (action.error) {
        alert(action.payload.error);
      } else {
        alert(action.payload.message);
      }
      break;
   
    case CREATE_DEMANDE_SERVICE:
    case UPDATE_DEMANDE_SERVICE:
    case ADD_MOTIF:

    case CREATE_ORGANISME:
    case UPDATE_ORGANISME:
  
    case CREATE_ORGANISME_REFERENT:
    case UPDATE_ORGANISME_REFERENT:

    case CREATE_POINT_SERVICE:
    case UPDATE_POINT_SERVICE:

    case CREATE_SERVICE:
    case UPDATE_SERVICE:

    case REGISTER_REFERENT:
    case REFERENT_UPDATED:

    case SETTINGS_SAVED:
    case USER_SAVED:
      if (action.error) {
        alert(action.payload.error);
      } else {
        alert(action.payload.Message);
      }
      break;
    default:
      break;
  }
  next(action);
};

function isPromise(v) {
    return v && typeof v.then === 'function';
}

export { promiseMiddleware, localStorageMiddleware }

