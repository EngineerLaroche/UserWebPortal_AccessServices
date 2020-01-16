import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  SETTINGS_PAGE_UNLOADED,
  REFERENT_UPDATED,
  ASSOCIATE_REFERENT,
  ASSOCIATE_REFERENT_PREFERENCE,
  ASSOCIATE_REFERENT_CLEAR_PREFERENCE
} from '../../constants/actionTypes';

export class EditReferentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      id: '',
      firstname: '',
      lastname: '',
      title: '',
      workPhone: '',
      cellPhone: '',
      fax: '',
      email: '',
      selectedOptions: null,
      selectedPrefs: null,
      preferencesArray: []
    };

    this.updateState = field => ev => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };


    this.submitForm = ev => {
      ev.preventDefault();

      const referent = Object.assign({
        id: this.state.id,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        title: this.state.title,
        workPhone: this.state.workPhone,
        cellPhone: this.state.cellPhone,
        fax: this.state.fax,
        email: this.state.email
      });

      this.props.onSubmitForm(referent);

      this.props.onAssociate(this.state.organismesSelected, referent.email);

      this.props.onClearPreference(referent.email);

      this.props.onPreference(this.state.preferencesSelected, referent.email);
    };
  }

  handleChangePreferences = (selectedOptions) => {
    this.setState({ 'preferencesSelected': selectedOptions });
    console.log(`Preference selected:`, selectedOptions);
  };

  handleChangeOrganismes = (selectedOptions) => {
    this.setState({ 'organismesSelected': selectedOptions });
    console.log(`Option selected:`, selectedOptions);
  };

  componentWillMount() {
    if (this.props.currentReferent) {
      Object.assign(this.state, {
        id: this.props.currentReferent.id,
        firstname: this.props.currentReferent.firstname,
        lastname: this.props.currentReferent.lastname,
        title: this.props.currentReferent.title,
        workPhone: this.props.currentReferent.workphone,
        cellPhone: this.props.currentReferent.cellphone,
        fax: this.props.currentReferent.fax,
        email: this.props.currentReferent.email
      });
    }
    var url = "http://localhost:4000/organismereferents"
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.rows;
      this.setState({ 'organismesReferent': data });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentReferent) {
      this.setState(Object.assign({}, this.state, {
        id: nextProps.currentReferent.id,
        firstname: nextProps.currentReferent.firstname,
        lastname: nextProps.currentReferent.lastname,
        title: nextProps.currentReferent.title,
        workPhone: nextProps.currentReferent.workphone,
        cellPhone: nextProps.currentReferent.cellphone,
        fax: nextProps.currentReferent.fax,
        email: nextProps.currentReferent.email
      }));
      var currentOrganismes = [];
      for (var i = 0; i < nextProps.currentOrganismeReferents.length; i++) {
        currentOrganismes.push({
          value: nextProps.currentOrganismeReferents[i].OrganismeId,
          label: nextProps.currentOrganismeReferents[i].OrganismeName
        });
      }
      var currentPreferences = [];
      for (var j = 0; j < nextProps.currentPreferences.length; j++) {
        currentPreferences.push({
          value: nextProps.currentPreferences[j].PreferenceId,
          label: nextProps.currentPreferences[j].PreferenceType
        });
      }
      this.setState({ 'organismesSelected': currentOrganismes });
      this.setState({ 'preferencesSelected': currentPreferences });

      var url = "http://localhost:4000/organismereferents"
      Request.get(url).then((response) => {
        console.log(response.body);
        var data = response.body.rows;
        this.setState({ 'organismesReferent': data });
      });

      var preferenceUrl = "http://localhost:4000/preferencesreferent"
      Request.get(preferenceUrl).then((response) => {
        console.log(response.body);
        var data = response.body.Preferences;
        this.setState({ 'preferencesArray': data });
      });
    }
  }

  render() {
    const currentReferent = this.props.currentReferent;
    if (!currentReferent) {
      return null;
    }

    const organismesReferent = [];
    if (this.state != null && this.state.organismesReferent != null) {
      Object.values(this.state.organismesReferent).map((d) =>
        organismesReferent.push({ value: d.Id, label: d.Name })
      );
    }
    const preferences = [];
    if (this.state != null && this.state.preferencesArray != null) {
      Object.values(this.state.preferencesArray).map((d) =>
        preferences.push({ value: d.Id, label: d.Type })
      );
    }
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
          <br/>
          <fieldset className="form-group">
            <h3 className="text-xs-center">Association</h3>
            <Select
              placeholder="Organismes référent"
              className="form-control form-control-xl"
              value={this.state.organismesSelected}
              selectedOptions={this.state.organismesSelected}
              options={organismesReferent}
              isMulti={true}
              isSearchable={true}
              onChange={this.handleChangeOrganismes.bind(this)}>
              )}
                    </Select>
          </fieldset>
          <br />

          <fieldset className="form-group">
            <h3 className="text-xs-center">Préférence Communication</h3>
            <Select
              placeholder="Preferences"
              className="form-control form-control-xl"
              value={this.state.preferencesSelected}
              options={preferences}
              selectedOptions={this.state.preferencesSelected}
              isMulti={true}
              isSearchable={true}
              onChange={this.handleChangePreferences.bind(this)}>
              )}
                    </Select>
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
    currentReferent: state.common.currentReferent,
    organismesSelected: [],
    preferencesSelected: []
});

const mapDispatchToProps = dispatch => ({
    onSubmitForm: referent =>
        dispatch({ type: REFERENT_UPDATED, payload: agent.Referent.save(referent) }),
    onPreference: (preferencesSelected, email) => {
        preferencesSelected.forEach(function (element) {
            const payload = agent.Referent.preference(element.value, email);
            dispatch({ type: ASSOCIATE_REFERENT_PREFERENCE, payload })
        });
    },
    onClearPreference: (email) => {
        const payload = agent.Referent.clear(email);
        dispatch({ type: ASSOCIATE_REFERENT_CLEAR_PREFERENCE, payload})
    },
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED }),
    onAssociate: (organismesSelected, email) => {
        if (organismesSelected.length > 0) {
            organismesSelected.forEach(function (element) {
                const payload = agent.Referent.associate(element.value, email);
                dispatch({ type: ASSOCIATE_REFERENT, payload })
            });
        } else {
            const payload = agent.Referent.associate(0, email);
            dispatch({ type: ASSOCIATE_REFERENT, payload })
        }
    }
});

class EditReferent extends React.Component {
    constructor() {
        super();
        this.state = {
            currentReferent: '',
            organismes: [],
            preferenceTypes: []
        }
    }

    componentWillMount() {
        var associationUrl = "http://localhost:4000/referent/associations/" + this.props.match.params.email;
        Request.get(associationUrl).then((response) => {
            console.log(response.body);
            var data = response.body;
            this.setState({ 'organismes': data.organismeReferents });
            this.setState({ 'preferenceTypes': data.preferenceTypes });
        });
        var url = "http://localhost:4000/referent/" + this.props.match.params.email;
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body;
            this.setState({ 'currentReferent': data.referent });
        });
    }

    render() {
        return (
            <div className="settings-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">Paramètres du Référent</h1>
                    <hr />
                    <br />
                    <br />

                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">

                            <ListErrors errors={this.props.errors}></ListErrors>
                            <EditReferentForm
                                currentReferent={this.state.currentReferent}
                                currentOrganismeReferents={this.state.organismes}
                                currentPreferences={this.state.preferenceTypes}
                                onSubmitForm={this.props.onSubmitForm}
                                onPreference={this.props.onPreference}
                                onClearPreference={this.props.onClearPreference}
                                onAssociate={this.props.onAssociate} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditReferent);