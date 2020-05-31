import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Request from "superagent";
import { FormattedMessage } from "react-intl";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const EditPointServiceDetails = (props) => {
  if (props.isPointService) {
    return (
      <Link
        to={`/pointservice/edit/${props.currentPointService.email}`}
        className="btn btn-sm btn-primary"
      >
        <i className="ion-gear-a"> </i>
        {"Modifier Point de Service"}
      </Link>
    );
  }
};

const AddService = (props) => {
  if (props.isPointService) {
    return (
      <Link to={`/service/create`} className="btn btn-sm btn-info">
        {"Ajouter un service"}
      </Link>
    );
  }
};

const mapStateToProps = (state) => ({
  currentPointService: state.common.currentPointService,
  pointService: state.common.pointService,
});

const mapDispatchToProps = (dispatch) => ({});

export class PointServiceDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPointService: "",
      columnDefs: [
        { headerName: "Name", field: "name" },
        { headerName: "Description", field: "description" },
        { headerName: "Tarif Parent", field: "tarifParent" },
        { headerName: "Tarif CISSS", field: "tarifCISSS" },
        { headerName: "Subvention", field: "stateSubvention" },
        { headerName: "Date Vigueur", field: "datePrice" },
      ],
      rowData: [],
    };
  }

  componentWillMount() {
    var url =
      "http://localhost:4000/pointservice/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.pointService;
      this.setState({
        pointService: data,
        currentPointService: data,
      });
    });
  }

  //   componentDidMount() {
  //     fetch("http://localhost:4000/pointservice/" + this.props.match.params.email)
  //         .then(result => result.json())
  //         .then(rowData => this.setState({rowData}))
  // }

  render() {
    const currentPointService = this.state.currentPointService;

    if (!currentPointService) {
      return null;
    }

    return (
      <div className="profile-page">
        <h1 className="text-xs-center">
          <div class="titlecolor">{"Point de Service"}</div>
        </h1>
        <br />
        <div className="container page">
          <div className="row">
            <div class="column2">
              <h4 class="bold">
                <FormattedMessage
                  id="createorganisme.name"
                  defaultMessage="Nom"
                />
                :<h7 class="aa"> {currentPointService.name}</h7>
              </h4>
              <hr />
              <h6>
                {"Statut: "}
                <h7 class="gg">{"Actif"}</h7>
                <br />
                {"Identifiant: "}
                <h7 class="aa">{currentPointService.id}</h7>
                <br />
                {"Adresse: "}
                <h7 class="aa">
                  {currentPointService.nocivique} {currentPointService.street}{" "}
                  {", "} {currentPointService.city} {", "}{" "}
                  {currentPointService.province}
                </h7>
              </h6>
            </div>

            <div class="column2">
              <h5 class="bold text-xs-center">Contact</h5>
              <hr />
              <h6>
                {"Email: "}
                <h7 class="aa">{currentPointService.email}</h7>
                <br />
                {"Tel. : "}
                <h7 class="aa">{currentPointService.phone}</h7>
                <br />
                {"Fax : "}
                <h7 class="aa">{currentPointService.fax}</h7>
              </h6>
            </div>
          </div>
          <br />
          <EditPointServiceDetails
            isPointService={true}
            currentPointService={currentPointService}
          />
          <hr />
          <div class="floatleft">
            <h5 class="bold">
              Offre: <h7 class="info"> Services (2)</h7>
            </h5>
          </div>
          <div class="floatright">
            <AddService
              isPointService={true}
              currentPointService={currentPointService}
            />
          </div>
          <br />
          <br />
          <div
            className="ag-theme-balham"
            style={{ height: "400px", width: "100%" }}
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
            ></AgGridReact>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PointServiceDetails);
