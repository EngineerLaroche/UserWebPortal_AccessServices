import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import {
    UPDATE_FIELD_AUTH,
    CREATE_ORGANISME,
    REGISTER_PAGE_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeName: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'name', value }),
    onChangePhone: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'phone', value }),
    onChangeNocivique: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'nocivique', value }),
    onChangeFax: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'fax', value }),
    onChangeEmail: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
    onChangeStreet: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'street', value }),
    onChangeCity: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'city', value }),
    onChangeProvince: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'province', value }),
    onChangePostalcode: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'postalcode', value }),
    onSubmit: (name, email, address, phone, fax) => {
        const payload = agent.Organisme.register(name, email, address, phone, fax);
        dispatch({ type: CREATE_ORGANISME, payload })
    },
    onUnload: () =>
        dispatch({ type: REGISTER_PAGE_UNLOADED })
});

export class CreateOrganisme extends React.Component {
    constructor() {
        super();
        this.changeName = ev => this.props.onChangeName(ev.target.value);
        this.changePhone = ev => this.props.onChangePhone(ev.target.value);
        this.changeState = ev => this.props.onChangeState(ev.target.value);
        this.changeNocivique = ev => this.props.onChangeNocivique(ev.target.value);
        this.changeFax = ev => this.props.onChangeFax(ev.target.value);
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changeCity = ev => this.props.onChangeCity(ev.target.value);
        this.changeStreet = ev => this.props.onChangeStreet(ev.target.value);
        this.changeProvince = ev => this.props.onChangeProvince(ev.target.value);
        this.changePostalcode = ev => this.props.onChangePostalcode(ev.target.value);
        this.submitForm = (name, email, nocivique, street, city, province, postalcode, phone, fax) =>
            ev => {
                ev.preventDefault();
                var address = { nocivique, street, city, province, postalcode };
                this.props.onSubmit(name, email, address, phone, fax);
            }
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
        const nocivique = this.props.novicique;
        const street = this.props.street;
        const city = this.props.city;
        const province = this.props.province;
        const postalcode = this.props.postalcode;

        return (
            <div className="auth-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">
                        <FormattedMessage
                            id="createorganisme.title"
                            defaultMessage="Créer Organisme" />
                    </h1>
                    <hr />
                    <br />
                    <br />

                    <ListErrors errors={this.props.errors} />

                    <div className="row">
                        <div className="col-md-8 offset-md-3 col-xs-12">

                            <form onSubmit={this.submitForm(name, email, nocivique, street, city, province, postalcode, phone, fax).bind(this)}>
                                <h3 className="text-xs-center">Informations</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.name", defaultMessage: "Nom" })}
                                            value={this.props.name}
                                            onChange={this.changeName} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.email", defaultMessage: "Email" })}
                                            value={this.props.email}
                                            onChange={this.changeEmail} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.tel", defaultMessage: "Numéro de téléphone" })}
                                            value={this.props.phone}
                                            onChange={this.changePhone} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.fax", defaultMessage: "Numéro de fax" })}
                                            value={this.props.fax}
                                            onChange={this.changeFax} />
                                    </fieldset>
                                </fieldset>
                                <h3 className="text-xs-center">
                                    <FormattedMessage
                                        id="createorganisme.address"
                                        defaultMessage="Adresse" />
                                </h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.civnum", defaultMessage: "Numéro civique" })}
                                            value={this.props.nocivique}
                                            onChange={this.changeNocivique} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.street", defaultMessage: "Rue" })}
                                            value={this.props.street}
                                            onChange={this.changeStreet} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.city", defaultMessage: "Ville" })}
                                            value={this.props.city}
                                            onChange={this.changeCity} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.province", defaultMessage: "Province" })}
                                            value={this.props.province}
                                            onChange={this.changeProvince} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "createorganisme.postalcode", defaultMessage: "Code postal" })}
                                            value={this.props.postalcode}
                                            onChange={this.changePostalcode} />
                                    </fieldset>
                                </fieldset>
                                <br />
                                <div className="text-xs-center">
                                    <button
                                        className="btn btn-lg btn-primary btn-block"
                                        type="submit"
                                        disabled={this.props.inProgress}>
                                        <FormattedMessage
                                            id="header.create"
                                            defaultMessage="Créer" />
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

CreateOrganisme.propTypes = {
    intl: intlShape.isRequired
};
CreateOrganisme = injectIntl(CreateOrganisme);

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganisme);
