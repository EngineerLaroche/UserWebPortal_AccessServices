import auth from './reducers/auth';
import {combineReducers} from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import settings from './reducers/settings';
import locale from './reducers/locale';
import {routerReducer} from 'react-router-redux';

export default combineReducers({
    locale,
    auth,
    common,
    home,
    settings,
    router: routerReducer,
});
