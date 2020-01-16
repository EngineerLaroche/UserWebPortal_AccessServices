import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import { connect } from 'react-redux';
import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    UPDATE_ORGANISME_REFERENT
} from '../../constants/actionTypes';

export class EditOrganismeReferentForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.currentOrganismeReferent.id,
            name: props.currentOrganismeReferent.name,
            phone: props.currentOrganismeReferent.phone,
            website: props.currentOrganismeReferent.website,
            addressid: props.currentOrganismeReferent.address.id,
            nocivique: props.currentOrganismeReferent.address.nocivique,
            street: props.currentOrganismeReferent.address.street,
            city: props.currentOrganismeReferent.address.city,
            province: props.currentOrganismeReferent.address.province,
            postalcode: props.currentOrganismeReferent.address.postalcode,
            state: props.currentOrganismeReferent.state,
            fax: props.currentOrganismeReferent.fax,
            email: props.currentOrganismeReferent.email,
            currentOrganismeReferent: props.currentOrganismeReferent
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        };

        this.submitForm = ev => {
            ev.preventDefault();
            const currentOrganismeReferent = Object.assign({}, this.state);
            this.props.onSubmitForm(currentOrganismeReferent);
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentOrganismeReferent) {
            this.setState(Object.assign({}, this.state, {

                name: nextProps.currentOrganismeReferent.name,
                phone: nextProps.currentOrganismeReferent.phone,
                website: nextProps.currentOrganismeReferent.website,
                state: nextProps.currentOrganismeReferent.state,
                street: nextProps.currentOrganismeReferent.address.street,
                city: nextProps.currentOrganismeReferent.address.city,
                nocivique: nextProps.currentOrganismeReferent.address.nocivique,
                province: nextProps.currentOrganismeReferent.address.province,
                postalcode: nextProps.currentOrganismeReferent.address.postalcode,
                fax: nextProps.currentOrganismeReferent.fax,
                email: nextProps.currentOrganismeReferent.email
            }));
        }
    }

    render() {
        return (
            <form onSubmit={this.submitForm}>
                <fieldset>
                <h3 className="text-xs-center">Information</h3>
                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Nom"
                            value={this.state.name}
                            onChange={this.updateState('name')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Site web"
                            value={this.state.website}
                            onChange={this.updateState('website')} />
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
                            type="phone"
                            placeholder="Fax"
                            value={this.state.fax}
                            onChange={this.updateState('fax')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Numéro tel."
                            value={this.state.phone}
                            onChange={this.updateState('phone')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Numéro tel."
                            value={this.state.phone}
                            onChange={this.updateState('phone')} />
                    </fieldset>
                    <h3 className="text-xs-center">Adresse</h3>
                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Numéro civique"
                            value={this.state.nocivique}
                            onChange={this.updateState('nocivique')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Rue"
                            value={this.state.street}
                            onChange={this.updateState('street')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Ville"
                            value={this.state.city}
                            onChange={this.updateState('city')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Province"
                            value={this.state.province}
                            onChange={this.updateState('province')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Code postale"
                            value={this.state.postalcode}
                            onChange={this.updateState('postalcode')} />
                    </fieldset>
                    <h3 className="text-xs-center">Actif</h3>
                    <fieldset className="form-group">
                        <select
                            className="form-control form-control-xl"
                            value={this.state.state}
                            onChange={this.updateState('state')}>
                            <option key=" ">Activité de l'organisme-Référent</option>
                            <option value="0">
                                Actif
                            </option>
                            <option value="1">
                                Inactif
                            </option>
                        </select>
                    </fieldset>
                    <br/>
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
    currentOrganismeReferent: state.currentOrganismeReferent
});

const mapDispatchToProps = dispatch => ({
    onSubmitForm: organismeReferent =>
        dispatch({ type: UPDATE_ORGANISME_REFERENT, payload: agent.OrganismeReferent.save(organismeReferent) }),
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class EditOrganismeReferent extends React.Component {
    constructor() {
        super();
        this.state = {
            currentOrganismeReferent: ''
        }
    }
    componentWillMount() {
        if (this.props.currentOrganismeReferent) {
            Object.assign(this.state, {
                name: this.props.currentOrganismeReferent.name,
                phone: this.props.currentOrganismeReferent.phone,
                website: this.props.currentOrganismeReferent.website,
                state: this.props.currentOrganismeReferent.state,
                address: this.props.currentOrganismeReferent.address,
                fax: this.props.currentOrganismeReferent.fax,
                email: this.props.currentOrganismeReferent.email
            });
        } else {
            var url = "http://localhost:4000/organismereferent/" + this.props.match.params.email;
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.organismeReferent;
                this.setState({ 'currentOrganismeReferent': data });
            });
        }
    }
    render() {
        const currentOrganismeReferent = this.state.currentOrganismeReferent;
        if (!currentOrganismeReferent) {
            return null;
        }
        return (
            <div className="settings-page">
                <div className="container page">

                    <hr/>
                    <h1 className="text-xs-center">Paramètres Organisme-Référents</h1>
                    <hr/>
                    <br />
                    <br />

                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">

                            <ListErrors errors={this.props.errors}></ListErrors>
                            <EditOrganismeReferentForm
                                currentOrganismeReferent={currentOrganismeReferent}
                                onSubmitForm={this.props.onSubmitForm} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganismeReferent);
