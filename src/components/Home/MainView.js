import React from "react";
import { connect } from "react-redux";
import { CHANGE_TAB } from "../../constants/actionTypes";
import ListErrors from "../ListErrors";
import agent from "../../agent";
import { FormattedMessage, intlShape, injectIntl } from "react-intl";
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload }),
  onChangeEmail: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "email", value }),
  onChangePassword: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "password", value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED }),
});

const MainView = (props) => {
  return <LoginHome />;
};

export class LoginHome extends React.Component {
  constructor(props) {
    super(props);
    //this.changeEmail = (ev) => this.props.onChangeEmail(ev.target.value);
    //this.changePassword = (ev) => this.props.onChangePassword(ev.target.value);
    this.submitForm = (email, password) => (ev) => {
      ev.preventDefault();
      this.props.onSubmit(email, password);
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const intl = this.props.intl;
    const email = this.props.email;
    const password = this.props.password;
    return (
      <div>
        <div className="row">
          <div class="column">
            <h4 className="text-xs-center">
              <FormattedMessage
                id="home.request"
                defaultMessage="Demande d'accès"
              />
            </h4>
            <hr />
            <br />
            <ListErrors errors={this.props.errors} />

            <form onSubmit={this.submitForm(email, password)}>
              <fieldset>
                <fieldset className="form-group">
                  <div class="bold">{"Email destinataire"}</div>
                  <input
                    className="form-control form-control-sm"
                    placeholder={intl.formatMessage({
                      id: "email@exemple.com",
                      defaultMessage: "email@exemple.com",
                    })}
                    value={email}
                    onChange={this.changeEmail}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <div class="bold">{"Votre email"}</div>
                  <input
                    className="form-control form-control-sm"
                    placeholder={intl.formatMessage({
                      id: "email@exemple.com",
                      defaultMessage: "email@exemple.com",
                    })}
                    value={email}
                    onChange={this.changeEmail}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <div class="bold">{"Votre nom"}</div>
                  <input
                    className="form-control form-control-sm"
                    placeholder={intl.formatMessage({
                      id: "Nom",
                      defaultMessage: "Nom",
                    })}
                    value={email}
                    onChange={this.changeEmail}
                  />
                </fieldset>

                <button
                  className="btn btn-sm btn-primary"
                  type="submit"
                  disabled={this.props.inProgress}
                >
                  <FormattedMessage
                    id="Soumettre demande"
                    defaultMessage="Soumettre demande"
                  />
                </button>
              </fieldset>
            </form>
          </div>

          <div class="column">
            <h4 className="text-xs-center">
              <FormattedMessage id="login.title" defaultMessage="Connexion" />
            </h4>
            <hr />
            <br />
            <ListErrors errors={this.props.errors} />

            <form onSubmit={this.submitForm(email, password)}>
              <fieldset>
                <fieldset className="form-group">
                  <h7 class="bold">{"Email"}</h7>
                  <input
                    className="form-control form-control-sm"
                    type="email"
                    placeholder={intl.formatMessage({
                      id: "login.email",
                      defaultMessage: "Email",
                    })}
                    value={email}
                    onChange={this.changeEmail}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <h7 class="bold">{"Password "}</h7>
                  <h7 class="aa">{" (mot de passe oublié)"}</h7>
                  <input
                    className="form-control form-control-sm"
                    type="password"
                    placeholder={intl.formatMessage({
                      id: "login.password",
                      defaultMessage: "Mot de passe",
                    })}
                    value={password}
                    onChange={this.changePassword}
                  />
                  <input type="checkbox" id="myCheck"></input>
                  <a>
                    <FormattedMessage
                      id="login.checkbox"
                      defaultMessage=" Rester connecté"
                    />
                  </a>
                </fieldset>

                <button
                  className="btn btn-sm btn-primary"
                  type="submit"
                  disabled={this.props.inProgress}
                >
                  <FormattedMessage
                    id="login.button"
                    defaultMessage="Connexion"
                  />
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

LoginHome.propTypes = { intl: intlShape.isRequired };
LoginHome = injectIntl(LoginHome);

export default connect(mapStateToProps, mapDispatchToProps)(
  MainView,
  LoginHome
);
