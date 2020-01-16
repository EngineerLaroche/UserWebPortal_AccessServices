import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Request from 'superagent';

const EditOrganismeDetails = props => {
  if (props.isOrganisme) {
    return (
      <Link to={`/organisme/edit/${props.currentOrganisme.email}`} className="btn btn-primary">
        <i className="ion-gear-a"> </i>
        <FormattedMessage
          id="userdetails.modify"
          defaultMessage="Modifier" />
      </Link>
    );
  }
};

const mapStateToProps = state => ({
  currentOrganisme: state.common.currentOrganisme,
  organisme: state.common.organisme
});

const mapDispatchToProps = dispatch => ({});

export class OrganismeDetails extends React.Component {

  constructor() {
    super();
    this.state = {
      currentOrganisme: ''
    }
  }

  componentWillMount() {
    var url = "http://localhost:4000/organisme/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.organisme;
      this.setState({ 'organisme': data });
      this.setState({ 'currentOrganisme': data });
    });
  }

  render() {
    const currentOrganisme = this.state.currentOrganisme;
    if (!currentOrganisme) {
      return null;
    }

    return (

      <div className="profile-page">
        <div className="container page">

          <hr />
          <h1 className="text-xs-center">
            <FormattedMessage
              id="organismedetails.title"
              defaultMessage="Profil de l'organisme" />
          </h1>
          <hr />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="text-xs-left">

                <h4>
                  <FormattedMessage
                    id="createorganisme.name"
                    defaultMessage="Nom" />
                  :  {currentOrganisme.name}
                </h4>
                <h4>
                  <FormattedMessage
                    id="createorganisme.email"
                    defaultMessage="Email" />
                  :  {currentOrganisme.email}
                </h4>
                <br />
                <h4>
                  <FormattedMessage
                    id="createorganisme.tel"
                    defaultMessage="Numéro de téléphone" />
                  :  {currentOrganisme.phone}
                </h4>
                <h4>
                  <FormattedMessage
                    id="createorganisme.fax"
                    defaultMessage="Numéro de fax" />
                  :  {currentOrganisme.fax}
                </h4>
                <h4>
                  <FormattedMessage
                    id="createorganisme.address"
                    defaultMessage="Adresse" />
                  :  {currentOrganisme.address.nocivique} {currentOrganisme.address.street}, {currentOrganisme.address.city}, {currentOrganisme.address.province}
                </h4>
                <h4>
                  <FormattedMessage
                    id="createorganisme.postalcode"
                    defaultMessage="Code postal" />
                  :  {currentOrganisme.address.postalcode}
                </h4>
                <br />

                <EditOrganismeDetails isOrganisme={true}
                  currentOrganisme={currentOrganisme} />

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganismeDetails);
