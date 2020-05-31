import ListErrors from "../ListErrors";
import React from "react";
import agent from "../../agent";
import Request from "superagent";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import {
  UPDATE_FIELD_AUTH,
  CREATE_SERVICE,
  REGISTER_PAGE_UNLOADED,
} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({
  ...state.auth,
  //,
  //associateDateTarifs: []
});

const mapDispatchToProps = (dispatch) => ({
  onChangeName: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "name", value }),
  onChangeDescription: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "description", value }),
  onChangeTarifParent: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "tarifParent", value }),
  onChangeTarifCISSS: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "tarifCISSS", value }),
  onChangeStateSubvention: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "stateSubvention", value }),
  onChangeState: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "state", value }),
  onChangeDatePrice: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "datePrice", value }),
  // onChangeArrayDateTarifs: value =>
  //     dispatch({ type: UPDATE_FIELD_AUTH, key: 'arrayDateTarifs', value }),
  onChangePointService: (value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: "pointService", value }),
  onSubmit: (
    name,
    description,
    tarifParent,
    tarifCISSS,
    stateSubvention,
    state,
    datePrice,
    pointService
  ) => {
    const payload = agent.Service.register(
      name,
      description,
      tarifParent,
      tarifCISSS,
      stateSubvention,
      state,
      datePrice,
      pointService
    );
    dispatch({ type: CREATE_SERVICE, payload });
  },
  //Pour eventuellement garder dans un array [{tarifParent, tarifCISSS, datePrice}]
  //
  // onAssociateDateTarifs: (associateDateTarifs, name) => {
  //     associateDateTarifs.forEach(function (element) {
  //       const payload = agent.Service.preference(element.value, name);
  //       dispatch({ type: ASSOCIATE_DATE_TARIFS, payload })
  //     });
  //   },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
});

//Permet d'obtenir la date actuelle sous forme de String dd/mm/aaaa
function getDate() {
  var today = new Date();
  var date =
    today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear();
  return date;
}

class CreateService extends React.Component {
  //state = {selectedDateTarifs: null}
  constructor() {
    super();
    this.changeName = (ev) => this.props.onChangeName(ev.target.value);
    this.changeDescription = (ev) =>
      this.props.onChangeDescription(ev.target.value);
    this.changeTarifParent = (ev) =>
      this.props.onChangeTarifParent(ev.target.value);
    this.changeTarifCISSS = (ev) =>
      this.props.onChangeTarifCISSS(ev.target.value);
    this.changeStateSubvention = (ev) =>
      this.props.onChangeStateSubvention(ev.target.value);
    this.changeState = (ev) => this.props.onChangeState(ev.target.value);
    this.changeDatePrice = (ev) =>
      this.props.onChangeDatePrice(ev.target.value);
    // this.changeArrayDateTarifs = ev => this.props.onChangeArrayDateTarifs(ev.target.value);
    this.changePointService = (ev) =>
      this.props.onChangePointService(ev.target.value);
    this.submitForm = (
      name,
      description,
      tarifParent,
      tarifCISSS,
      stateSubvention,
      state,
      datePrice,
      pointService
    ) => (ev) => {
      ev.preventDefault();
      this.props.onSubmit(
        name,
        description,
        tarifParent,
        tarifCISSS,
        stateSubvention,
        state,
        datePrice,
        pointService
      );
      //this.props.onAssociateDateTarifs(this.state.associateDateTarifs, name);
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  componentWillMount() {
    var url = "http://localhost:4000/pointservices";
    Request.get(url).then((response) => {
      console.log(response.body);
      this.setState(response.body.rows);
    });
  }

  // handleAssociateDateTarifs(selectedDateTarifs) {
  //     this.setState({ 'associateDateTarifs': selectedDateTarifs });
  //   }

  render() {
    const name = this.props.name;
    const description = this.props.description;
    const tarifParent = this.props.tarifParent;
    const tarifCISSS = this.props.tarifCISSS;
    const stateSubvention = this.props.stateSubvention;
    const state = this.props.state;
    const datePrice = getDate();
    const pointService = this.props.pointService;
    const pointServices = this.state;

    //const arrayDateTarifs = [{datePrice, tarifParent, tarifCISSS}];
    //arrayDateTarifs.push({datePrice, tarifParent, tarifCISSS});

    return (
      <div className="create-service">
        <h1 className="text-xs-center">
          <div class="titlecolor">
            <FormattedMessage
              id="createservice.title"
              defaultMessage="Creer un service"
            />
          </div>
        </h1>
        <br />
        <div className="container page">
          <ListErrors errors={this.props.errors} />

          <div className="row">
            <div className="col-md-8 offset-md-2 col-xs-12">
              <form
                onSubmit={this.submitForm(
                  name,
                  description,
                  tarifParent,
                  tarifCISSS,
                  stateSubvention,
                  state,
                  datePrice,
                  pointService
                ).bind(this)}
              >
                <div className="row">
                  <div class="column2">
                    <h3 className="text-xs-center">Information</h3>
                    <br />

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-md"
                        type="text"
                        placeholder="Nom"
                        value={this.props.name}
                        onChange={this.changeName}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-md"
                        type="text"
                        placeholder="Description"
                        value={this.props.description}
                        onChange={this.changeDescription}
                      />
                    </fieldset>

                    <h3 className="text-xs-center">Tarifs ($)</h3>
                    <br />
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-md"
                        type="text"
                        placeholder="Tarif Parent"
                        value={this.props.tarifParent}
                        onChange={this.changeTarifParent}
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-md"
                        type="text"
                        placeholder="Tarif CISSS"
                        value={this.props.tarifCISSS}
                        onChange={this.changeTarifCISSS}
                      />
                    </fieldset>
                  </div>
                  <div class="column2">
                    <fieldset className="form-group">
                      <h3 className="text-xs-center">Association</h3>
                      <br />
                      <select
                        className="form-control form-control-sm"
                        value={this.props.pointService}
                        selectedOptions={this.props.pointService}
                        onChange={this.changePointService}
                      >
                        <option key="">Associer à un Point de Service</option>
                        {pointServices != null &&
                          Object.values(pointServices).map((d) => (
                            <option key={d.Email} value={d.Id}>
                              {d.Name}
                            </option>
                          ))}
                      </select>
                    </fieldset>
                    <br />
                    <br />
                    <h3 className="text-xs-center">Autorisations</h3>
                    <br />
                    <fieldset className="form-group">
                      <select
                        className="form-control form-control-sm"
                        value={this.props.stateSubvention}
                        selectedOptions={this.props.stateSubvention}
                        onChange={this.changeStateSubvention}
                      >
                        <option key="-1" value="-1">
                          Subvention Service
                        </option>
                        <option key="0" value="0">
                          Subventionné
                        </option>
                        <option key="1" value="1">
                          Non-Subventionné
                        </option>
                      </select>
                    </fieldset>
                    <fieldset className="form-group">
                      <select
                        className="form-control form-control-sm"
                        value={this.props.state}
                        selectedOptions={this.props.state}
                        onChange={this.changeState}
                      >
                        <option key="-1" value="-1">
                          Activité du Service
                        </option>
                        <option key="0" value="0">
                          Actif
                        </option>
                        <option key="1" value="1">
                          Inactif
                        </option>
                      </select>
                    </fieldset>
                  </div>
                </div>
                <br />
                <div class="columncenter">
                  <div className="text-xs-center">
                    <button
                      className="btn btn-block btn-primary btn-default"
                      type="submit"
                      disabled={this.props.inProgress}
                    >
                      {"Créer Service"}
                    </button>
                  </div>
                </div>
                <br/>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateService);
