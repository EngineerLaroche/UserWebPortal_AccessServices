import { LOCALE_SET } from "../constants/actionTypes";

export const localeSet = lang => ({
    type: LOCALE_SET,
    lang: payload.lang
});

export const setLocale = lang => dispatch => {
    window.localStorage.setItem('chosenLanguage',lang);
    dispatch(localeSet(lang));
};