import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import React from "react";
import { store, history } from "./store";

import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
// Internationalisation
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";

import App from "./components/App";
import {LOCALE_SET} from "./constants/actionTypes";

addLocaleData([...en, ...fr]);

function localeSet(lang){
    return {
        type: LOCALE_SET,
        payload: lang
    }
};
console.log(store.getState());
console.log(localStorage);

if(localStorage.getItem('chosenLanguage')) {
    store.dispatch(localeSet(localStorage.getItem('chosenLanguage')));
}

console.log(store.getState());

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
