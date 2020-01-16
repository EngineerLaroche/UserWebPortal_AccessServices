import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import { store } from '../store';
import { push } from 'react-router-redux';
import { IntlProvider } from 'react-intl';

import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/user/Profile';
import Register from '../components/user/Register';
import Settings from '../components/user/Settings';
import ListUsers from '../components/user/ListUsers';
import UserDetails from './user/_UserDetails';
import EditUserDetails from './user/_EditUserDetails';

// Intl
import { FormattedMessage } from 'react-intl';
import messages from "./locales";

import ProfileReferent from '../components/referent/ProfileReferent';
import RegisterReferent from '../components/referent/RegisterReferent';
import EditReferent from '../components/referent/EditReferent';
import ListReferents from '../components/referent/ListReferents';

import CreateOrganismeReferent from './organismeReferent/CreateOrganismeReferent';
import ListOrganismeReferents from './organismeReferent/ListOrganismeReferents';
import OrganismeReferentDetails from './organismeReferent/OrganismeReferentDetails';
import EditOrganismeReferent from './organismeReferent/EditOrganismeReferent';

import CreateOrganisme from './organisme/CreateOrganisme';
import ListOrganismes from './organisme/ListOrganismes';
import OrganismeDetails from './organisme/OrganismeDetails';
import EditOrganisme from './organisme/EditOrganisme';

import CreatePointService from './pointService/CreatePointService';
import ListPointServices from './pointService/ListPointServices';
import PointServiceDetails from './pointService/PointServiceDetails';
import EditPointService from './pointService/EditPointService';

import CreateService from './service/CreateService';
import ListServices from './service/ListServices';
import ServiceDetails from './service/ServiceDetails';
import EditService from './service/EditService';

import CreateDemandeService from './demandeService/CreateDemandeService';
import ListDemandeService from './demandeService/ListDemandeService';
import DetailsDemandeService from './demandeService/DetailsDemandeService';
import EditDemandeService from './demandeService/EditDemandeService';

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    lang: state.locale.lang,
    currentUser: state.common.currentUser,
    currentReferent: state.common.currentReferent,
    currentOrganismeReferent: state.common.currentOrganismeReferent,
    currentOrganisme: state.common.currentOrganisme,
    currentPointService: state.common.currentPointService,
    currentService: state.common.currentService,
    redirectTo: state.common.redirectTo
  }
};

const mapDispatchToProps = dispatch => ({
    onLoad: (payload, token) =>
        dispatch({type: APP_LOAD, payload, token, skipTracking: true}),
    onRedirect: () =>
        dispatch({type: REDIRECT})
});

class App extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.redirectTo) {
            // this.context.router.replace(nextProps.redirectTo);
            store.dispatch(push(nextProps.redirectTo));
            this.props.onRedirect();
        }
    }

    componentWillMount() {
        const token = window.localStorage.getItem('jwt');
        if (token) {
            agent.setToken(token);
        }

        this.props.onLoad(token ? agent.Auth.current() : null, token);
    }

  render() {
    if (this.props.appLoaded) {
      return (

          <IntlProvider locale={this.props.lang} messages={messages[this.props.lang]}>
            <div>
              <Header
                appName={<FormattedMessage id="app.name" defaultMessage="RQRSDA"/>}
                lang={this.props.lang}
                currentUser={this.props.currentUser}
                currentReferent={this.props.currentReferent}
                currentPointService={this.props.currentPointService}
                currentService={this.props.currentService}
              />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/user/register" component={Register} />
                <Route path="/settings" component={Settings} />
                <Route path="/Profile" component={Profile} />
                <Route path="/@:email" component={Profile} />

                <Route path="/users" component={ListUsers} />
                <Route path="/user/:email" component={UserDetails} />
                <Route path="/user_edit/:email" component={EditUserDetails} />

                <Route path="/referent/register" component={RegisterReferent} />
                <Route path="/referent/:email" component={ProfileReferent} />
                <Route path="/editreferent/:email" component={EditReferent} />
                <Route path="/referents" component={ListReferents} />

                <Route path="/organismereferent/create" component={CreateOrganismeReferent} />
                <Route path="/organismereferent/edit/:email" component={EditOrganismeReferent} />
                <Route path="/organismereferent/:email" component={OrganismeReferentDetails} />
                <Route path="/organismereferents" component={ListOrganismeReferents} />

                <Route path="/organisme/create" component={CreateOrganisme} />
                <Route path="/organisme/edit/:email" component={EditOrganisme} />
                <Route path="/organisme/:email" component={OrganismeDetails} />
                <Route path="/organismes" component={ListOrganismes} />

                <Route path="/pointService/create" component={CreatePointService} />
                <Route path="/pointService/edit/:email" component={EditPointService} />
                <Route path="/pointService/:email" component={PointServiceDetails} />
                <Route path="/pointServices" component={ListPointServices} />

                <Route path="/service/create" component={CreateService} />
                <Route path="/service/edit/:name" component={EditService} />
                <Route path="/service/:name" component={ServiceDetails} />
                <Route path="/services" component={ListServices} />

                <Route path="/demandeService/create" component={CreateDemandeService} />
                <Route path="/demandeService/edit/:id" component={EditDemandeService} />
                <Route path="/demandeService/:id" component={DetailsDemandeService} />
                <Route path="/demandeServices" component={ListDemandeService} />
              </Switch>
            </div>
          </IntlProvider>
      );
    }
    return (
        <IntlProvider locale={this.props.lang} messages={messages[this.props.lang]}>
        <div>
            <Header
              appName={this.props.appName}
              currentUser={this.props.currentUser}
              currentReferent={this.props.currentReferent}
              currentOrganismeReferent={this.props.currentOrganismeReferent}
              currentOrganisme={this.props.currentOrganisme}
              currentPointService={this.props.currentPointService}
              currentService={this.props.currentService} />
            </div>
        </IntlProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
