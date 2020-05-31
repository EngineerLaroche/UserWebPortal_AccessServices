import ListErrors from "./ListErrors";
import React from "react";
import agent from "../agent";
import { connect } from "react-redux";
import { FormattedMessage, intlShape, injectIntl } from "react-intl";
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
} from "../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onChangeEmail: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "email", value }),
  onChangePassword: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "password", value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED }),
});

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.changeEmail = (ev) => this.props.onChangeEmail(ev.target.value);
    this.changePassword = (ev) => this.props.onChangePassword(ev.target.value);
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
      <div className="auth-page">
        <h1 className="text-xs-center">
          <div class="titlecolor">
            <FormattedMessage id="login.title" defaultMessage="Connexion" />
          </div>
        </h1>
        <br />
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-10">
              <div class="columncenter">
                <ListErrors errors={this.props.errors} />
                <form onSubmit={this.submitForm(email, password)}>
                  <fieldset>
                    <fieldset className="form-group">
                      {"Email"}
                      <input
                        className="form-control form-control-default"
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
                      {"Password"} <a href="">{"(mot de passe oublié)"}</a>
                      <input
                        className="form-control form-control-default"
                        type="password"
                        placeholder={intl.formatMessage({
                          id: "login.password",
                          defaultMessage: "Mot de passe",
                        })}
                        value={password}
                        onChange={this.changePassword}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input type="checkbox" id="myCheck"></input>
                      <a>
                        <FormattedMessage
                          id="login.checkbox"
                          defaultMessage="  Rester connecté"
                        />
                      </a>
                    </fieldset>

                    <button
                      className="btn btn-default btn-primary"
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
        </div>
      </div>
    );
  }
}

Login.propTypes = { intl: intlShape.isRequired };
Login = injectIntl(Login);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
