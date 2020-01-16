import ListErrors from '../ListErrors';
import React from 'react';
import Request from 'superagent';
import agent from '../../agent';
import { connect } from 'react-redux';

import {
    UPDATE_FIELD_AUTH,
    CREATE_ORGANISME_REFERENT,
    REGISTER_PAGE_UNLOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeName: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'name', value }),
    onChangePhone: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'phone', value }),
    onChangeWebsite: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'website', value }),
    onChangeState: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'state', value }),
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
    onChangeOrganisme: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'organisme', value }),
    onSubmit: (name, email, address, phone, fax, website, state, organisme) => {
        const payload = agent.OrganismeReferent.register(name, email, address, phone, fax, website, state, organisme);
        dispatch({ type: CREATE_ORGANISME_REFERENT, payload })
    },
    onUnload: () =>
        dispatch({ type: REGISTER_PAGE_UNLOADED })
});

export class CreateOrganismeReferent extends React.Component {
    constructor() {
        super();
        this.changeName = ev => this.props.onChangeName(ev.target.value);
        this.changePhone = ev => this.props.onChangePhone(ev.target.value);
        this.changeWebsite = ev => this.props.onChangeWebsite(ev.target.value);
        this.changeState = ev => this.props.onChangeState(ev.target.value);
        this.changeNocivique = ev => this.props.onChangeNocivique(ev.target.value);
        this.changeFax = ev => this.props.onChangeFax(ev.target.value);
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changeCity = ev => this.props.onChangeCity(ev.target.value);
        this.changeStreet = ev => this.props.onChangeStreet(ev.target.value);
        this.changeProvince = ev => this.props.onChangeProvince(ev.target.value);
        this.changePostalcode = ev => this.props.onChangePostalcode(ev.target.value);
        this.changeOrganisme = ev => this.props.onChangeOrganisme(ev.target.value);
        this.submitForm = (name, email, nocivique, street, city, province, postalcode, phone, fax, website, state, organisme) => ev => {
            ev.preventDefault();
            var address = { nocivique, street, city, province, postalcode };
            this.props.onSubmit(name, email, address, phone, fax, website, state, organisme);
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    componentWillMount() {
        var url = "http://localhost:4000/organismes"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState(data);
        });
    }


    render() {

        const name = this.props.name;
        const phone = this.props.phone;
        const website = this.props.website;
        const state = this.props.state;
        const fax = this.props.fax;
        const email = this.props.email;
        const nocivique = this.props.nocivique;
        const street = this.props.street;
        const city = this.props.city;
        const province = this.props.province;
        const postalcode = this.props.postalcode;
        const organisme = this.props.organisme;
        const organismes = this.state;

        return (
            <div className="auth-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">Créer Organisme Référent</h1>
                    <hr />
                    <br />
                    <br />

                    <ListErrors errors={this.props.errors} />

                    <div className="row">
                        <div className="col-md-8 offset-md-3 col-xs-12">
                            <form onSubmit={this.submitForm(name, email, nocivique, street, city, province, postalcode, phone, fax, website, state, organisme).bind(this)}>
                            <h3 className="text-xs-center">Information</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Nom"
                                            value={this.props.name}
                                            onChange={this.changeName} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Email"
                                            value={this.props.email}
                                            onChange={this.changeEmail} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Web site"
                                            value={this.props.website}
                                            onChange={this.changeWebsite} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Téléphone"
                                            value={this.props.phone}
                                            onChange={this.changePhone} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Fax"
                                            value={this.props.fax}
                                            onChange={this.changeFax} />
                                    </fieldset>
                                </fieldset>
                                <h3 className="text-xs-center">Adresse</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Numero civique"
                                            value={this.props.nocivique}
                                            onChange={this.changeNocivique} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Street"
                                            value={this.props.street}
                                            onChange={this.changeStreet} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="City"
                                            value={this.props.city}
                                            onChange={this.changeCity} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Province"
                                            value={this.props.province}
                                            onChange={this.changeProvince} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Code postal"
                                            value={this.props.postalcode}
                                            onChange={this.changePostalcode} />
                                    </fieldset>
                                </fieldset>
                                <h3 className="text-xs-center">Association</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <select
                                            className="form-control form-control-xl"
                                            value={this.props.organisme}
                                            selectedOptions={this.props.organisme}
                                            onChange={this.changeOrganisme}>
                                            <option key="">Associer à un Organisme</option>
                                            {(organismes != null) && Object.values(organismes).map((d) =>
                                                <option key={d.Email} value={d.Id}>
                                                    {d.Name}
                                                </option>
                                            )}
                                        </select>
                                    </fieldset>
                                </fieldset>
                                <h3 className="text-xs-center">Actif</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <select
                                            className="form-control form-control-xl"
                                            value={this.props.state}
                                            selectedOptions={this.props.state}
                                            onChange={this.changeState}>
                                            <option key="-1" value="-1">Activité de l'organisme-Référent</option>
                                            <option key="0" value="0">
                                                Actif
                                            </option>
                                            <option key="1" value="1">
                                                Inactif
                                            </option>
                                        </select>
                                    </fieldset>
                                </fieldset>
                                
                                <br/>
                                <div className="text-xs-center">
                                <button
                                    className="btn btn-lg btn-primary btn-block"
                                    type="submit"
                                    disabled={this.props.inProgress}>
                                    Créer Organisme Référent
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganismeReferent);
