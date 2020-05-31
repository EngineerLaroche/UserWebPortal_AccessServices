import ListErrors from "../ListErrors";
import React from "react";
import agent from "../../agent";
import Request from "superagent";
import { FormattedMessage, intlShape, injectIntl } from "react-intl";
import { connect } from "react-redux";
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  UPDATE_ORGANISME,
} from "../../constants/actionTypes";

export class EditOrganismeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.currentOrganisme.id,
      name: props.currentOrganisme.name,
      email: props.currentOrganisme.email,
      phone: props.currentOrganisme.phone,
      fax: props.currentOrganisme.fax,
      nocivique: props.currentOrganisme.nocivique,
      street: props.currentOrganisme.street,
      city: props.currentOrganisme.city,
      province: props.currentOrganisme.province,
      postalcode: props.currentOrganisme.postalcode,
      actif: props.currentOrganisme.actif,
    };

    this.updateState = (field) => (ev) => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };

    this.submitForm = (ev) => {
      ev.preventDefault();

      const currentOrganisme = Object.assign({}, this.state);
      this.props.onSubmitForm(currentOrganisme);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentOrganisme) {
      this.setState(
        Object.assign({}, this.state, {
          id: nextProps.currentOrganisme.id,
          name: nextProps.currentOrganisme.name,
          email: nextProps.currentOrganisme.email,
          phone: nextProps.currentOrganisme.phone,
          fax: nextProps.currentOrganisme.fax,
          nocivique: nextProps.currentOrganisme.nocivique,
          street: nextProps.currentOrganisme.street,
          city: nextProps.currentOrganisme.city,
          province: nextProps.currentOrganisme.province,
          postalcode: nextProps.currentOrganisme.postalcode,
          actif: nextProps.currentOrganisme.actif,
        })
      );
    }
  }

  render() {
    const intl = this.props.intl;
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>
          <div className="row">
            <div class="column2">
              <h3 className="text-xs-center">Contact</h3>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.name}
                  value={this.state.name}
                  onChange={this.updateState("name")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.email}
                  value={this.state.email}
                  onChange={this.updateState("email")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.phone}
                  value={this.state.phone}
                  onChange={this.updateState("phone")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.fax}
                  value={this.state.fax}
                  onChange={this.updateState("fax")}
                />
              </fieldset>

              <fieldset className="form-group">
                <select
                  className="form-control form-control-xl"
                  value={this.state.actif}
                  onChange={this.updateState("state")}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </fieldset>
            </div>

            <div class="column2">
              <h3 className="text-xs-center">
                <FormattedMessage
                  id="createorganisme.address"
                  defaultMessage="Adresse"
                />
              </h3>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.nocivique}
                  value={this.state.nocivique}
                  onChange={this.updateState("nocivique")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.street}
                  value={this.state.street}
                  onChange={this.updateState("street")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.city}
                  value={this.state.city}
                  onChange={this.updateState("city")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.province}
                  value={this.state.province}
                  onChange={this.updateState("province")}
                />
              </fieldset>

              <fieldset className="form-group">
                <input
                  className="form-control form-control-default"
                  type="text"
                  placeholder={this.props.postalcode}
                  value={this.state.postalcode}
                  onChange={this.updateState("postalcode")}
                />
              </fieldset>
            </div>
          </div>

          <br />
          <div class="columncenter">
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={this.state.inProgress}
            >
              <FormattedMessage
                id="settings.update"
                defaultMessage="Mettre à jour"
              />
            </button>
          </div>
        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.settings,
  currentOrganisme: state.currentOrganisme,
});

const mapDispatchToProps = (dispatch) => ({
  onSubmitForm: (organisme) =>
    dispatch({
      type: UPDATE_ORGANISME,
      payload: agent.Organisme.save(organisme),
    }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED }),
});

export class EditOrganisme extends React.Component {
  constructor() {
    super();
    this.state = {
      currentOrganisme: "",
    };
  }
  componentWillMount() {
    if (this.props.currentOrganisme) {
      Object.assign(this.state, {
        name: this.props.currentOrganisme.name,
        email: this.props.currentOrganisme.email,
        phone: this.props.currentOrganisme.phone,
        fax: this.props.currentOrganisme.fax,
        nocivique: this.props.currentOrganisme.nocivique,
        street: this.props.currentOrganisme.street,
        city: this.props.currentOrganisme.city,
        province: this.props.currentOrganisme.province,
        postalcode: this.props.currentOrganisme.postalcode,
        actif: this.props.currentOrganisme.actif,
      });
    } else {
      var url =
        "http://localhost:4000/organisme/" + this.props.match.params.email;
      Request.get(url).then((response) => {
        console.log(response.body);
        var data = response.body.organisme;
        this.setState({ currentOrganisme: data });
      });
    }
  }
  render() {
    const intl = this.props.intl;
    const currentOrganisme = this.state.currentOrganisme;
    if (!currentOrganisme) {
      return null;
    }
    return (
      <div className="settings-page">
        <div className="container page">
          <hr />
          <hr />
          <h1 className="text-xs-center">
            <a href="">
              <FormattedMessage
                id="Modifier l'organisme"
                defaultMessage="Modifier l'organisme"
              />
            </a>
          </h1>
          <hr />
          <br />

          <div className="row">
            <div className="col-md-8 offset-md-2 col-xs-12">
              <ListErrors errors={this.props.errors}></ListErrors>
              <EditOrganismeForm
                currentOrganisme={currentOrganisme}
                name={intl.formatMessage({
                  id: "createorganisme.name",
                  defaultMessage: "Nom",
                })}
                email={intl.formatMessage({
                  id: "createorganisme.email",
                  defaultMessage: "Email",
                })}
                phone={intl.formatMessage({
                  id: "createorganisme.phone",
                  defaultMessage: "Numéro de téléphone",
                })}
                fax={intl.formatMessage({
                  id: "createorganisme.fax",
                  defaultMessage: "Numéro de fax",
                })}
                nocivique={intl.formatMessage({
                  id: "createorganisme.nocivique",
                  defaultMessage: "Numéro civique",
                })}
                street={intl.formatMessage({
                  id: "createorganisme.street",
                  defaultMessage: "Rue",
                })}
                city={intl.formatMessage({
                  id: "createorganisme.city",
                  defaultMessage: "Ville",
                })}
                province={intl.formatMessage({
                  id: "createorganisme.province",
                  defaultMessage: "Province",
                })}
                postalcode={intl.formatMessage({
                  id: "createorganisme.postalcode",
                  defaultMessage: "Code postal",
                })}
                active={intl.formatMessage({
                  id: "editorganisme.active",
                  defaultMessage: "Actif",
                })}
                inactive={intl.formatMessage({
                  id: "editorganisme.inactive",
                  defaultMessage: "Inactif",
                })}
                onSubmitForm={this.props.onSubmitForm}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditOrganisme.propTypes = {
  intl: intlShape.isRequired,
};
EditOrganisme = injectIntl(EditOrganisme);

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganisme);
