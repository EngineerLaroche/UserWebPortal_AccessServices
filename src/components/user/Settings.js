import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
} from '../../constants/actionTypes';

class SettingsForm extends React.Component {
  constructor() {
    super();

    this.state = {
      id: '',
      role: '',
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    };

    this.updateState = field => ev => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };

    this.submitForm = ev => {
      ev.preventDefault();

      const user = Object.assign({}, this.state);
      if (!user.password) {
        delete user.password;
      }

      this.props.onSubmitForm(user);
    };
  }

  componentWillMount() {
    if (this.props.currentUser) {
      Object.assign(this.state, {
        id: this.props.currentUser.id,
        role: this.props.currentUser.role,
        firstname: this.props.currentUser.firstname,
        lastname: this.props.currentUser.lastname,
        email: this.props.currentUser.email
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.setState(Object.assign({}, this.state, {
        id: nextProps.currentUser.id,
        role: nextProps.currentUser.role,
        firstname: nextProps.currentUser.firstname,
        lastname: nextProps.currentUser.lastname,
        email: nextProps.currentUser.email
      }));
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <ListErrors errors={this.props.errors} />

          <select class="form-control" id="ListeRole" name="Role" onChange={this.changeRole} value={this.props.role}>
            <option value="">{this.props.selectrole}</option>
            <option value="1">{this.props.directeur}</option>
            <option value="2">{this.props.coordonateur}</option>
            <option value="3">{this.props.adjointcoordonateur}</option>
            <option value="4">{this.props.intervenant}</option>
          </select>

          <br />

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder={this.props.prenom}
              value={this.state.firstname}
              onChange={this.updateState('firstname')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder={this.props.nom}
              value={this.state.lastname}
              onChange={this.updateState('lastname')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.updateState('email')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder={this.props.pwd}
              value={this.state.password}
              onChange={this.updateState('password')} />
          </fieldset>

          <button
            className="btn btn-lg btn-primary btn-block"
            type="submit"
            disabled={this.state.inProgress}>
            <FormattedMessage
              id="settings.update"
              defaultMessage="Mettre à jour" />
          </button>

        </fieldset>
      </form>
    );
  }
}


const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onSubmitForm: user =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

export class Settings extends React.Component {
  render() {
    const intl = this.props.intl;
    return (
      <div className="settings-page">
        <div className="container page">

          <hr />
          <h1 className="text-xs-center">
            <FormattedMessage
              id="settings.title"
              defaultMessage="Modifier votre profil" />
          </h1>
          <hr />
          <br />
          <br />

          <div className="row">
            <div className="col-md-8 offset-md-2 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>
              <SettingsForm
                currentUser={this.props.currentUser}
                onSubmitForm={this.props.onSubmitForm}
                selectrole={intl.formatMessage({
                  id: "settings.selectrole",
                  defaultMessage: "Veuillez choisir un rôle de la liste."
                })}
                directeur={intl.formatMessage({
                  id: "role.directeur",
                  defaultMessage: "Directeur"
                })}
                coordonateur={intl.formatMessage({
                  id: "role.coordonateur",
                  defaultMessage: "Coordonateur"
                })}
                adjointcoordonateur={intl.formatMessage({
                  id: "role.adjointcoordonateur",
                  defaultMessage: "Adjoint-Coordonateur"
                })}
                intervenant={intl.formatMessage({
                  id: "role.intervenant",
                  defaultMessage: "Intervenant"
                })}
                prenom={intl.formatMessage({
                  id: "settings.firstname",
                  defaultMessage: "Prénom"
                })}
                nom={intl.formatMessage({
                  id: "settings.lastname",
                  defaultMessage: "Nom de famille"
                })}
                pwd={intl.formatMessage({
                  id: "settings.password",
                  defaultMessage: "Nouveau mot de passe"
                })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  intl: intlShape.isRequired
};
Settings = injectIntl(Settings);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
