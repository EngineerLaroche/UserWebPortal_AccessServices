import ListErrors from "../ListErrors";
import React from "react";
import agent from "../../agent";
import { FormattedMessage, intlShape, injectIntl } from "react-intl";
import { connect } from "react-redux";

import {
  UPDATE_FIELD_AUTH,
  CREATE_ORGANISME,
  REGISTER_PAGE_UNLOADED,
} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onChangeName: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "name", value }),
  onChangeEmail: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "email", value }),
  onChangePhone: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "phone", value }),
  onChangeFax: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "fax", value }),
  onChangeNoCivique: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "nocivique", value }),
  onChangeStreet: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "street", value }),
  onChangeCity: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "city", value }),
  onChangeProvince: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "province", value }),
  onChangePostalcode: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "postalcode", value }),
  onChangeActif: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "actif", value }),
  onSubmit: (
    name,
    email,
    phone,
    fax,
    nocivique,
    street,
    city,
    province,
    postalcode,
    actif
  ) => {
    const payload = agent.Organisme.register(
      name,
      email,
      phone,
      fax,
      nocivique,
      street,
      city,
      province,
      postalcode,
      actif
    );
    dispatch({ type: CREATE_ORGANISME, payload });
  },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
});

export class CreateOrganisme extends React.Component {
  constructor() {
    super();
    this.changeName = (ev) => this.props.onChangeName(ev.target.value);
    this.changeEmail = (ev) => this.props.onChangeEmail(ev.target.value);
    this.changePhone = (ev) => this.props.onChangePhone(ev.target.value);
    this.changeFax = (ev) => this.props.onChangeFax(ev.target.value);
    this.changeNoCivique = (ev) =>
      this.props.onChangeNoCivique(ev.target.value);
    this.changeStreet = (ev) => this.props.onChangeStreet(ev.target.value);
    this.changeCity = (ev) => this.props.onChangeCity(ev.target.value);
    this.changeProvince = (ev) => this.props.onChangeProvince(ev.target.value);
    this.changePostalcode = (ev) =>
      this.props.onChangePostalcode(ev.target.value);
    this.changeActif = (ev) => this.props.onChangeActif(ev.target.value);
    this.submitForm = (
      name,
      email,
      phone,
      fax,
      nocivique,
      street,
      city,
      province,
      postalcode,
      actif
    ) => (ev) => {
      ev.preventDefault();
      this.props.onSubmit(
        name,
        email,
        phone,
        fax,
        nocivique,
        street,
        city,
        province,
        postalcode,
        actif
      );
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const intl = this.props.intl;
    const name = this.props.name;
    const phone = this.props.phone;
    const fax = this.props.fax;
    const email = this.props.email;
    const nocivique = this.props.nocivique;
    const street = this.props.street;
    const city = this.props.city;
    const province = this.props.province;
    const postalcode = this.props.postalcode;
    const actif = this.props.actif;

    return (
      <div className="create-org">
        <h1 className="text-xs-center">
          <div class="titlecolor">
            <FormattedMessage
              id="createorganisme.title"
              defaultMessage="Creer un Organisme"
            />
          </div>
        </h1>
        <br />
        <div className="container page">

          <ListErrors errors={this.props.errors} />

          <div className="row">
            <div className="col-md-8 offset-md-3 col-xs-12">
              <form
                onSubmit={this.submitForm(
                  name,
                  email,
                  phone,
                  fax,
                  nocivique,
                  street,
                  city,
                  province,
                  postalcode,
                  actif
                ).bind(this)}
              >
                <div className="row">
                  <div class="column2">
                    <h3 className="text-xs-center">Contact</h3>
                    <br/>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.name",
                          defaultMessage: "Nom",
                        })}
                        value={this.props.name}
                        onChange={this.changeName}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.email",
                          defaultMessage: "Email",
                        })}
                        value={this.props.email}
                        onChange={this.changeEmail}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.phone",
                          defaultMessage: "Numéro de téléphone",
                        })}
                        value={this.props.phone}
                        onChange={this.changePhone}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.fax",
                          defaultMessage: "Numéro de fax",
                        })}
                        value={this.props.fax}
                        onChange={this.changeFax}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <select
                        className="form-control form-control-xl"
                        value={this.props.actif}
                        onChange={this.changeActif}
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
                    <br/>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.nocivique",
                          defaultMessage: "Numéro civique",
                        })}
                        value={this.props.nocivique}
                        onChange={this.changeNoCivique}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.street",
                          defaultMessage: "Rue",
                        })}
                        value={this.props.street}
                        onChange={this.changeStreet}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.city",
                          defaultMessage: "Ville",
                        })}
                        value={this.props.city}
                        onChange={this.changeCity}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.province",
                          defaultMessage: "Province",
                        })}
                        value={this.props.province}
                        onChange={this.changeProvince}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-default"
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "createorganisme.postalcode",
                          defaultMessage: "Code postal",
                        })}
                        value={this.props.postalcode}
                        onChange={this.changePostalcode}
                      />
                    </fieldset>
                  </div>
                </div>
                <br />
                <div class="columncenter">
                  <div className="text-xs-center">
                    <button
                      className="btn btn-primary btn-default"
                      type="submit"
                      disabled={this.props.inProgress}
                    >
                      {"Créer Organisme"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateOrganisme.propTypes = {
  intl: intlShape.isRequired,
};
CreateOrganisme = injectIntl(CreateOrganisme);

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganisme);
