import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    UPDATE_ORGANISME
} from '../../constants/actionTypes';

export class EditOrganismeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.currentOrganisme.id,
            name: props.currentOrganisme.name,
            phone: props.currentOrganisme.phone,
            addressId: props.addressId,
            nocivique: props.currentOrganisme.address.nocivique,
            street: props.currentOrganisme.address.street,
            city: props.currentOrganisme.address.city,
            province: props.currentOrganisme.address.province,
            postalcode: props.currentOrganisme.address.postalcode,
            fax: props.currentOrganisme.fax,
            email: props.currentOrganisme.email
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        };

        this.submitForm = ev => {
            ev.preventDefault();

            const currentOrganisme = Object.assign({}, this.state);
            this.props.onSubmitForm(currentOrganisme);
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentOrganisme) {
            this.setState(Object.assign({}, this.state, {
                id: nextProps.currentOrganisme.id,
                addressId: nextProps.addressId,
                name: nextProps.currentOrganisme.name,
                phone: nextProps.currentOrganisme.phone,
                street: nextProps.currentOrganisme.address.street,
                city: nextProps.currentOrganisme.address.city,
                nocivique: nextProps.currentOrganisme.address.nocivique,
                province: nextProps.currentOrganisme.address.province,
                postalcode: nextProps.currentOrganisme.address.postalcode,
                fax: nextProps.currentOrganisme.fax,
                email: nextProps.currentOrganisme.email
            }));
        }
    }

    render() {
        const intl = this.props.intl;
        return (
            <form onSubmit={this.submitForm}>
                <fieldset>
                    <h3 className="text-xs-center">
                        Informations
                    </h3>
                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.name}
                            value={this.state.name}
                            onChange={this.updateState('name')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="email"
                            placeholder={this.props.email}
                            value={this.state.email}
                            onChange={this.updateState('email')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="phone"
                            placeholder={this.props.fax}
                            value={this.state.fax}
                            onChange={this.updateState('fax')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.tel}
                            value={this.state.phone}
                            onChange={this.updateState('phone')} />
                    </fieldset>

                    <h3 className="text-xs-center">
                        <FormattedMessage
                            id="createorganisme.address"
                            defaultMessage="Adresse" />
                    </h3>
                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.numciv}
                            value={this.state.nocivique}
                            onChange={this.updateState('nocivique')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.street}
                            value={this.state.street}
                            onChange={this.updateState('street')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.city}
                            value={this.state.city}
                            onChange={this.updateState('city')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.province}
                            value={this.state.province}
                            onChange={this.updateState('province')} />
                    </fieldset>

                    <fieldset className="form-group">
                        <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder={this.props.postalcode}
                            value={this.state.postalcode}
                            onChange={this.updateState('postalcode')} />
                    </fieldset>
                    <h3 className="text-xs-center">
                        <FormattedMessage
                            id="editorganisme.active.text"
                            defaultMessage="Statut d'activité" />
                    </h3>
                    <fieldset className="form-group">
                        <select
                            className="form-control form-control-xl"
                            value={this.state.state}
                            onChange={this.updateState('state')}>
                            <option key=" ">{this.props.activetext}</option>
                            <option value="0">
                                {this.props.active}
                            </option>
                            <option value="1">
                                {this.props.inactive}
                            </option>
                        </select>
                    </fieldset>
                    <br />
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
    currentOrganisme: state.currentOrganisme
});

const mapDispatchToProps = dispatch => ({
    onSubmitForm: organisme =>
        dispatch({ type: UPDATE_ORGANISME, payload: agent.Organisme.save(organisme) }),
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

export class EditOrganisme extends React.Component {
    constructor() {
        super();
        this.state = {
            currentOrganisme: ''
        }
    }
    componentWillMount() {
        if (this.props.currentOrganisme) {
            Object.assign(this.state, {
                name: this.props.currentOrganisme.name,
                phone: this.props.currentOrganisme.phone,
                state: this.props.currentOrganisme.state,
                address: this.props.currentOrganisme.address,
                fax: this.props.currentOrganisme.fax,
                email: this.props.currentOrganisme.email
            });
        } else {
            var url = "http://localhost:4000/organisme/" + this.props.match.params.email;
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.organisme;
                this.setState({ 'currentOrganisme': data });
                this.setState({'addressId': data.address});
            });
        }
    }
    render() {
        const intl = this.props.intl;
        const currentOrganisme = this.state.currentOrganisme;
        const addressId = this.state.addressId;
        if (!currentOrganisme) {
            return null;
        }
        return (
            <div className="settings-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">
                        <FormattedMessage
                            id="organismedetails.title"
                            defaultMessage="Paramètres de l'organisme" />
                    </h1>
                    <hr />
                    <br />
                    <br />

                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">

                            <ListErrors errors={this.props.errors}></ListErrors>
                            <EditOrganismeForm
                                currentOrganisme={currentOrganisme}
                                name={intl.formatMessage({
                                    id: "createorganisme.name",
                                    defaultMessage: "Nom"
                                })}
                                email={intl.formatMessage({
                                    id: "createorganisme.email",
                                    defaultMessage: "Email"
                                })}
                                fax={intl.formatMessage({
                                    id: "createorganisme.fax",
                                    defaultMessage: "Numéro de fax"
                                })}
                                tel={intl.formatMessage({
                                    id: "createorganisme.tel",
                                    defaultMessage: "Numéro de téléphone"
                                })}
                                numciv={intl.formatMessage({
                                    id: "createorganisme.civnum",
                                    defaultMessage: "Numéro civique"
                                })}
                                street={intl.formatMessage({
                                    id: "createorganisme.street",
                                    defaultMessage: "Rue"
                                })}
                                city={intl.formatMessage({
                                    id: "createorganisme.city",
                                    defaultMessage: "Ville"
                                })}
                                province={intl.formatMessage({
                                    id: "createorganisme.province",
                                    defaultMessage: "Province"
                                })}
                                postalcode={intl.formatMessage({
                                    id: "createorganisme.postalcode",
                                    defaultMessage: "Code postal"
                                })}
                                activetext={intl.formatMessage({
                                    id: "editorganisme.active.text",
                                    defaultMessage: "Activité de l'organisme"
                                })}
                                active={intl.formatMessage({
                                    id: "editorganisme.active",
                                    defaultMessage: "Actif"
                                })}
                                inactive={intl.formatMessage({
                                    id: "editorganisme.inactive",
                                    defaultMessage: "Inactif"
                                })}
                            
                                addressId={addressId}
                                onSubmitForm={this.props.onSubmitForm} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


EditOrganisme.propTypes = {
    intl: intlShape.isRequired
};
EditOrganisme = injectIntl(EditOrganisme);

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganisme);
