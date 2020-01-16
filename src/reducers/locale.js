import { LOCALE_SET } from '../constants/actionTypes';

const defaultState = {
    lang: 'fr'
};

export default function locale(state = defaultState, action) {
    switch (action.type) {
        case LOCALE_SET:
            return {
                ...state,
                lang: action.payload ? action.payload : 'fr'
            };
        default:
            return state;
    }
};