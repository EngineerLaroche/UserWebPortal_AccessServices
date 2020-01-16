import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Request from 'superagent';


const EditOrganismeReferentDetails = props => {
  return (
  <div>
  {props.editRights &&
    <Link to={`/organismereferent/edit/${props.currentOrganismeReferent.email}`} className="btn btn-primary">
      <i className="ion-gear-a"> </i>
      Modifier Organisme Référent
      </Link>
    }
  </div>
  );
};

const mapStateToProps = state => ({
  currentOrganismeReferent: state.common.currentOrganismeReferent,
  organismeReferent: state.common.organismeReferent,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({});

export class OrganismeReferentDetails extends React.Component {

  constructor() {
    super();
    this.state = {
      currentOrganismeReferent: '',
      organismeReferentState: ''
    }
  }

  componentWillMount() {
    var url = "http://localhost:4000/organismereferent/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.organismeReferent;
      this.setState({ 'currentOrganismeReferent': data });
      this.setState({ 'organismeReferentState': data.state });
    });
  }

  render() {
    var editRights = true;
    const currentOrganismeReferent = this.state.currentOrganismeReferent;
    if (!currentOrganismeReferent) {
      return null;
    }
    const stateName = this.state.organismeReferentState === 0 ? "Actif" : "Inactif"
    
    if (this.props.currentUser != null) {
      editRights = this.props.currentUser.role < 4;
    }
    return (

      <div className="profile-page">
        <div className="container page">

          <hr />
          <h1 className="text-xs-center">Profil Organisme-Référent</h1>
          <hr />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="text-xs-left">

                <h4>Nom: {currentOrganismeReferent.name}</h4>
                <h4>Email: {currentOrganismeReferent.email}</h4>
                <h4>Site: {currentOrganismeReferent.website}</h4>
                <br />
                <h4>Téléphone: {currentOrganismeReferent.phone}</h4>
                <h4>Fax: {currentOrganismeReferent.fax}</h4>
                <h4>Adresse: {currentOrganismeReferent.address.nocivique} {currentOrganismeReferent.address.street}, {currentOrganismeReferent.address.city}, {currentOrganismeReferent.address.province}</h4>
                <h4>Code postale: {currentOrganismeReferent.address.postalcode}</h4>
                <br />
                <h4>Etat: {stateName}</h4>
                <br />

                <EditOrganismeReferentDetails editRights={editRights}
                  currentOrganismeReferent={currentOrganismeReferent} />

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganismeReferentDetails);
