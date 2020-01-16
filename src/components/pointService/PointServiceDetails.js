import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Request from 'superagent';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


const EditPointServiceDetails = props => {
  if (props.isPointService) {
    return (
      <Link to={`/pointservice/edit/${props.currentPointService.email}`} className="btn btn-primary">
        <i className="ion-gear-a"> </i>
        Modifier Point de Service
      </Link>
    );
  }
};

const AddService = props => {
  if (props.isPointService) {
    return (
      <Link to={`/service/create`} className="btn btn-primary">
        Ajouter un Service
      </Link>
    );
  }
};

const mapStateToProps = state => ({
  currentPointService: state.common.currentPointService,
  pointService: state.common.pointService
});

const mapDispatchToProps = dispatch => ({});

export class PointServiceDetails extends React.Component {

  constructor() {
    super();
    this.state = {
      currentPointService: '',
      columnDefs: [
        {headerName: 'Name', field: 'name'},
        {headerName: 'Description', field: 'description'},
        {headerName: 'Tarif Parent', field: 'tarifParent'},
        {headerName: 'Tarif CISSS', field: 'tarifCISSS'},
        {headerName: 'Subvention', field: 'stateSubvention'},
        {headerName: 'Date Vigueur', field: 'datePrice'}

    ],
    rowData: []
    }
  }

  componentWillMount() {
    var url = "http://localhost:4000/pointservice/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.pointService;
      this.setState({
        'pointService': data,
        'currentPointService': data
      })
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
        <div className="container page">

          <hr />
          <h1 className="text-xs-center">Profil Point de Service</h1>
          <hr />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="text-xs-left">

                <h4>Nom: {currentPointService.name}</h4>
                <h4>Email: {currentPointService.email}</h4>
                <br />
                <h4>Téléphone: {currentPointService.phone}</h4>
                <h4>Fax: {currentPointService.fax}</h4>
                <br />
                <h4>Adresse: {currentPointService.nocivique} {currentPointService.street}, {currentPointService.city}, {currentPointService.province}</h4>
                <h4>Code postale: {currentPointService.postalcode}</h4>
                <br />

                <EditPointServiceDetails isPointService={true}
                  currentPointService={currentPointService} />
                <br />
                <br />
              </div>
            </div>
          </div>
          <hr />
          <h1 className="text-xs-center">Services</h1>
          <hr />
          <br />
          <AddService isPointService={true}
            currentPointService={currentPointService} />
          <br />
          <br />
          <div
            className="ag-theme-balham"
            style={{ height: '400px', width: '1120px' }}
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
            </AgGridReact>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PointServiceDetails);
