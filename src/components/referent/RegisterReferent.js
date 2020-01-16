import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import Select from 'react-select';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

import {
    UPDATE_FIELD_AUTH,
    REGISTER_REFERENT,
    REGISTER_PAGE_UNLOADED,
    ASSOCIATE_REFERENT,
    ASSOCIATE_REFERENT_PREFERENCE
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state.auth,
    organismesReferent: [],
    organismesSelected: [],
    preferencesSelected: []
});

const mapDispatchToProps = dispatch => ({
    onChangeFirstname: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'firstname', value}),
    onChangeLastname: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'lastname', value}),
    onChangeTitle: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'title', value}),
    onChangeWorkPhone: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'workPhone', value}),
    onChangeCellPhone: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'cellPhone', value}),
    onChangeFax: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'fax', value}),
    onChangeEmail: value =>
        dispatch({type: UPDATE_FIELD_AUTH, key: 'email', value}),
    onSubmit: (firstname, lastname, title, workPhone, cellPhone, fax, email, preferences) => {
        const payload = agent.Referent.register(firstname, lastname, title, workPhone, cellPhone, fax, email, preferences);
        dispatch({type: REGISTER_REFERENT, payload})
    },
    onAssociate: (organismesSelected, email) => {
        organismesSelected.forEach(function (element) {
            const payload = agent.Referent.associate(element.value, email);
            dispatch({type: ASSOCIATE_REFERENT, payload})
        });
    },
    onPreference: (preferencesSelected, email) => {
        preferencesSelected.forEach(function (element) {
            const payload = agent.Referent.preference(element.value, email);
            dispatch({type: ASSOCIATE_REFERENT_PREFERENCE, payload})
        });
    },
    onUnload: () =>
        dispatch({type: REGISTER_PAGE_UNLOADED})
});

export class RegisterReferent extends React.Component {
    constructor() {
        super();
        this.changeFirstname = ev => this.props.onChangeFirstname(ev.target.value);
        this.changeLastname = ev => this.props.onChangeLastname(ev.target.value);
        this.changeTitle = ev => this.props.onChangeTitle(ev.target.value);
        this.changeWorkPhone = ev => this.props.onChangeWorkPhone(ev.target.value);
        this.changeCellPhone = ev => this.props.onChangeCellPhone(ev.target.value);
        this.changeFax = ev => this.props.onChangeFax(ev.target.value);
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.submitForm = (firstname, lastname, title, workPhone, cellPhone, fax, email) => ev => {
            ev.preventDefault();

            this.props.onSubmit(firstname, lastname, title, workPhone, cellPhone, fax, email);
            this.props.onAssociate(this.state.organismesSelected, email);
            this.props.onPreference(this.state.preferencesSelected, email);
        }
        this.state = {
            selectedOptions: null,
            selectedPrefs: null,
            search: '',
            referents: []
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    componentWillMount() {
        var url = "http://localhost:4000/organismereferents"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState({'organismesReferent': data});
        });
    }

    searchReferents(query) {
        var url = "http://localhost:4000/referent/search/" + query;
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.returnedReferents;
            this.setState({'referents': data});
        });
    }

    handleChange(value, param) {
        this.setState({[param]: value});
    }

    handleChangeOrganismes(selectedOptions) {
        this.setState({'organismesSelected': selectedOptions});
        console.log(`Option selected:`, selectedOptions);
    }

    handleChangePreferences(selectedOptions) {
        this.setState({'preferencesSelected': selectedOptions});
        console.log(`Preference selected:`, selectedOptions);
    }

    render() {
        const search = this.state.search;
        const referents = this.state.referents;
        const firstname = this.props.firstname;
        const lastname = this.props.lastname;
        const title = this.props.title;
        const workPhone = this.props.workPhone;
        const cellPhone = this.props.cellPhone;
        const fax = this.props.fax;
        const email = this.props.email;
        const preferencesArray = [{value: '1', label: 'Fax'}, {value: '2', label: 'Courriel'}, {
            value: '3',
            label: 'Papier'
        }];
        const organismesReferent = [];
        if (this.state != null && this.state.organismesReferent != null) {
            Object.values(this.state.organismesReferent).map((d) =>
                organismesReferent.push({value: d.Id, label: d.Name})
            );
        }

        return (
            <div className="auth-page">
                <div className="container page">

                    <hr/>
                    <h1 className="text-xs-center">Créer Référent</h1>
                    <hr/>
                    <br/>

                    <ListErrors errors={this.props.errors}/>
                    <br/>
                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">
                            <div className="text-xs-center">
                                <h4>Recherchez référent existant: </h4>
                                <br/>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            type="text"
                                            value={this.search}
                                            onChange={(e) => {
                                                this.handleChange(e.target.value, 'search')
                                            }}/>
                                        <button onClick={() => {
                                            this.searchReferents(search)
                                        }}>Go
                                        </button>
                                    </fieldset>
                                </fieldset>
                                {(referents != null) && Object.values(referents).map((d) =>
                                    <li key={d.Email}>
                                        <Link to={"/referent/" + d.Email} className="nav-link">
                                            {d.Firstname} {d.Lastname}
                                        </Link>
                                    </li>
                                )}
                                <div>
                                    {(referents == null || referents.length == 0) &&
                                    <li>
                                        <label> Aucun référent trouvé</label>
                                    </li>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <br/>

                    <ListErrors errors={this.props.errors}/>

                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">

                            <form
                                onSubmit={this.submitForm(firstname, lastname, title, workPhone, cellPhone, fax, email).bind(this)}>
                                <br/>
                                <h3 className="text-xs-center">Information</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Prénom"
                                            value={this.props.firstname}
                                            onChange={this.changeFirstname}/>
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Nom de famille"
                                            value={this.props.lastname}
                                            onChange={this.changeLastname}/>
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Titre"
                                            value={this.props.Title}
                                            onChange={this.changeTitle}/>
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Email"
                                            value={this.props.email}
                                            onChange={this.changeEmail}/>
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Tel. de bureau"
                                            value={this.props.workPhone}
                                            onChange={this.changeWorkPhone}/>
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Tel. cellulaire"
                                            value={this.props.cellPhone}
                                            onChange={this.changeCellPhone}/>
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Fax"
                                            value={this.props.fax}
                                            onChange={this.changeFax}/>
                                    </fieldset>
                                </fieldset>
                                <br/>
                                <fieldset className="form-group">
                                    <h3 className="text-xs-center">Association</h3>
                                    <Select
                                        placeholder="Organismes référent"
                                        className="form-control form-control-xl"
                                        value={this.props.organismeReferent}
                                        options={organismesReferent}
                                        isMulti={true}
                                        isSearchable={true}
                                        onChange={this.handleChangeOrganismes.bind(this)}>
                                        )}
                                    </Select>
                                </fieldset>
                                <br/>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <h3 className="text-xs-center">Préférence Communication</h3>
                                        <Select
                                            placeholder="Preferences"
                                            className="form-control form-control-xl"
                                            value={this.props.preferences}
                                            options={preferencesArray}
                                            isMulti={true}
                                            isSearchable={true}
                                            onChange={this.handleChangePreferences.bind(this)}>
                                            )}
                                        </Select>
                                    </fieldset>
                                </fieldset>
                                <br/>
                                <div className="text-xs-center">
                                    <button
                                        className="btn btn-lg btn-primary btn-block"
                                        type="submit"
                                        disabled={this.props.inProgress}>
                                        Créer Référent
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterReferent);
