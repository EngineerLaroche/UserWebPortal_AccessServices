import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import moment from "moment";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    UPDATE_SERVICE,
    ASSOCIATE_SERVICE
} from '../../constants/actionTypes';

export class EditServiceForm extends React.Component {
    constructor(props) {
        super(props);

        this.changeDate = this.changeDate.bind(this);
        this.state = {
            id: props.currentService.id,
            name: props.currentService.name,
            description: props.currentService.description,
            tarifParent: props.currentService.tarifParent,
            tarifCISSS: props.currentService.tarifCISSS,
            stateSubvention: props.currentService.stateSubvention,
            state: props.currentService.state,
            datePrice: props.currentService.datePrice,
            currentService: props.currentService,
            startDate: moment(),
            //selectedOptions: null
        };

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        };

        this.submitForm = ev => {
            ev.preventDefault();
            const currentService = Object.assign({}, this.state);
            this.props.onSubmitForm(currentService);
            // const service = Object.assign({
            //     id: this.state.id,
            //     name: this.state.name,
            //     description: this.state.description,
            //     tarifParent: this.state.tarifParent,
            //     tarifCISSS: this.state.tarifCISSS,
            //     stateSubvention: this.state.stateSubvention,
            //     state: this.state.state,
            //     datePrice: this.state.datePrice
            //   });
            //this.props.onAssociate(this.state.pointsServiceSelected, service.name);
            
        };
    }

    // handleChangePointsService = selectedOptions => {
    //     this.setState({ 'pointsServiceSelected': selectedOptions });
    //     console.log(`Option selected:`, selectedOptions);
    // };

    // componentWillMount() {
    //     if (this.props.currentService) {
    //         Object.assign(this.state, {
    //             id: this.props.currentService.id,
    //             name: this.props.currentService.name,
    //             description: this.props.currentService.description,
    //             tarifParent: this.props.currentService.tarifParent,
    //             tarifCISSS: this.props.currentService.tarifCISSS,
    //             stateSubvention: this.props.currentService.stateSubvention,
    //             state: this.props.currentService.state,
    //             datePrice: this.props.currentService.datePrice
    //         });
    //     }
    //     var url = "http://localhost:4000/pointsservice"
    //     Request.get(url).then((response) => {
    //         console.log(response.body);
    //         var data = response.body.rows;
    //         this.setState({ 'PointsService': data });
    //     });
    // }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentService) {
            this.setState(Object.assign({}, this.state, {
                name: nextProps.currentService.name,
                description: nextProps.currentService.description,
                tarifParent: nextProps.currentService.tarifParent,
                tarifCISSS: nextProps.currentService.tarifCISSS,
                stateSubvention: nextProps.currentService.stateSubvention,
                state: nextProps.currentService.state,
                datePrice: nextProps.currentService.datePrice
            }));
            // var currentPointsService = [];
            // for (var i = 0; i < nextProps.currentPointsService.length; i++) {
            //     currentPointsService.push({
            //         value: nextProps.currentPointsService[i].PointServiceId,
            //         label: nextProps.currentPointsService[i].PointServiceName
            //     });
            // }
            // this.setState({ 'pointsServiceSelected': currentPointsService });

            // var url = "http://localhost:4000/pointsservice"
            // Request.get(url).then((response) => {
            //     console.log(response.body);
            //     var data = response.body.rows;
            //     this.setState({ 'pointsService': data });
            // });
        }
    }

    changeDate(date) {
        var selectedDay = new Date(date);
        var newDate = (selectedDay.getDate() + '/' +
            (selectedDay.getMonth() + 1) + '/' +
            selectedDay.getFullYear());

        this.setState({
            startDate: date,
            datePrice: newDate
        });
    }

    render() {

        // const pointsService = [];
        // if (this.state != null && this.state.pointsService != null) {
        //     Object.values(this.state.pointsService).map((d) =>
        //         pointsService.push({ value: d.Id, label: d.Name })
        //     );
        // }

        return (
            <form onSubmit={this.submitForm}>
                <fieldset>
                    <h3 className="text-xs-center">Information</h3>
                    <fieldset>
                        <fieldset className="form-group">
                            <input
                                className="form-control form-control-lg"
                                type="text"
                                placeholder="Nom"
                                value={this.state.name}
                                onChange={this.updateState('name')} />
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <fieldset className="form-group">
                            <input
                                className="form-control form-control-lg"
                                type="text"
                                placeholder="Description"
                                value={this.state.description}
                                onChange={this.updateState('description')} />
                        </fieldset>
                    </fieldset>
                    <h3 className="text-xs-center">Tarifs ($)</h3>
                    <fieldset>
                        <fieldset className="form-group">
                            <input
                                className="form-control form-control-lg"
                                type="text"
                                placeholder="Tarif Parent"
                                value={this.state.tarifParent}
                                onChange={this.updateState('tarifParent')} />
                        </fieldset>
                    </fieldset>
                    <fieldset>
                        <fieldset className="form-group">
                            <input
                                className="form-control form-control-lg"
                                type="text"
                                placeholder="Tarif CISSS"
                                value={this.state.tarifCISSS}
                                onChange={this.updateState('tarifCISSS')} />
                        </fieldset>
                    </fieldset>
                    <br />
                    <fieldset className="form-group">
                        <h3 className="text-xs-center">Association</h3>
                        <Select
                            placeholder="Points Service"
                            className="form-control form-control-xl"
                            // value={this.state.pointsServiceSelected}
                            // selectedOptions={this.state.pointsServiceSelected}
                            // options={pointsService}
                            // isMulti={true}
                            // isSearchable={true}
                            // onChange={this.handleChangePointsService.bind(this)}
                            >
                    </Select>
                    </fieldset>
                    <br />
                    <h3 className="text-xs-center">Autorisation</h3>
                    <fieldset className="form-group">
                        <select
                            className="form-control form-control-xl"
                            value={this.state.stateSubvention}
                            onChange={this.updateState('stateSubvention')}>
                            <option key=" ">Subvention Service</option>
                            <option value="0">
                                Subventionné
                            </option>
                            <option value="1">
                                Non-Subventionné
                            </option>
                        </select>
                    </fieldset>
                    <br />
                    <fieldset className="form-group">
                        <select
                            className="form-control form-control-xl"
                            value={this.state.state}
                            onChange={this.updateState('state')}>
                            <option key=" ">Activité du Service</option>
                            <option value="0">
                                Actif
                            </option>
                            <option value="1">
                                Inactif
                            </option>
                        </select>
                    </fieldset>
                    <br />
                    <h3 className="text-xs-center">Date Autorisation Prix</h3>
                    <br />
                    <h5 className="text-xs-center">Début du tarif: {this.state.datePrice}</h5>
                    <div className="text-xs-center">
                        <fieldset>
                            <fieldset className="form-group">
                                <DatePicker
                                    inline
                                    selected={this.state.startDate}
                                    onSelect={this.handleSelect}
                                    onChange={this.changeDate}
                                    value={this.state.datePrice}
                                />
                            </fieldset>
                        </fieldset>
                    </div>
                    <br />
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
    currentService: state.currentService
    //,
    //pointsServiceSelected: [],
});

const mapDispatchToProps = dispatch => ({
    onSubmitForm: service =>
        dispatch({ type: UPDATE_SERVICE, payload: agent.Service.save(service) }),
    onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })

    //,
    // onAssociate: (pointsServiceSelected, name) => {
    //     if (pointsServiceSelected.length > 0) {
    //         pointsServiceSelected.forEach(function (element) {
    //             const payload = agent.Service.associate(element.value, name);
    //             dispatch({ type: ASSOCIATE_SERVICE, payload })
    //         });
    //     } else {
    //         const payload = agent.Service.associate(0, name);
    //         dispatch({ type: ASSOCIATE_SERVICE, payload })
    //     }
    //}
});

class EditService extends React.Component {
    constructor() {
        super();
        this.state = {
            currentService: ''
            //,
            //pointsService: []
        }
    }
    componentWillMount() {
        if (this.props.currentService) {
            Object.assign(this.state, {
                name: this.props.currentService.name,
                description: this.props.currentService.description,
                tarifParent: this.props.currentService.tarifParent,
                tarifCISSS: this.props.currentService.tarifCISSS,
                stateSubvention: this.props.currentService.stateSubvention,
                state: this.props.currentService.state,
                datePrice: this.props.currentService.datePrice
            });
        } else {
            // var associationUrl = "http://localhost:4000/service/associations/" + this.props.match.params.name;
            // Request.get(associationUrl).then((response) => {
            //     console.log(response.body);
            //     var data = response.body;
            //     this.setState({ 'pointsService': data.pointsService });
            // });
            var url = "http://localhost:4000/service/" + this.props.match.params.name;
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.service;
                this.setState({ 'currentService': data });
            });
        }
    }
    render() {
        const currentService = this.state.currentService;
        if (!currentService) {
            return null;
        }
        return (
            <div className="settings-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">Paramètres Service</h1>
                    <hr />
                    <br />
                    <br />

                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">

                            <ListErrors errors={this.props.errors}></ListErrors>
                            <EditServiceForm
                                currentService={currentService}
                                onSubmitForm={this.props.onSubmitForm} 
                                //currentPointsService={this.state.pointsService}
                                //onAssociate={this.props.onAssociate}
                                />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditService);
