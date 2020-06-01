import ListErrors from "../ListErrors";
import React, { useState } from "react";
import Request from "superagent";
import agent from "../../agent";
import Select from "react-select";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import {
  UPDATE_FIELD_AUTH,
  CREATE_DEMANDE_SERVICE,
  REGISTER_PAGE_UNLOADED,
  ADD_MOTIF,
} from "../../constants/actionTypes";
var moment = require("moment");

const InfoFormEnfantsParents = (values) => {
  if (values.serviceType.value !== "0") {
    return (
      <div class="col-md-8 form-group">
        <div className="row">
          <div class="col-md-6 form-group">
            {values.serviceType.value === "3" && (
              <h3 className="text-xs-center">Parent gardien</h3>
            )}
            {(values.serviceType.value === "1" ||
              values.serviceType.value === "2") && (
              <div className="row">
                <div class="col-md-12 form-group">
                  <h3>Type: </h3>
                  <Select
                    value={values.values.state.firstParentTypeOption}
                    onChange={values.values.handleChangeFirstParentType.bind(
                      values.values
                    )}
                    isMulti={false}
                    isSearchable={true}
                    options={values.parentTypeArray}
                  ></Select>
                </div>
              </div>
            )}
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Prenom"
                value={values.firstParent.prenom}
                onChange={values.values.changeParentPrenom}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Nom"
                value={values.parentNom}
                onChange={values.values.changeParentNom}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Date de naissance"
                value={values.parentBirthdate}
                onChange={values.values.changeParentBirthdate}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Numero telephone"
                value={values.parentPhone}
                onChange={values.values.changeParentPhone}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Email"
                value={values.parentEmail}
                onChange={values.values.changeParentEmail}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Numero permis de conduire"
                value={values.parentNoLicense}
                onChange={values.values.changeParentNoLicense}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Numero RAMQ"
                value={values.parentNoRAMQ}
                onChange={values.values.changeParentNoRAMQ}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Note specifique"
                value={values.firstParentNote}
                onChange={values.values.changeParentNote}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Contact en cas d'urgence(nom et numero)"
                value={values.parentContact}
                onChange={values.values.changeParentContact}
              />
            </fieldset>
            <h3 className="text-xs-center">Adresse</h3>
            <fieldset>
              <fieldset className="form-group">
                <Select
                  className="form-control form-control-lg"
                  placeholder="Rechercher adresse par code postale"
                  options={values.addresses}
                  value={values.searchFirstParentAddress}
                  onChange={values.values.handleChangeAddressSelected.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Numero civique"
                  value={values.values.state.firstParentNoCivique}
                  onChange={values.values.handleChangeNoCiviqueFirstParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Street"
                  value={values.values.state.firstParentStreet}
                  onChange={values.values.handleChangeStreetFirstParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="City"
                  value={values.values.state.firstParentCity}
                  onChange={values.values.handleChangeCityFirstParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Province"
                  value={values.values.state.firstParentProvince}
                  onChange={values.values.handleChangeProvinceFirstParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Code postal"
                  value={values.values.state.firstParentPostalCode}
                  onChange={values.values.handleChangePostalCodeFirstParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <h3 className="text-xs-center">Avocat du parent gardien</h3>
            <fieldset className="form-group">
              <Select
                placeholder="Avocat du parent"
                className="form-control form-control-xl"
                value={values.values.state.avocatFirstParent}
                options={values.avocats}
                isMulti={true}
                isSearchable={true}
                onChange={values.values.handleChangeAvocatFirstParent.bind(
                  values.values
                )}
              >
                )}
              </Select>
            </fieldset>
          </div>
          <div class="col-md-6 form-group">
            {values.serviceType.value === "3" && (
              <h3 className="text-xs-center">Parent visiteur</h3>
            )}
            {(values.serviceType.value === "1" ||
              values.serviceType.value === "2") && (
              <div className="row">
                <div class="col-md-12 form-group">
                  <h3>Type: </h3>
                  <Select
                    value={values.values.state.secondParentTypeOption}
                    onChange={values.values.handleChangeSecondParentType.bind(
                      values.values
                    )}
                    isMulti={false}
                    isSearchable={true}
                    options={values.parentTypeArray}
                  ></Select>
                </div>
              </div>
            )}
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Prenom"
                value={values.secondParentPrenom}
                onChange={values.values.changeSecondParentPrenom}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Nom"
                value={values.secondParentNom}
                onChange={values.values.changeSecondParentNom}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Date de naissance"
                value={values.secondParentBirthdate}
                onChange={values.values.changeSecondParentBirthdate}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Numero telephone"
                value={values.secondParentPhone}
                onChange={values.values.changeSecondParentPhone}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Email"
                value={values.secondParentEmail}
                onChange={values.values.changeSecondParentEmail}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Numero permis de conduire"
                value={values.secondParentNoLicense}
                onChange={values.values.changeSecondParentNoLicense}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Numero RAMQ"
                value={values.secondParentNoRAMQ}
                onChange={values.values.changeSecondParentNoRAMQ}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Note specifique"
                value={values.secondParentNote}
                onChange={values.values.changeSecondParentNote}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Contact en cas d'urgence(nom et numero)"
                value={values.secondParentContact}
                onChange={values.values.changeSecondParentContact}
              />
            </fieldset>
            <h3 className="text-xs-center">Adresse</h3>
            <fieldset>
              <fieldset className="form-group">
                <Select
                  className="form-control form-control-lg"
                  placeholder="Rechercher adresse par code postale"
                  options={values.addresses}
                  value={values.searchSecondParentAddress}
                  onChange={values.values.handleChangeSecondAddressSelected.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Numero civique"
                  value={values.values.state.secondParentNoCivique}
                  onChange={values.values.handleChangeNoCiviqueSecondParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Street"
                  value={values.values.state.secondParentStreet}
                  onChange={values.values.handleChangeStreetSecondParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="City"
                  value={values.values.state.secondParentCity}
                  onChange={values.values.handleChangeCitySecondParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Province"
                  value={values.values.state.secondParentProvince}
                  onChange={values.values.handleChangeProvinceSecondParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Code postal"
                  value={values.values.state.secondParentPostalCode}
                  onChange={values.values.handleChangePostalCodeSecondParent.bind(
                    values.values
                  )}
                />
              </fieldset>
            </fieldset>
            <h3 className="text-xs-center">Avocat du parent visiteur</h3>
            <fieldset className="form-group">
              <Select
                placeholder="Avocat du parent"
                className="form-control form-control-xl"
                value={values.values.state.avocatSecondParent}
                options={values.avocats}
                isMulti={true}
                isSearchable={true}
                onChange={values.values.handleChangeAvocatSecondParent.bind(
                  values.values
                )}
              >
                )}
              </Select>
            </fieldset>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onChangeDate: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "date", value }),
  onChangeNoDossierFamille: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "noDossierFamille", value }),
  onChangeFrequence: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "frequence", value }),
  onChangeAssumeFrais: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "assumeFrais", value }),
  onChangeMotifs: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "motifs", value }),
  onChangeTransportName: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "transportName", value }),
  onChangeTransportPhone: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "transportPhone", value }),
  onChangeParentNom: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentNom", value }),
  onChangeParentPrenom: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentPrenom", value }),
  onChangeParentBirthdate: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentBirthdate", value }),
  onChangeParentEmail: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentEmail", value }),
  onChangeParentPhone: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentPhone", value }),
  onChangeParentNoLicense: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentNoLicense", value }),
  onChangeParentNote: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentNote", value }),
  onChangeParentContact: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentContact", value }),
  onChangeParentNoRAMQ: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "firstParentNoRAMQ", value }),
  onChangeSecondParentNom: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentNom", value }),
  onChangeSecondParentPrenom: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentPrenom", value }),
  onChangeSecondParentBirthdate: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentBirthdate", value }),
  onChangeSecondParentEmail: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentEmail", value }),
  onChangeSecondParentPhone: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentPhone", value }),
  onChangeSecondParentNoLicense: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentNoLicense", value }),
  onChangeSecondParentNote: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentNote", value }),
  onChangeSecondParentContact: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentContact", value }),
  onChangeSecondParentNoRAMQ: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "secondParentNoRAMQ", value }),
  onChangeEnfantNom: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "enfantNom", value }),
  onChangeEnfantPrenom: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "enfantPrenom", value }),
  onChangeEnfantNoRAMQ: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "enfantNoRAMQ", value }),
  onChangeEnfantBirthdate: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "enfantBirthdate", value }),
  onChangeEnfantAllergies: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "enfantAllergies", value }),
  onChangeEnfants: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "enfants", value }),
  onChangeNewMotif: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "newMotif", value }),
  onAddMotif: (newMotif) => {
    const payload = agent.DemandeService.addMotif(newMotif);
    dispatch({ type: ADD_MOTIF, payload });
  },
  onSubmit: (
    serviceType,
    noDossierFamille,
    date,
    frequence,
    assumeFrais,
    motifs,
    transport,
    parent,
    secondParent,
    enfants,
    disposFirstParent,
    disposSecondParent
  ) => {
    const payload = agent.DemandeService.register(
      serviceType,
      noDossierFamille,
      date,
      frequence,
      assumeFrais,
      motifs,
      transport,
      parent,
      secondParent,
      enfants,
      disposFirstParent,
      disposSecondParent
    );
    dispatch({ type: CREATE_DEMANDE_SERVICE, payload });
  },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
});

export class CreateDemandeService extends React.Component {
  constructor() {
    super();
    this.changeNoDossierFamille = (ev) =>
      this.props.onChangeNoDossierFamille(ev.target.value);
    this.changeFrequence = (ev) =>
      this.props.onChangeFrequence(ev.target.value);
    this.changeAssumeFrais = (ev) =>
      this.props.onChangeAssumeFrais(ev.target.value);
    this.changeMotifs = (ev) => this.props.onChangeMotifs(ev.target.value);
    this.changeTransportName = (ev) =>
      this.props.onChangeTransportName(ev.target.value);
    this.changeTransportPhone = (ev) =>
      this.props.onChangeTransportPhone(ev.target.value);
    this.changeParentNom = (ev) =>
      this.props.onChangeParentNom(ev.target.value);
    this.changeParentPrenom = (ev) =>
      this.props.onChangeParentPrenom(ev.target.value);
    this.changeParentEmail = (ev) =>
      this.props.onChangeParentEmail(ev.target.value);
    this.changeParentPhone = (ev) =>
      this.props.onChangeParentPhone(ev.target.value);
    this.changeParentBirthdate = (ev) =>
      this.props.onChangeParentBirthdate(ev.target.value);
    this.changeParentNoLicense = (ev) =>
      this.props.onChangeParentNoLicense(ev.target.value);
    this.changeParentNoRAMQ = (ev) =>
      this.props.onChangeParentNoRAMQ(ev.target.value);
    this.changeParentNote = (ev) =>
      this.props.onChangeParentNote(ev.target.value);
    this.changeParentContact = (ev) =>
      this.props.onChangeParentContact(ev.target.value);
    this.changeSecondParentNom = (ev) =>
      this.props.onChangeSecondParentNom(ev.target.value);
    this.changeSecondParentPrenom = (ev) =>
      this.props.onChangeSecondParentPrenom(ev.target.value);
    this.changeSecondParentEmail = (ev) =>
      this.props.onChangeSecondParentEmail(ev.target.value);
    this.changeSecondParentPhone = (ev) =>
      this.props.onChangeSecondParentPhone(ev.target.value);
    this.changeSecondParentBirthdate = (ev) =>
      this.props.onChangeSecondParentBirthdate(ev.target.value);
    this.changeSecondParentNoLicense = (ev) =>
      this.props.onChangeSecondParentNoLicense(ev.target.value);
    this.changeSecondParentNoRAMQ = (ev) =>
      this.props.onChangeSecondParentNoRAMQ(ev.target.value);
    this.changeSecondParentNote = (ev) =>
      this.props.onChangeSecondParentNote(ev.target.value);
    this.changeSecondParentContact = (ev) =>
      this.props.onChangeSecondParentContact(ev.target.value);
    this.changeEnfantNom = (ev) =>
      this.props.onChangeEnfantNom(ev.target.value);
    this.changeEnfantPrenom = (ev) =>
      this.props.onChangeEnfantPrenom(ev.target.value);
    this.changeEnfantNoRAMQ = (ev) =>
      this.props.onChangeEnfantNoRAMQ(ev.target.value);
    this.changeEnfantAllergies = (ev) =>
      this.props.onChangeEnfantAllergies(ev.target.value);
    this.changeEnfantBirthdate = (ev) =>
      this.props.onChangeEnfantBirthdate(ev.target.value);
    this.changeEnfants = (ev) => this.props.onChangeEnfants(ev.target.value);
    this.changeNewMotif = (ev) => this.props.onChangeNewMotif(ev.target.value);
    this.changeSearchFirstParentPostalCode = (ev) =>
      this.setState({ searchFirstParentPostalCode: ev.target.value });
    this.changeSearchSecondParentPostalCode = (ev) =>
      this.setState({ searchSecondParentPostalCode: ev.target.value });
    this.addNewMotif = (newMotif) => (ev) => {
      ev.preventDefault();

      var motif = this.state.newMotif;

      if (typeof motif != "undefined") {
        this.props.onAddMotif(motif);
        this.setState({ newMotif: "" });
        var controller = this;
        var millisecondsToWait = 500;
        setTimeout(function() {
          var url = "http://localhost:4000/motifs";
          Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.Motifs;
            controller.setState({ motifs: data });
          });
        }, millisecondsToWait);
      }
    };
    this.submitForm = (
      noDossier,
      frequence,
      assumeFrais,
      transportName,
      transportPhone,
      firstParent,
      secondParent
    ) => (ev) => {
      ev.preventDefault();
      var transport = {
        name: transportName,
        phone: transportPhone,
      };
      if (this.state.serviceType.value != "3") {
        firstParent.type = this.state.firstParentType;
        secondParent.type = this.state.secondParentType;
      } else {
        firstParent.type = 1;
        secondParent.type = 2;
      }
      this.props.onSubmit(
        this.state.serviceType,
        noDossier,
        this.state.Date,
        frequence,
        assumeFrais,
        this.state.motifsSelected,
        transport,
        firstParent,
        secondParent,
        this.state.enfants,
        this.state.disposFirstParent,
        this.state.disposSecondParent
      );
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  componentWillMount() {
    var url = "http://localhost:4000/motifs";
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.Motifs;
      this.setState({ motifs: data });
    });
    var url = "http://localhost:4000/avocats";
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.Avocats;
      this.setState({ avocats: data });
    });
    var url = "http://localhost:4000/parents/address";
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.Addresses;
      this.setState({ addresses: data });
    });
    this.setState({ enfants: [] });
    this.setState({ disposFirstParent: [] });
    this.setState({ disposSecondParent: [] });
    this.setState({ serviceType: { value: "0", label: "" } });
    this.setState({ newMotif: "" });
    this.setState({ Date: moment() });
    this.setState({ newDispoDateFirstParent: moment() });
    this.setState({ newDispoDateSecondParent: moment() });
    var today = new Date("December 17, 1995 11:11:00");
    var time = today.getHours() + ":" + today.getMinutes();

    //NEW
    var timeRange = [time, time];

    //NEW
    this.setState({ dispoTimeFirstParent: timeRange });
    this.setState({ dispoTimeSecondParent: timeRange });

    //OLD
    this.setState({ newDispoTimeFromFirstParent: time });
    this.setState({ newDispoTimeFromSecondParent: time });

    //OLD
    this.setState({ newDispoTimeToFirstParent: time });
    this.setState({ newDispoTimeToSecondParent: time });

    this.setState({ searchFirstParentPostalCode: "" });
    this.setState({ firstParentNoCivique: "" });
    this.setState({ firstParentCity: "" });
    this.setState({ firstParentStreet: "" });
    this.setState({ firstParentPostalCode: "" });
    this.setState({ firstParentProvince: "" });
    this.setState({ searchSecondParentPostalCode: "" });
    this.setState({ secondParentNoCivique: "" });
    this.setState({ secondParentCity: "" });
    this.setState({ secondParentStreet: "" });
    this.setState({ secondParentPostalCode: "" });
    this.setState({ secondParentProvince: "" });
    this.setState({ avocatFirstParent: "" });
    this.setState({ avocatSecondParent: "" });
  }

  addEnfant(newEnfant) {
    if (
      typeof newEnfant.lastname != "undefined" &&
      newEnfant.lastname != "" &&
      typeof newEnfant.firstname != "undefined" &&
      newEnfant.firstName != "" &&
      typeof newEnfant.noRAMQ != "undefined" &&
      newEnfant.noRAMQ != "" &&
      typeof newEnfant.birthdate != "undefined" &&
      newEnfant.birthdate != "" &&
      typeof newEnfant.allergies != "undefined" &&
      newEnfant.allergies != ""
    ) {
      this.setState({
        enfants: this.state.enfants.concat([
          {
            noRAMQ: newEnfant.noRAMQ,
            birthdate: newEnfant.birthdate,
            allergies: newEnfant.allergies,
            firstname: newEnfant.firstname,
            lastname: newEnfant.lastname,
          },
        ]),
      });
    }
  }

  addDispoFirstParent(date) {
    if (
      typeof date != "undefined" &&
      typeof date.from != "undefined" &&
      typeof date.to != "undefined"
    ) {
      this.setState({
        disposFirstParent: this.state.disposFirstParent.concat([
          { date: date.date.toDate(), from: date.from, to: date.to },
        ]),
      });
    }
  }

  addDispoSecondParent(date) {
    if (
      typeof date != "undefined" &&
      typeof date.from != "undefined" &&
      typeof date.to != "undefined"
    ) {
      this.setState({
        disposSecondParent: this.state.disposSecondParent.concat([
          { date: date.date.toDate(), from: date.from, to: date.to },
        ]),
      });
    }
  }

  handleChangeDate(date) {
    this.setState({
      Date: date,
    });
  }

  handleChangeNewDispoDateFirstParent(date) {
    this.setState({
      newDispoDateFirstParent: date,
    });
  }

  handleChangeNewDispoDateSecondParent(date) {
    this.setState({
      newDispoDateSecondParent: date,
    });
  }

  // NEW
  handleDispoTimeFirstParent(timeRange) {
    this.setState({
      dispoTimeFirstParent: timeRange,
    });
  }

  // NEW
  handleDispoTimeSecondParent(timeRange) {
    this.setState({
      dispoTimeSecondParent: timeRange,
    });
  }

  //OLD
  handleChangeNewDispoTimeFromFirstParent(time) {
    this.setState({
      newDispoTimeFromFirstParent: time,
    });
  }

  //OLD
  handleChangeNewDispoTimeToFirstParent(time) {
    this.setState({
      newDispoTimeToFirstParent: time,
    });
  }

  //OLD
  handleChangeNewDispoTimeFromSecondParent(time) {
    this.setState({
      newDispoTimeFromSecondParent: time,
    });
  }

  //OLD
  handleChangeNewDispoTimeToSecondParent(time) {
    this.setState({
      newDispoTimeToSecondParent: time,
    });
  }

  handleChangeMotifs(selectedOptions) {
    this.setState({ motifsSelected: selectedOptions });
    console.log(`Motif selected:`, selectedOptions);
  }

  handleChangeServiceType(selectedOptions) {
    this.setState({ serviceType: selectedOptions });
    console.log(`Service type selected:`, selectedOptions);
  }

  handleChangeNewMotif(ev) {
    ev.preventDefault();
    this.setState({ newMotif: ev.target.value });
    console.log(`New motif entered:`, ev.target.value);
  }

  handleChangeSearchPostalCodeFirstParent(ev) {
    ev.preventDefault();
    this.setState({ searchFirstParentPostalCode: ev.target.value });
    console.log(`Search for postal code:`, ev.target.value);
  }

  handleChangeSearchPostalCodeSecondParent(ev) {
    ev.preventDefault();
    this.setState({ searchSecondParentPostalCode: ev.target.value });
    console.log(`Search for postal code:`, ev.target.value);
  }

  handleChangeNoCiviqueFirstParent(ev) {
    ev.preventDefault();
    this.setState({ firstParentNoCivique: ev.target.value });
  }

  handleChangeCityFirstParent(ev) {
    ev.preventDefault();
    this.setState({ firstParentCity: ev.target.value });
  }

  handleChangeStreetFirstParent(ev) {
    ev.preventDefault();
    this.setState({ firstParentStreet: ev.target.value });
  }

  handleChangeProvinceFirstParent(ev) {
    ev.preventDefault();
    this.setState({ firstParentProvince: ev.target.value });
  }

  handleChangePostalCodeFirstParent(ev) {
    ev.preventDefault();
    this.setState({ firstParentPostalCode: ev.target.value });
  }

  handleChangeNoCiviqueSecondParent(ev) {
    ev.preventDefault();
    this.setState({ secondParentNoCivique: ev.target.value });
  }

  handleChangeCitySecondParent(ev) {
    ev.preventDefault();
    this.setState({ secondParentCity: ev.target.value });
  }

  handleChangeStreetSecondParent(ev) {
    ev.preventDefault();
    this.setState({ secondParentStreet: ev.target.value });
  }

  handleChangeProvinceSecondParent(ev) {
    ev.preventDefault();
    this.setState({ secondParentProvince: ev.target.value });
  }

  handleChangePostalCodeSecondParent(ev) {
    ev.preventDefault();
    this.setState({ secondParentPostalCode: ev.target.value });
  }

  handleChangeSecondParentType(type) {
    this.setState({ secondParentTypeOption: type });
    this.setState({ secondParentType: parseInt(type.value) });
  }

  handleChangeFirstParentType(type) {
    this.setState({ firstParentTypeOption: type });
    this.setState({ firstParentType: parseInt(type.value) });
  }

  handleChangeAvocatFirstParent(avocats) {
    this.setState({ avocatFirstParent: avocats });
  }

  handleChangeAvocatSecondParent(avocats) {
    this.setState({ avocatSecondParent: avocats });
  }

  handleChangeAddressSelected(ev) {
    this.setState({ searchFirstParentAddress: ev.value });
    this.setState({ firstParentNoCivique: ev.value.NoCivique });
    this.setState({ firstParentCity: ev.value.City });
    this.setState({ firstParentStreet: ev.value.Street });
    this.setState({ firstParentPostalCode: ev.value.PostalCode });
    this.setState({ firstParentProvince: ev.value.Province });
  }

  handleChangeSecondAddressSelected(ev) {
    this.setState({ searchSecondParentAddress: ev.value });
    this.setState({ secondParentNoCivique: ev.value.NoCivique });
    this.setState({ secondParentCity: ev.value.City });
    this.setState({ secondParentStreet: ev.value.Street });
    this.setState({ secondParentPostalCode: ev.value.PostalCode });
    this.setState({ secondParentProvince: ev.value.Province });
  }

  render() {
    var serviceType = this.state.serviceType;
    const ServiceTypeArray = [
      { value: "1", label: "Visite supervisée" },
      { value: "2", label: "Conversation téléphonique supervisée" },
      { value: "3", label: "Échange de garde supervisé" },
    ];
    const parentTypeArray = [
      { value: "1", label: "Parent gardien" },
      { value: "2", label: "Parent visiteur" },
      { value: "3", label: "Tuteur" },
      { value: "4", label: "Famille accueil" },
    ];
    var date = this.state.Date;
    var searchFirstParentPostalCode = this.state.searchFirstParentPostalCode;
    var noDossierFamille = this.props.noDossierFamille;
    var frequence = this.props.frequence;
    var motifs = this.props.motifs;
    var assumeFrais = this.props.assumeFrais;
    var firstParentType = this.state.firstParentType;
    var secondParentType = this.state.secondParentType;
    var transportName = this.props.transportName;
    var transportPhone = this.props.transportPhone;
    var firstParentNom = this.props.firstParentNom;
    var firstParentPrenom = this.props.firstParentPrenom;
    var firstParentBirthdate = this.props.firstParentBirthdate;
    var firstParentEmail = this.props.firstParentEmail;
    var firstParentPhone = this.props.firstParentPhone;
    var firstParentNote = this.props.firstParentNote;
    var firstParentNoLicense = this.props.firstParentNoLicense;
    var firstParentNoRAMQ = this.props.firstParentNoRAMQ;
    var firstParentContact = this.props.firstParentContact;
    var firstParentNoCivique = this.state.firstParentNoCivique;
    var firstParentStreet = this.state.firstParentStreet;
    var firstParentCity = this.state.firstParentCity;
    var firstParentProvince = this.state.firstParentProvince;
    var firstParentPostalCode = this.state.firstParentPostalCode;
    var avocatFirstParent = this.state.avocatFirstParent;
    var avocatSecondParent = this.state.avocatSecondParent;
    var firstParent = {
      type: firstParentType,
      lastname: firstParentNom,
      firstname: firstParentPrenom,
      birthdate: firstParentBirthdate,
      phone: firstParentPhone,
      note: firstParentNote,
      email: firstParentEmail,
      noLicense: firstParentNoLicense,
      noRAMQ: firstParentNoRAMQ,
      contact: firstParentContact,
      avocat: avocatFirstParent,
      address: {
        nocivique: firstParentNoCivique,
        street: firstParentStreet,
        city: firstParentCity,
        postalcode: firstParentPostalCode,
        province: firstParentProvince,
      },
    };
    var secondParentNom = this.props.secondParentNom;
    var secondParentPrenom = this.props.secondParentPrenom;
    var secondParentBirthdate = this.props.secondParentBirthdate;
    var secondParentEmail = this.props.secondParentEmail;
    var secondParentPhone = this.props.secondParentPhone;
    var secondParentNote = this.props.secondParentNote;
    var secondParentNoLicense = this.props.secondParentNoLicense;
    var secondParentNoRAMQ = this.props.secondParentNoRAMQ;
    var secondParentContact = this.props.secondParentContact;
    var secondParentNoCivique = this.state.secondParentNoCivique;
    var secondParentStreet = this.state.secondParentStreet;
    var secondParentCity = this.state.secondParentCity;
    var secondParentProvince = this.state.secondParentProvince;
    var secondParentPostalCode = this.state.secondParentPostalCode;
    var secondParent = {
      type: secondParentType,
      lastname: secondParentNom,
      firstname: secondParentPrenom,
      birthdate: secondParentBirthdate,
      phone: secondParentPhone,
      note: secondParentNote,
      email: secondParentEmail,
      noLicense: secondParentNoLicense,
      noRAMQ: secondParentNoRAMQ,
      contact: secondParentContact,
      avocat: avocatSecondParent,
      address: {
        nocivique: secondParentNoCivique,
        street: secondParentStreet,
        city: secondParentCity,
        postalcode: secondParentPostalCode,
        province: secondParentProvince,
      },
    };
    var enfantNom = this.props.enfantNom;
    var enfantPrenom = this.props.enfantPrenom;
    var enfantBirthdate = this.props.enfantBirthdate;
    var enfantNoRAMQ = this.props.enfantNoRAMQ;
    var enfantAllergies = this.props.enfantAllergies;
    var newEnfant = {
      lastname: enfantNom,
      firstname: enfantPrenom,
      birthdate: enfantBirthdate,
      allergies: enfantAllergies,
      noRAMQ: enfantNoRAMQ,
    };
    var avocats = [];
    var enfantsAjouter = [];
    var addresses = [];
    var disposFirstParent = [];
    var disposSecondParent = [];
    var newMotif = this.state.newMotif;
    var searchFirstParentAddress = this.state.searchFirstParentAddress;
    var searchSecondParentAddress = this.state.searchSecondParentAddress;

    var motifsArray = [];
    if (this.state != null && this.state.motifs != null) {
      Object.values(this.state.motifs).map((d) =>
        motifsArray.push({ value: d.Id, label: d.Type })
      );
    }

    if (this.state != null && this.state.avocats != null) {
      Object.values(this.state.avocats).map((a) =>
        avocats.push({ value: a.Id, label: a.Firstname + " " + a.Lastname })
      );
    }

    if (this.state != null && this.state.enfants != null) {
      Object.values(this.state.enfants).map((d) =>
        enfantsAjouter.push({
          value: d.noRAMQ,
          label: d.firstname + " " + d.lastname,
        })
      );
    }

    if (this.state != null && this.state.disposFirstParent != null) {
      Object.values(this.state.disposFirstParent).map((d) =>
        disposFirstParent.push({
          value: d.date,
          label: d.date.toString() + ", from: " + d.from + " to: " + d.to,
        })
      );
    }

    if (this.state != null && this.state.disposSecondParent != null) {
      Object.values(this.state.disposSecondParent).map((d) =>
        disposSecondParent.push({
          value: d.date,
          label: d.date.toString() + ", from: " + d.from + " to: " + d.to,
        })
      );
    }

    if (this.state != null && this.state.addresses != null) {
      Object.values(this.state.addresses).map((a) =>
        addresses.push({ value: a, label: a.PostalCode })
      );
    }

    return (
      <div className="create-demande-service">
        <h1 className="text-xs-center">
          <div class="titlecolor">{"Créer demande de service"}</div>
        </h1>
        <br />
        <div className="container page">
          <ListErrors errors={this.props.errors} />
          <div className="row">
            <div className="columnfull">
              <form
                className="form-group"
                onSubmit={this.submitForm(
                  noDossierFamille,
                  frequence,
                  assumeFrais,
                  transportName,
                  transportPhone,
                  firstParent,
                  secondParent
                ).bind(this)}
              >
                <div class="row">
                  <div class="column2">
                    <h3 className="text-xs-center">Entrée en vigueur</h3>
                    <br />
                    <fieldset className="form-group">
                      <DatePicker
                        inline
                        selected={this.state.Date}
                        onSelect={this.handleSelect}
                        onChange={this.handleChangeDate.bind(this)}
                        value={this.state.datePrice}
                      />
                    </fieldset>
                  </div>

                  <div class="column2">
                    <h3 className="text-xs-center">Motif(s)</h3>
                    <br />
                    <Select
                      placeholder="Type"
                      className="form-control form-control-xl"
                      value={this.props.serviceType}
                      options={ServiceTypeArray}
                      isMulti={false}
                      isSearchable={true}
                      onChange={this.handleChangeServiceType.bind(this)}
                    >
                      )}
                    </Select>
                    <br />
                    <Select
                      placeholder="Motifs"
                      className="form-control form-control-xl"
                      value={motifs}
                      options={motifsArray}
                      isMulti={true}
                      isSearchable={true}
                      onChange={this.handleChangeMotifs.bind(this)}
                    >
                      )}
                    </Select>
                    <br />
                    <fieldset className="form-group row">
                      <div class="row">
                        <div class="floatleft">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Autres motifs"
                            value={this.state.newMotif}
                            onChange={this.handleChangeNewMotif.bind(this)}
                          />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="floatright">
                          <button
                            class="btn btn-sm btn-info"
                            onClick={this.addNewMotif(this.state.newMotif).bind(
                              this
                            )}
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div />

                  <div className="row">
                    <div className="columnfull">
                      <hr />
                      <h3 class="text-xs-center">Disponibilités</h3>
                      <hr />
                      <div class="column2 text-xs-center">
                        <h5 class="aa text-xs-center">Premier parent</h5>
                        <br/>
                        <ul className="list-group">
                          {disposFirstParent != null &&
                            Object.keys(disposFirstParent).map(
                              function(key) {
                                return (
                                  <li className="list-group-item list-group-item-info">
                                    {disposFirstParent[key].label}
                                  </li>
                                );
                              }.bind(this)
                            )}
                        </ul>
                        <fieldset className="form-group">
                          <DatePicker
                            selected={this.state.newDispoDateFirstParent}
                            onChange={this.handleChangeNewDispoDateFirstParent.bind(
                              this
                            )}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <TimeRangePicker
                            value={this.state.dispoTimeFirstParent}
                            onChange={this.handleDispoTimeFirstParent.bind(
                              this
                            )}
                          />
                        </fieldset>
                        <button
                          type="button"
                          className="btn btn-info btn-sm"
                          style={{ width: "100%" }}
                          onClick={() => {
                            this.addDispoFirstParent({
                              date: this.state.newDispoDateFirstParent,
                              //from: this.state.newDispoTimeFromFirstParent,
                              //to: this.state.newDispoTimeToFirstParent,
                              from: this.state.dispoTimeFirstParent[0],
                              to: this.state.dispoTimeFirstParent[1],
                            });
                          }}
                        >
                          Ajouter
                        </button>
                      </div>

                      <div class="column2 text-xs-center">
                        <h5 class="aa text-xs-center">Deuxième parent</h5>
                        <br/>
                        <ul className="list-group">
                          {disposSecondParent != null &&
                            Object.keys(disposSecondParent).map(
                              function(key) {
                                return (
                                  <li className="list-group-item list-group-item-info">
                                    {disposSecondParent[key].label}
                                  </li>
                                );
                              }.bind(this)
                            )}
                        </ul>
                        <fieldset className="form-group">
                          <DatePicker
                            selected={this.state.newDispoDateSecondParent}
                            onChange={this.handleChangeNewDispoDateSecondParent.bind(
                              this
                            )}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <TimeRangePicker
                            value={this.state.dispoTimeSecondParent}
                            onChange={this.handleDispoTimeSecondParent.bind(
                              this
                            )}
                          />
                        </fieldset>
                        <button
                          type="button"
                          style={{ width: "100%" }}
                          className="btn btn-info btn-sm"
                          onClick={() => {
                            this.addDispoSecondParent({
                              date: this.state.newDispoDateSecondParent,
                              //from: this.state.newDispoTimeFromSecondParent,
                              //to: this.state.newDispoTimeToSecondParent,
                              from: this.state.dispoTimeSecondParent[0],
                              to: this.state.dispoTimeSecondParent[1],
                            });
                          }}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className="row">
                    <div className="columnfull">
                      <br />
                      <hr />
                      <h3 class="text-xs-center">Responsabilité</h3>
                      <hr />
                      <div className="column2">
                        <h5 class="aa text-xs-center">Suivi</h5>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Frequence"
                            value={this.props.frequence}
                            onChange={this.changeFrequence}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Numero dossier famille"
                            value={this.props.noDossierFamille}
                            onChange={this.changeNoDossierFamille}
                          />
                        </fieldset>
                        <fieldset className="form-group-3">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Qui assume les frais?"
                            value={this.props.assumeFrais}
                            onChange={this.changeAssumeFrais}
                          />
                        </fieldset>
                      </div>

                      <div className="column2">
                        <h5 class="aa text-xs-center">Transport</h5>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Transport nom"
                            value={transportName}
                            onChange={this.changeTransportName}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Transport tel."
                            value={transportPhone}
                            onChange={this.changeTransportPhone}
                          />
                        </fieldset>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="columnfull">
                      <br />
                      <hr />
                      <h3 class="text-xs-center">Enfants</h3>
                      <hr />
                      <div className="column2">
                        <h5 class="aa text-xs-center">Contact</h5>
                        <ul className="list-group text-center">
                          {enfantsAjouter != null &&
                            Object.keys(enfantsAjouter).map(
                              function(key) {
                                return (
                                  <li className="list-group-item list-group-item-info">
                                    {enfantsAjouter[key].label}
                                  </li>
                                );
                              }.bind(this)
                            )}
                        </ul>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Prenom"
                            value={newEnfant.firstname}
                            onChange={this.changeEnfantPrenom}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Nom"
                            value={newEnfant.lastname}
                            onChange={this.changeEnfantNom}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Date de naissance"
                            value={newEnfant.birthdate}
                            onChange={this.changeEnfantBirthdate}
                          />
                        </fieldset>
                      </div>

                      <div className="column2">
                        <h5 class="aa text-xs-center">Dossier</h5>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Numero RAMQ"
                            value={newEnfant.noRAMQ}
                            onChange={this.changeEnfantNoRAMQ}
                          />
                        </fieldset>
                        <fieldset className="form-group">
                          <input
                            className="form-control form-control-md"
                            type="text"
                            placeholder="Allergies"
                            value={newEnfant.allergies}
                            onChange={this.changeEnfantAllergies}
                          />
                        </fieldset>
                        <button
                          type="button"
                          style={{ width: "100%" }}
                          className="btn btn-info btn-sm"
                          onClick={() => {
                            this.addEnfant({
                              firstname: newEnfant.firstname,
                              lastname: newEnfant.lastname,
                              birthdate: newEnfant.birthdate,
                              noRAMQ: newEnfant.noRAMQ,
                              allergies: newEnfant.allergies,
                            });
                          }}
                        >
                          Ajouter enfant
                        </button>
                      </div>
                    </div>
                  </div>
                  <InfoFormEnfantsParents
                    values={this}
                    props={this.props}
                    serviceType={serviceType}
                    addresses={addresses}
                    firstParentType={firstParentType}
                    secondParentType={secondParentType}
                    avocats={avocats}
                    parentTypeArray={parentTypeArray}
                    firstParent={firstParent}
                    secondParent={secondParent}
                  />
                </div>
                <hr />
                <hr />
                <br/>
                <div className="row">
                  <div className="columnfull text-xs-center">
                    <button
                      className="btn btn-lg btn-primary"
                      type="submit"
                      disabled={this.props.inProgress}
                    >
                      Créer demande de service
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDemandeService);
