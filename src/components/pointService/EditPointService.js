import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import { connect } from 'react-redux';
import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    UPDATE_POINT_SERVICE
} from '../../constants/actionTypes';

export class EditPointServiceForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.currentPointService.id,
            name: props.currentPointService.name,
            email: props.currentPointService.email,
            phone: props.currentPointService.phone,
            fax: props.currentPointService.fax,       
            nocivique: props.currentPointService.nocivique,
            street: props.currentPointService.street,
            city: props.currentPointService.city,
            province: props.currentPointService.province,
            postalcode: props.currentPointService.postalcode,
            currentPointService: props.currentPointService
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        };

        this.submitForm = ev => {
            ev.preventDefault();
            const currentPointService = Object.assign({}, this.state);
            this.props.onSubmitForm(currentPointService);
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentPointService) {
            this.setState(Object.assign({}, this.state, {
                name: nextProps.currentPointService.name,
                email: nextProps.currentPointService.email,
                phone: nextProps.currentPointService.phone,
                fax: nextProps.currentPointService.fax,
                nocivique: nextProps.currentPointService.nocivique,
                street: nextProps.currentPointService.street,
                city: nextProps.currentPointService.city,  
                province: nextProps.currentPointService.province,
                postalcode: nextProps.currentPointService.postalcode      
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
                            type="email"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={this.updateState('email')} />
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
                            type="phone"
                            placeholder="Fax"
                            value={this.state.fax}
                            onChange={this.updateState('fax')} />
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
    currentPointService: state.currentPointService
});

const mapDispatchToProps = dispatch => ({
    onSubmitForm: pointService =>
        dispatch({ type: UPDATE_POINT_SERVICE, payload: agent.PointService.save(pointService) }),
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class EditPointService extends React.Component {
    constructor() {
        super();
        this.state = {
            currentPointService: ''
        }
    }
    componentWillMount() {
        if (this.props.currentPointService) {
            Object.assign(this.state, {
                name: this.props.currentPointService.name,
                email: this.props.currentPointService.email,
                phone: this.props.currentPointService.phone,
                fax: this.props.currentPointService.fax,
                nocivique: this.props.currentPointService.nocivique,
                street: this.props.currentPointService.street,
                city: this.props.currentPointService.city,
                province: this.props.currentPointService.province,
                postalcode: this.props.currentPointService.postalcode          
            });
        } else {
            var url = "http://localhost:4000/pointservice/" + this.props.match.params.email;
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.pointService;
                this.setState({ 'currentPointService': data });
            });
        }
    }
    render() {
        const currentPointService = this.state.currentPointService;
        if (!currentPointService) {
            return null;
        }
        return (
            <div className="settings-page">
                <div className="container page">

                    <hr/>
                    <h1 className="text-xs-center">Paramètres Point de Service</h1>
                    <hr/>
                    <br />
                    <br />

                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">

                            <ListErrors errors={this.props.errors}></ListErrors>
                            <EditPointServiceForm
                                currentPointService={currentPointService}
                                onSubmitForm={this.props.onSubmitForm} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditPointService);
