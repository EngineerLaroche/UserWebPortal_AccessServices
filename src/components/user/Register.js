import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
  UPDATE_FIELD_AUTH,
  REGISTER,
  REGISTER_PAGE_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeFirstname: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'firstname', value }),
  onChangeLastname: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'lastname', value }),
  onChangeRole: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'role', value }),
  onSubmit: (role, firstname, lastname, email, password) => {
    const payload = agent.Auth.register(role, firstname, lastname, email, password);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () =>
    dispatch({ type: REGISTER_PAGE_UNLOADED })
});

export class Register extends React.Component {
  constructor() {
    super();
    this.changeRole = ev => this.props.onChangeRole(ev.target.value);
    this.changeFirstname = ev => this.props.onChangeFirstname(ev.target.value);
    this.changeLastname = ev => this.props.onChangeLastname(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.submitForm = (firstname, lastname, email, password, role) => ev => {
      ev.preventDefault();

      this.props.onSubmit(firstname, lastname, email, password, role);
    }
    this.userRole = localStorage.getItem('role');
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    const role = this.props.role;
    const firstname = this.props.firstname;
    const lastname = this.props.lastname;
    const email = this.props.email;
    const password = this.props.password;
    const intl = this.props.intl;

    return (

      <div className="auth-page">
        <div className="container page">

          <hr />
          <h1 className="text-xs-center">
            <FormattedMessage
              id="register.title"
              defaultMessage="Créer Usager" />
          </h1>
          <hr />
          <br />
          <br />

          <ListErrors errors={this.props.errors} />

          <div className="row">
            <div className="col-md-8 offset-md-3 col-xs-12">
              <h3 className="text-xs-center">
                <FormattedMessage
                  id="register.role"
                  defaultMessage="Rôle Usager" />
              </h3>
              <form onSubmit={this.submitForm(firstname, lastname, email, password, role).bind(this)}>
                <select className="form-control" id="ListeRole" name="Role" onChange={this.changeRole} value={this.props.role}>
                  <option value="">
                    {intl.formatMessage({
                      id: "settings.selectrole",
                      defaultMessage: "Veuillez selectionner un rôle dans la liste"
                    })}
                  </option>

                  {this.userRole === '1' && <option value='1'>
                    {intl.formatMessage({
                      id: "role.directeur",
                      defaultMessage: "Directeur"
                    })}
                  </option>}
                  {(this.userRole === '2' || this.userRole === '1') && <option value='2'>
                    {intl.formatMessage({
                      id: "role.coordonateur",
                      defaultMessage: "Coordonateur"
                    })}
                  </option>}

                  <option value="3">
                    {intl.formatMessage({
                      id: "role.adjointcoordonateur",
                      defaultMessage: "Adjoint-Coordonateur"
                    })}
                  </option>
                  <option value="4">
                    {intl.formatMessage({
                      id: "role.intervenant",
                      defaultMessage: "Intervenant"
                    })}
                  </option>
                </select>
                <br />

                <h3 className="text-xs-center">Informations</h3>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "settings.firstname",
                        defaultMessage: "Prénom"
                      })}
                      value={this.props.firstname}
                      onChange={this.changeFirstname} />
                  </fieldset>
                </fieldset>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "settings.lastname",
                        defaultMessage: "Nom de famille"
                      })}
                      value={this.props.lastname}
                      onChange={this.changeLastname} />
                  </fieldset>
                </fieldset>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.props.email}
                      onChange={this.changeEmail} />
                  </fieldset>
                </fieldset>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder={intl.formatMessage({
                        id: "register.password",
                        defaultMessage: "Mot de passe"
                      })}
                      value={this.props.password}
                      onChange={this.changePassword} />
                  </fieldset>
                </fieldset>
                <div className="text-xs-center">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    type="submit"
                    disabled={this.props.inProgress}>
                    <FormattedMessage
                      id="register.button"
                      defaultMessage="Créer Usager" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  intl: intlShape.isRequired
};
Register = injectIntl(Register);

export default connect(mapStateToProps, mapDispatchToProps)(Register);