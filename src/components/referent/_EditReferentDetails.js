//***TEMPORAIRE***
//Utilisé pour éditer le Référent à partir de la liste des Référents
//Ce fichier est dans le fond une copie du fichier SettingsReferent.js

import ListErrors from './ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED
} from '../constants/actionTypes';

class EditReferentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      firstname: '',
      lastname: '',
      title: '',
      workPhone: '',
      cellPhone: '',
      fax: '',
      email: ''
    };

    this.updateState = field => ev => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };

    this.submitForm = ev => {
      ev.preventDefault();

      const referent = Object.assign({}, this.state);
      this.props.onSubmitForm(referent);
    };
  }

  componentWillMount() {
    if (this.props.currentReferent) {
      Object.assign(this.state, {
        firstname: this.props.currentReferent.firstname,
        lastname: this.props.currentReferent.lastname,
        title: this.props.currentReferent.title,
        workPhone: this.props.currentReferent.workPhone,
        cellPhone: this.props.currentReferent.cellPhone,
        fax: this.props.currentReferent.fax,
        email: this.props.currentReferent.email
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentReferent) {
      this.setState(Object.assign({}, this.state, {

        firstname: nextProps.currentReferent.firstname,
        lastname: nextProps.currentReferent.lastname,
        title: nextProps.currentReferent.title,
        workPhone: nextProps.currentReferent.workPhone,
        cellPhone: nextProps.currentReferent.cellPhone,
        fax: nextProps.currentReferent.fax,
        email: nextProps.currentReferent.email
      }));
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Prénom"
              value={this.state.firstname}
              onChange={this.updateState('firstname')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Nom de famille"
              value={this.state.lastname}
              onChange={this.updateState('lastname')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Titre"
              value={this.state.title}
              onChange={this.updateState('title')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="phone"
              placeholder="Tel. Travail"
              value={this.state.workPhone}
              onChange={this.updateState('workPhone')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="phone"
              placeholder="Tel. Cellulaire"
              value={this.state.cellPhone}
              onChange={this.updateState('cellPhone')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="phone"
              placeholder="Fax"
              value={this.state.fax}
              onChange={this.updateState('fax')} />
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.updateState('email')} />
          </fieldset>

          <button
            className="btn btn-lg btn-primary btn-block"
            type="submit"
            disabled={this.state.inProgress}>
            Mettre à jour
          </button>

        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  ...state.settings,
  currenReferent: state.common.currentReferent
});

//A retirer: agent.Auth  ?
const mapDispatchToProps = dispatch => ({
  onSubmitForm: referent =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(referent) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class EditReferentDetails extends React.Component {
  render() {
    return (
      <div className="settings-page">
        <div className="container page">

              <hr/>
              <h1 className="text-xs-center">Paramètres du Référent</h1>
              <hr/>
              <br/>
              <br/>

          <div className="row">
            <div className="col-md-8 offset-md-3 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>
              <EditReferentForm
                currentReferent={this.props.currentRefrent}
                onSubmitForm={this.props.onSubmitForm} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//connect ?
export default connect(mapStateToProps, mapDispatchToProps)(EditReferentDetails);
