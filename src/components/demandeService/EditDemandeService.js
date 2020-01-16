import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import Request from 'superagent';
import { connect } from 'react-redux';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';

import "react-datepicker/dist/react-datepicker.css";
import {
    SETTINGS_PAGE_UNLOADED,
    UPDATE_DEMANDE_SERVICE
} from '../../constants/actionTypes';

var moment = require('moment');

const mapStateToProps = state => ({
    ...state.settings,
    currentDemandeService: state.currentDemandeService
});

const mapDispatchToProps = dispatch => ({
    onSubmit: (id, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirstParent, dispoSecondParent) => {
        const payload = agent.DemandeService.save(id, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirstParent, dispoSecondParent);
        dispatch({ type: UPDATE_DEMANDE_SERVICE, payload })
    },
    onUnload: () =>
        dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

export class EditDemandeService extends React.Component {
    constructor() {
        super();
        var today = new Date("December 17, 1995 04:20:00");
        var time = today.getHours() + ":" + today.getMinutes();
        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, { [field]: ev.target.value });
            this.setState(newState);
        };
        this.submitForm = (id, date, frequence, assumeFrais, motifs, transportName, transportPhone, parent, secondParent, enfants, dispoFirst, dispoSecond) => ev => {
            ev.preventDefault();
            var transport = {
                name: transportName,
                phone: transportPhone
            }
            this.props.onSubmit(id, date, frequence, assumeFrais, motifs, transport, parent, secondParent, enfants, dispoFirst, dispoSecond);
        }
        this.state = {
            Id: '',
            Date: '',
            Frequence: '',
            AssumeFrais: '',
            ServiceType: '',
            Enfants: [],
            Transport: {},
            transportName: '',
            transportPhone: '',
            FirstParent: {},
            FirstParentAddress: {},
            firstParentAddressId: '',
            firstParentId: '',
            firstParentNoCivique:  '',
            firstParentCity:  '',
            firstParentStreet:  '',
            firstParentPostalCode:  '',
            firstParentProvince:  '',
            FirstParentDispos: [],
            SecondParentDispos: [],
            SecondParent: {},
            SecondParentAddress: {},
            newDispoTimeFromFirstParent: time,
            newDispoTimeFromSecondParent: time,
            newDispoTimeToFirstParent: time,
            newDispoTimeToSecondParent: time,
            newDispoDateFirstParent: moment(),
            newDispoDateSecondParent: moment(),
            motifsSelected: [],
            newEnfant: {
                firstname: '',
                lastname: '',
                noRAMQ: '',
                allergies: '',
                birthdate: ''
            }
        }
    }
    componentWillMount() {
        var today = new Date("December 17, 1995 04:20:00");
        var time = today.getHours() + ":" + today.getMinutes();
        if (this.props.currentDemandeService) {
            this.setState(Object.assign({}, this.state, {
                Id: this.props.currentDemandeService.Id,
                Date: this.props.currentDemandeService.Date,
                Frequence: this.props.currentDemandeService.Frequence,
                ServiceType: this.props.currentDemandeService.ServiceType,
                AssumeFrais: this.props.currentDemandeService.AssumeFrais,
                Transport: this.props.currentDemandeService.Transport,
                transportName: this.props.currentDemandeService.Transport.Name,
                transportPhone: this.props.currentDemandeService.Transport.Phone,
                FirstParent: this.props.currentDemandeService.FirstParent,
                FirstParentAddress: this.props.currentDemandeService.FirstParentAddress,
                firstParentId: this.props.currentDemandeService.FirstParent.Id,
                firstParentAddressId: this.props.currentDemandeService.FirstParentAddress.Id,
                firstParentNoCivique:  this.props.currentDemandeService.FirstParentAddress.NoCivique,
                firstParentCity:  this.props.currentDemandeService.FirstParentAddress.City,
                firstParentStreet:  this.props.currentDemandeService.FirstParentAddress.Street,
                firstParentPostalCode:  this.props.currentDemandeService.FirstParentAddress.PostalCode,
                firstParentProvince:  this.props.currentDemandeService.FirstParentAddress.Province,
                FirstParentDispos: this.props.currentDemandeService.FirstParentDispos,
                SecondParent: this.props.currentDemandeService.SecondParent,
                SecondParentAddress: this.props.currentDemandeService.SecondParentAddress,
                SecondParentDispos: this.props.currentDemandeService.SecondParentDispos,
                Enfants: this.props.currentDemandeService.Enfants,
                Famille: this.props.currentDemandeService.Enfants[0].Famille,
                Garde: this.props.currentDemandeService.Enfants[0].Garde,
                newEnfantfirstname: '',
                newEnfantlastname: '',
                newEnfantRAMQ: '',
                newEnfantAllergies: '',
                newEnfantBirthdate: '',
                newDispoTimeFromFirstParent: time,
                newDispoTimeFromSecondParent: time,
                newDispoTimeToFirstParent: time,
                newDispoTimeToSecondParent: time,
                newDispoDateFirstParent: moment(),
                newDispoDateSecondParent: moment()
            }));
        } else {
            var url = "http://localhost:4000/demandeservice/" + this.props.match.params.id;
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body;
                this.setState(Object.assign({}, this.state, {
                    Id: data.DemandeDeService.Id,
                    Date: data.DemandeDeService.Date,
                    Frequence: data.DemandeDeService.Frequence,
                    ServiceType: data.DemandeDeService.ServiceType,
                    AssumeFrais: data.DemandeDeService.AssumeFrais,
                    Transport: data.DemandeDeService.Transport,
                    transportName: data.DemandeDeService.Transport.Name,
                    transportPhone: data.DemandeDeService.Transport.Phone,
                    FirstParent: data.DemandeDeService.FirstParent,
                    firstParentId: data.DemandeDeService.FirstParent.Id,
                    firstParentAddressId: data.DemandeDeService.FirstParentAddress.Id,
                    firstParentFirstname: data.DemandeDeService.FirstParent.Firstname,
                    firstParentLastname: data.DemandeDeService.FirstParent.Lastname,
                    firstParentBirthdate: data.DemandeDeService.FirstParent.BirthDate,
                    firstParentEmail: data.DemandeDeService.FirstParent.Email,
                    firstParentPhone: data.DemandeDeService.FirstParent.Phone,
                    firstParentNoPermisConduire: data.DemandeDeService.FirstParent.NoPermisConduire,
                    firstParentNoRAMQ: data.DemandeDeService.FirstParent.NoRAMQ,
                    firstParentNote: data.DemandeDeService.FirstParent.Note,
                    firstParentContact: data.DemandeDeService.FirstParent.ContactUrgence,
                    firstParentType: data.DemandeDeService.FirstParent.Type,
                    FirstParentDispos: data.DemandeDeService.FirstParentDispos,
                    FirstParentAddress: data.DemandeDeService.FirstParentAddress,
                    firstParentNoCivique: data.DemandeDeService.FirstParentAddress.NoCivique,
                    firstParentCity: data.DemandeDeService.FirstParentAddress.City,
                    firstParentStreet: data.DemandeDeService.FirstParentAddress.Street,
                    firstParentPostalCode: data.DemandeDeService.FirstParentAddress.PostalCode,
                    firstParentProvince: data.DemandeDeService.FirstParentAddress.Province,
                    firstParentAvocats: data.DemandeDeService.FirstParentAvocats,
                    SecondParent: data.DemandeDeService.SecondParent,
                    secondParentId: data.DemandeDeService.SecondParent.Id,
                    secondParentAddressId: data.DemandeDeService.SecondParentAddress.Id,
                    secondParentFirstname: data.DemandeDeService.SecondParent.Firstname,
                    secondParentLastname: data.DemandeDeService.SecondParent.Lastname,
                    secondParentBirthdate: data.DemandeDeService.SecondParent.BirthDate,
                    secondParentEmail: data.DemandeDeService.SecondParent.Email,
                    secondParentPhone: data.DemandeDeService.SecondParent.Phone,
                    secondParentNoPermisConduire: data.DemandeDeService.SecondParent.NoPermisConduire,
                    secondParentNoRAMQ: data.DemandeDeService.SecondParent.NoRAMQ,
                    secondParentNote: data.DemandeDeService.SecondParent.Note,
                    secondParentContact: data.DemandeDeService.SecondParent.ContactUrgence,
                    secondParentType: data.DemandeDeService.SecondParent.Type,
                    SecondParentDispos: data.DemandeDeService.SecondParentDispos,
                    SecondParentAddress: data.DemandeDeService.SecondParentAddress,
                    secondParentNoCivique: data.DemandeDeService.SecondParentAddress.NoCivique,
                    secondParentCity: data.DemandeDeService.SecondParentAddress.City,
                    secondParentStreet: data.DemandeDeService.SecondParentAddress.Street,
                    secondParentPostalCode: data.DemandeDeService.SecondParentAddress.PostalCode,
                    secondParentProvince: data.DemandeDeService.SecondParentAddress.Province,
                    secondParentAvocats: data.DemandeDeService.SecondParentAvocats,
                    Enfants: data.DemandeDeService.Enfants,
                    Famille: data.DemandeDeService.Enfants[0].Famille,
                    Garde: data.DemandeDeService.Enfants[0].Garde,
                    newDispoTimeFromFirstParent: time,
                    newDispoTimeFromSecondParent: time,
                    newDispoTimeToFirstParent: time,
                    newDispoTimeToSecondParent: time,
                    newDispoDateFirstParent: moment(),
                    newDispoDateSecondParent: moment()
                }));
                var currentMotifs = [];
                for (var i = 0; i < response.body.DemandeDeService.Motifs.length; i++) {
                    currentMotifs.push({
                        value: response.body.DemandeDeService.Motifs[i].Id,
                        label: response.body.DemandeDeService.Motifs[i].Type
                    });
                }
                this.setState({ 'motifsSelected': currentMotifs });

                var currentAvocatsFirstParent = [];
                for (var j = 0; j < response.body.DemandeDeService.FirstParentAvocats.length; j++) {
                    currentAvocatsFirstParent.push({
                        value: response.body.DemandeDeService.FirstParentAvocats[j].Id,
                        label: response.body.DemandeDeService.FirstParentAvocats[j].Firstname + " " + response.body.DemandeDeService.FirstParentAvocats[j].Lastname
                    });
                }
                var currentAvocatsSecondParent = [];
                for (var k = 0; k < response.body.DemandeDeService.SecondParentAvocats.length; k++) {
                    currentAvocatsSecondParent.push({
                        value: response.body.DemandeDeService.SecondParentAvocats[k].Id,
                        label: response.body.DemandeDeService.SecondParentAvocats[k].Firstname + " " + response.body.DemandeDeService.SecondParentAvocats[k].Lastname
                    });
                }
            });
            var url = "http://localhost:4000/avocats"
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.Avocats;
                this.setState({ 'avocats': data });
            });
            var url = "http://localhost:4000/motifs"
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.Motifs;
                this.setState({ 'motifsArray': data });
            });
            var url = "http://localhost:4000/parents/address"
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.Addresses;
                this.setState({ 'addresses': data });
            });
            var url = "http://localhost:4000/parents/types"
            Request.get(url).then((response) => {
                console.log(response.body);
                var data = response.body.Types;
                this.setState({ 'parentTypesArray': data });
            });
        }
    }

    addEnfant(newEnfant) {
        console.log(newEnfant);
        if (typeof newEnfant.lastname != 'undefined' && typeof newEnfant.firstname != 'undefined' && typeof newEnfant.noRAMQ != 'undefined' && typeof newEnfant.birthdate != 'undefined' && typeof newEnfant.allergies != 'undefined') {
            this.setState({
                'Enfants': this.state.Enfants.concat([{ NoRAMQ: newEnfant.noRAMQ, BirthDate: newEnfant.birthdate, Allergies: newEnfant.allergies, Firstname: newEnfant.firstname, Lastname: newEnfant.lastname, Famille: this.state.Famille, Garde: this.state.Garde }])
            })
            this.setState({
                'newEnfantFirstname': ''
            })
            this.setState({
                'newEnfantLastname': ''
            })
            this.setState({
                'newEnfantBirthdate': ''
            })
            this.setState({
                'newEnfantNoRAMQ': ''
            })
            this.setState({
                'newEnfantAllergies': ''
            })
        }
    }

    removeEnfant(key) {
        this.state.Enfants.splice(key, 1);
        var newArray = this.state.Enfants;
        this.setState({
            Enfants: newArray
        })
    }

    addDispoFirstParent(date) {
        if (typeof date != 'undefined' && typeof date.from != 'undefined' && typeof date.to != 'undefined') {
            this.setState({
                FirstParentDispos: this.state.FirstParentDispos.concat([{ Date: date.date.toDate(), From: date.from, To: date.to }])
            })
        }
    }

    addDispoSecondParent(date) {
        if (typeof date != 'undefined' && typeof date.from != 'undefined' && typeof date.to != 'undefined') {
            this.setState({
                SecondParentDispos: this.state.SecondParentDispos.concat([{ Date: date.date.toDate(), From: date.from, To: date.to }])
            })
        }
    }

    handleChangeMotifs(selectedOptions) {
        this.setState({ 'motifsSelected': selectedOptions });
        console.log(`Motif selected:`, selectedOptions);
    }

    handleChangeAddressSelected(ev) {
        this.setState({ 'searchFirstParentAddress': ev.value });
        this.setState({ 'firstParentNoCivique': ev.value.NoCivique });
        this.setState({ 'firstParentCity': ev.value.City });
        this.setState({ 'firstParentStreet': ev.value.Street });
        this.setState({ 'firstParentPostalCode': ev.value.PostalCode });
        this.setState({ 'firstParentProvince': ev.value.Province });
    }

    handleChangeSecondAddressSelected(ev) {
        this.setState({ 'searchSecondParentAddress': ev.value });
        this.setState({ 'secondParentNoCivique': ev.value.NoCivique });
        this.setState({ 'secondParentCity': ev.value.City });
        this.setState({ 'secondParentStreet': ev.value.Street });
        this.setState({ 'secondParentPostalCode': ev.value.PostalCode });
        this.setState({ 'secondParentProvince': ev.value.Province });
    }

    handleChangeNewDispoDateFirstParent(date) {
        this.setState({
            "newDispoDateFirstParent": date
        });
    }

    handleChangeNewDispoDateSecondParent(date) {
        this.setState({
            "newDispoDateSecondParent": date
        });
    }

    handleChangeNewDispoTimeFromFirstParent(time) {
        this.setState({
            "newDispoTimeFromFirstParent": time
        });
    }

    handleChangeNewDispoTimeToFirstParent(time) {
        this.setState({
            "newDispoTimeToFirstParent": time
        });
    }

    handleChangeNewDispoTimeFromSecondParent(time) {
        this.setState({
            "newDispoTimeFromSecondParent": time
        });
    }

    handleChangeNewDispoTimeToSecondParent(time) {
        this.setState({
            "newDispoTimeToSecondParent": time
        });
    }

    handleChangeFirstParentType(type){
        this.setState({
            "firstParentType": type.value
        })
    }
    handleChangeSecondParentType(type){
        this.setState({
            "secondParentType": type.value
        })
    }


    render() {
        var currentDemandeService = this.state;
        if (!currentDemandeService) {
            return null;
        }
        const id = currentDemandeService.Id;

        //const parentTypeArray = [{ value: '1', label: 'Tuteur' }, { value: '2', label: 'Famille accueil' }, { value: '3', label: 'Parent gardien' }, { value: '4', label: 'Parent visiteur' }];

        var avocats = [];
        var enfantsAjouter = [];
        var disposFirstParent = [];
        var disposSecondParent = [];

        var currentMotifs = [];
        if (this.state.motifsSelected != null) {
            for (var i = 0; i < this.state.motifsSelected.length; i++) {
                if (typeof this.state.motifsSelected[i].label == 'undefined') {
                    currentMotifs.push({
                        value: this.state.motifsSelected[i].Id,
                        label: this.state.motifsSelected[i].Type
                    });
                } else {
                    currentMotifs.push(this.state.motifsSelected[i]);
                }
            }
        }

        if (this.state != null && this.state.Enfants != null) {
            Object.values(this.state.Enfants).map((d) =>
                enfantsAjouter.push({ value: d.NoRAMQ, label: d.Firstname + " " + d.Lastname })
            );
        }

        if (this.state != null && this.state.FirstParentDispos != null) {
            Object.values(this.state.FirstParentDispos).map((d) =>
                disposFirstParent.push({ value: d.Date, label: d.Date.toString() + ", from: " + d.From + " to: " + d.To })
            );
        }

        if (this.state != null && this.state.SecondParentDispos != null) {
            Object.values(this.state.SecondParentDispos).map((d) =>
                disposSecondParent.push({ value: d.Date, label: d.Date.toString() + ", from: " + d.From + " to: " + d.To })
            );
        }

        var currentAvocatsFirstParent = [];
        if (this.state.firstParentAvocats != null) {
            for (var i = 0; i < this.state.firstParentAvocats.length; i++) {
                if (typeof this.state.firstParentAvocats[i].label == 'undefined') {
                    currentAvocatsFirstParent.push({
                        value: this.state.firstParentAvocats[i].Id,
                        label: this.state.firstParentAvocats[i].Firstname + " " + this.state.firstParentAvocats[i].Lastname
                    });
                } else {
                    currentAvocatsFirstParent.push(this.state.firstParentAvocats[i]);
                }
            }
        }

        var currentAvocatsSecondParent = [];
        if (this.state.secondParentAvocats != null) {
            for (var i = 0; i < this.state.secondParentAvocats.length; i++) {
                if (typeof this.state.secondParentAvocats[i].label == 'undefined') {
                    currentAvocatsSecondParent.push({
                        value: this.state.secondParentAvocats[i].Id,
                        label: this.state.secondParentAvocats[i].Firstname + " " + this.state.secondParentAvocats[i].Lastname
                    });
                } else {
                    currentAvocatsSecondParent.push(this.state.secondParentAvocats[i]);
                }
            }
        }

        var serviceType = this.state.ServiceType;

        var serviceTypeText = '';
        switch (serviceType) {
            case 1:
                serviceTypeText = 'Visite supervisée';
                break;
            case 2:
                serviceTypeText = 'Conversation téléphonique supervisée';
                break;
            case 3:
                serviceTypeText = 'Échange de garde supervisée';
                break;
        }

        var motifsArray = [];
        if (this.state != null && this.state.motifsArray != null) {
            Object.values(this.state.motifsArray).map((d) =>
                motifsArray.push({ value: d.Id, label: d.Type })
            );
        }
        var firstParentSelectedType = "";
        var secondParentSelectedType = "";
        var parentTypeArray = [];
        if (this.state != null && this.state.parentTypesArray != null) {
            Object.values(this.state.parentTypesArray).map((p) =>
                parentTypeArray.push({ value: p.Id, label: p.Type })
            );
            firstParentSelectedType = parentTypeArray[this.state.firstParentType-1];
            secondParentSelectedType = parentTypeArray[this.state.secondParentType-1];
        }

        if (this.state != null && this.state.avocats != null) {
            Object.values(this.state.avocats).map((a) =>
                avocats.push({ value: a.Id, label: a.Firstname + " " + a.Lastname })
            );
        }
        var addresses = [];
        if (this.state != null && this.state.addresses != null) {
            Object.values(this.state.addresses).map((a) =>
                addresses.push({ value: a, label: a.PostalCode })
            );
        }
        var secondParent = {
            id: this.state.secondParentId,
            type: this.state.secondParentType,
            firstname: this.state.secondParentFirstname,
            lastname: this.state.secondParentLastname,
            birthdate: this.state.secondParentBirthdate,
            email: this.state.secondParentEmail,
            phone: this.state.secondParentPhone,
            noRAMQ: this.state.secondParentNoRAMQ,
            noPermisConduire: this.state.secondParentNoPermisConduire,
            contact: this.state.secondParentContact,
            address: {
                id: this.state.secondParentAddressId,
                nocivique: this.state.secondParentNoCivique,
                street: this.state.secondParentStreet,
                city: this.state.secondParentCity,
                province: this.state.secondParentProvince,
                postalcode: this.state.secondParentPostalCode
            }
        }
        var firstParent = {
            id: this.state.firstParentId,
            type: this.state.firstParentType,
            firstname: this.state.firstParentFirstname,
            lastname: this.state.firstParentLastname,
            birthdate: this.state.firstParentBirthdate,
            email: this.state.firstParentEmail,
            phone: this.state.firstParentPhone,
            noRAMQ: this.state.firstParentNoRAMQ,
            noPermisConduire: this.state.firstParentNoPermisConduire,
            contact: this.state.firstParentContact,
            address: {
                id: this.state.firstParentAddressId,
                nocivique: this.state.firstParentNoCivique,
                street: this.state.firstParentStreet,
                city: this.state.firstParentCity,
                province: this.state.firstParentProvince,
                postalcode: this.state.firstParentPostalCode
            }
        }
        return (
            <div className="settings-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">Edit Demande de service</h1>
                    <hr />
                    <br />
                    <br />

                    <div className="row">
                        <div className="col-md-8 offset-md-3 col-xs-12">

                            <ListErrors errors={this.props.errors}></ListErrors>
                            <ListErrors errors={this.props.errors} />

                            <div className="col-md-12 offset-md-1 col-xs-12">
                                <form className="form-group" onSubmit={this.submitForm(this.state.Id, this.state.Date, this.state.Frequence, this.state.AssumeFrais, currentMotifs, this.state.transportName, this.state.transportPhone, firstParent, secondParent, this.state.Enfants, this.state.FirstParentDispos, this.state.SecondParentDispos).bind(this)}>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h3 className="text-xs-center">Type de service demandé: {serviceTypeText}</h3>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <fieldset className="form-group col-md-4">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                placeholder="Date"
                                                value={this.state.Date}
                                                onChange={this.updateState('Date')} />
                                        </fieldset>
                                        <fieldset className="form-group col-md-4">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                placeholder="Frequence"
                                                value={this.state.Frequence}
                                                onChange={this.updateState('Frequence')} />
                                        </fieldset>
                                        <fieldset className="form-group col-md-4">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                placeholder="Qui assume les frais?"
                                                value={this.state.AssumeFrais}
                                                onChange={this.updateState('AssumeFrais')} />
                                        </fieldset>
                                    </div>
                                    <br />
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h3 className="text-xs-center">Motif(s) de la demande</h3>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <Select
                                            placeholder="Motifs"
                                            className="form-control form-control-xl"
                                            value={currentMotifs}
                                            options={motifsArray}
                                            selectedOptions={currentMotifs}
                                            isMulti={true}
                                            isSearchable={true}
                                            onChange={this.handleChangeMotifs.bind(this)}>
                                            )}
                                </Select>
                                    </div>
                                    <br />
                                    <div class="row">
                                        <div class="col-md-4 form-group">
                                            <h3 className="text-xs-center">Enfants</h3>
                                            <ul className="list-group text-center">
                                                {(enfantsAjouter != null) &&
                                                    Object.keys(enfantsAjouter).map(function (key) {
                                                        return <li className="list-group-item list-group-item-info"><div className="row">{enfantsAjouter[key].label}<button type="button" onClick={() => { this.removeEnfant(key) }}>X</button></div></li>
                                                    }.bind(this))
                                                }
                                            </ul>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Prenom"
                                                    value={this.state.newEnfantFirstname}
                                                    onChange={this.updateState('newEnfantFirstname')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Nom"
                                                    value={this.state.newEnfantLastname}
                                                    onChange={this.updateState('newEnfantLastname')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Date de naissance"
                                                    value={this.state.newEnfantBirthdate}
                                                    onChange={this.updateState('newEnfantBirthdate')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero RAMQ"
                                                    value={this.state.newEnfantNoRAMQ}
                                                    onChange={this.updateState('newEnfantNoRAMQ')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Allergies"
                                                    value={this.state.newEnfantAllergies}
                                                    onChange={this.updateState('newEnfantAllergies')} />
                                            </fieldset>
                                            <button type="button" onClick={() => { this.addEnfant({ firstname: this.state.newEnfantFirstname, lastname: this.state.newEnfantLastname, birthdate: this.state.newEnfantBirthdate, noRAMQ: this.state.newEnfantNoRAMQ, allergies: this.state.newEnfantAllergies }) }}>Ajouter</button>

                                            <h3 className="text-xs-center">Transport</h3>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Transport nom"
                                                    value={this.state.transportName}
                                                    onChange={this.updateState('transportName')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Transport phone"
                                                    value={this.state.transportPhone}
                                                    onChange={this.updateState('transportPhone')} />
                                            </fieldset>
                                        </div>
                                        <div class="col-md-4 form-group">
                                            {serviceType === 3 &&
                                                <h3 className="text-xs-center">Parent visiteur</h3>
                                            }
                                            {(serviceType === 1 || serviceType === 2) &&
                                                <div className="row">
                                                    <div class="col-md-12 form-group">
                                                        <h3 >Type: </h3>
                                                        <Select
                                                            value={firstParentSelectedType}
                                                            isMulti={false}
                                                            isSearchable={true}
                                                            onChange={this.handleChangeFirstParentType.bind(this)}
                                                            options={parentTypeArray}>
                                                        </Select>
                                                    </div>
                                                </div>
                                            }
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Prenom"
                                                    value={this.state.firstParentFirstname}
                                                    onChange={this.updateState('firstParentFirstname')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Nom"
                                                    value={this.state.firstParentLastname}
                                                    onChange={this.updateState('firstParentLastname')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Date de naissance"
                                                    value={this.state.firstParentBirthdate}
                                                    onChange={this.updateState('firstParentBirthdate')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero telephone"
                                                    value={this.state.firstParentPhone}
                                                    onChange={this.updateState('firstParentPhone')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Email"
                                                    value={this.state.firstParentEmail}
                                                    onChange={this.updateState('firstParentEmail')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero permis de conduire"
                                                    value={this.state.firstParentNoPermisConduire}
                                                    onChange={this.updateState('firstParentNoPermisConduire')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero RAMQ"
                                                    value={this.state.firstParentNoRAMQ}
                                                    onChange={this.updateState('firstParentNoRAMQ')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Contact en cas d'urgence(nom et numero)"
                                                    value={this.state.firstParentContact}
                                                    onChange={this.updateState('firstParentContact')} />
                                            </fieldset>
                                            <h3 className="text-xs-center">Adresse</h3>
                                            <fieldset>
                                                <Select
                                                    className="form-control form-control-lg"
                                                    placeholder="Rechercher adresse par code postale"
                                                    options={addresses}
                                                    value={this.state.searchFirstParentAddress}
                                                    onChange={this.handleChangeAddressSelected.bind(this)} />
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Numero civique"
                                                        value={this.state.firstParentNoCivique}
                                                        onChange={this.updateState('firstParentNoCivique')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Street"
                                                        value={this.state.firstParentStreet}
                                                        onChange={this.updateState('firstParentStreet')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="City"
                                                        value={this.state.firstParentCity}
                                                        onChange={this.updateState('firstParentCity')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Province"
                                                        value={this.state.firstParentProvince}
                                                        onChange={this.updateState('firstParentProvince')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Code postal"
                                                        value={this.state.firstParentPostalCode}
                                                        onChange={this.updateState('firstParentPostalCode')} />
                                                </fieldset>
                                            </fieldset>
                                            <h3 className="text-xs-center">Avocat du parent visiteur</h3>
                                            <fieldset className="form-group">
                                                <Select
                                                    placeholder="Avocat du parent"
                                                    className="form-control form-control-xl"
                                                    options={avocats}
                                                    value={currentAvocatsFirstParent}
                                                    selectedOptions={currentAvocatsFirstParent}
                                                    isMulti={true}
                                                    isSearchable={true}
                                                    onChange={this.changeAvocatParent}>
                                                </Select>
                                            </fieldset>
                                        </div>
                                        <div class="col-md-4 form-group">
                                            {serviceType === 3 &&
                                                <h3 className="text-xs-center">Parent gardien</h3>
                                            }
                                            {(serviceType === 1 || serviceType === 2) &&
                                                <div className="row">
                                                    <div class="col-md-12 form-group">
                                                        <h3 >Type: </h3>
                                                        <Select
                                                            value={secondParentSelectedType}
                                                            isMulti={false}
                                                            isSearchable={true}
                                                            onChange={this.handleChangeSecondParentType.bind(this)}
                                                            options={parentTypeArray}>
                                                        </Select>
                                                    </div>
                                                </div>
                                            }
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Prenom"
                                                    value={this.state.secondParentFirstname}
                                                    onChange={this.updateState('secondParentFirstname')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Nom"
                                                    value={this.state.secondParentLastname}
                                                    onChange={this.updateState('secondParentLastname')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Date de naissance"
                                                    value={this.state.secondParentBirthdate}
                                                    onChange={this.updateState('secondParentBirthdate')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero telephone"
                                                    value={this.state.secondParentPhone}
                                                    onChange={this.updateState('secondParentPhone')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Email"
                                                    value={this.state.secondParentEmail}
                                                    onChange={this.updateState('secondParentEmail')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero permis de conduire"
                                                    value={this.state.secondParentNoPermisConduire}
                                                    onChange={this.updateState('secondParentNoPermisConduire')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Numero RAMQ"
                                                    value={this.state.secondParentNoRAMQ}
                                                    onChange={this.updateState('secondParentNoRAMQ')} />
                                            </fieldset>
                                            <fieldset className="form-group">
                                                <input
                                                    className="form-control form-control-lg"
                                                    type="text"
                                                    placeholder="Contact en cas d'urgence(nom et numero)"
                                                    value={this.state.secondParentContact}
                                                    onChange={this.updateState('secondParentContact')} />
                                            </fieldset>
                                            <h3 className="text-xs-center">Adresse</h3>
                                            <fieldset>
                                                <Select
                                                    className="form-control form-control-lg"
                                                    placeholder="Rechercher adresse par code postale"
                                                    options={addresses}
                                                    value={this.state.searchSecondParentAddress}
                                                    onChange={this.handleChangeSecondAddressSelected.bind(this)} />
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Numero civique"
                                                        value={this.state.secondParentNoCivique}
                                                        onChange={this.updateState('secondParentNoCivique')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Street"
                                                        value={this.state.secondParentStreet}
                                                        onChange={this.updateState('secondParentStreet')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="City"
                                                        value={this.state.secondParentCity}
                                                        onChange={this.updateState('secondParentCity')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Province"
                                                        value={this.state.secondParentProvince}
                                                        onChange={this.updateState('secondParentProvince')} />
                                                </fieldset>
                                            </fieldset>
                                            <fieldset>
                                                <fieldset className="form-group">
                                                    <input
                                                        className="form-control form-control-lg"
                                                        type="text"
                                                        placeholder="Code postal"
                                                        value={this.state.secondParentPostalCode}
                                                        onChange={this.updateState('secondParentPostalCode')} />
                                                </fieldset>
                                            </fieldset>
                                            <h3 className="text-xs-center">Avocat du parent gardien</h3>
                                            <fieldset className="form-group">
                                                <Select
                                                    placeholder="Avocat du parent"
                                                    className="form-control form-control-xl"
                                                    value={currentAvocatsSecondParent}
                                                    selectedOptions={currentAvocatsSecondParent}
                                                    options={avocats}
                                                    isMulti={true}
                                                    isSearchable={true}
                                                    onChange={this.changeAvocatSecondParent}>
                                                    )}
                                                </Select>
                                            </fieldset>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div class="col-md-12 offset-md-1">
                                                <h3 className="text-xs-center">Disponibilités</h3>
                                            </div>
                                            <div className="row">
                                                <div class="col-md-6 form-group">
                                                    <h5>Premier parent</h5>
                                                    <ul className="list-group text-center">
                                                        {(disposFirstParent != null) &&
                                                            Object.keys(disposFirstParent).map(function (key) {
                                                                return <li className="list-group-item list-group-item-info">{disposFirstParent[key].label}</li>
                                                            }.bind(this))
                                                        }
                                                    </ul>
                                                    <fieldset className="form-group">
                                                        <DatePicker selected={this.state.newDispoDateFirstParent} onChange={this.handleChangeNewDispoDateFirstParent.bind(this)} />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <TimePicker
                                                            onChange={this.handleChangeNewDispoTimeFromFirstParent.bind(this)}
                                                            value={this.state.newDispoTimeFromFirstParent}
                                                        />
                                                        <TimePicker
                                                            onChange={this.handleChangeNewDispoTimeToFirstParent.bind(this)}
                                                            value={this.state.newDispoTimeToFirstParent}
                                                        />
                                                    </fieldset>
                                                    <button type="button" onClick={() => { this.addDispoFirstParent({ date: this.state.newDispoDateFirstParent, from: this.state.newDispoTimeFromFirstParent, to: this.state.newDispoTimeToFirstParent }) }}>Ajouter</button>

                                                </div>
                                                <div class="col-md-6 form-group">
                                                    <h5>Deuxieme parent</h5>
                                                    <ul className="list-group text-center">
                                                        {(disposSecondParent != null) &&
                                                            Object.keys(disposSecondParent).map(function (key) {
                                                                return <li className="list-group-item list-group-item-info">{disposSecondParent[key].label}</li>
                                                            }.bind(this))
                                                        }
                                                    </ul>
                                                    <fieldset className="form-group">
                                                        <DatePicker selected={this.state.newDispoDateSecondParent} onChange={this.handleChangeNewDispoDateSecondParent.bind(this)} />
                                                    </fieldset>
                                                    <fieldset className="form-group">
                                                        <TimePicker
                                                            onChange={this.handleChangeNewDispoTimeFromSecondParent.bind(this)}
                                                            value={this.state.newDispoTimeFromSecondParent}
                                                        />
                                                        <TimePicker
                                                            onChange={this.handleChangeNewDispoTimeToSecondParent.bind(this)}
                                                            value={this.state.newDispoTimeToSecondParent}
                                                        />
                                                    </fieldset>
                                                    <button type="button" onClick={() => { this.addDispoSecondParent({ date: this.state.newDispoDateSecondParent, from: this.state.newDispoTimeFromSecondParent, to: this.state.newDispoTimeToSecondParent }) }}>Ajouter</button>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <button
                                                className="btn btn-lg btn-primary btn-block"
                                                type="submit"
                                                disabled={false}>
                                                Modifier demande de service
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditDemandeService);