import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import Request from 'superagent';

const EditServiceDetails = props => {
  if (props.isService) {
    return (
      <Link to={`/service/edit/${props.currentService.name}`} className="btn btn-primary">
        <i className="ion-gear-a"> </i>
        <FormattedMessage
          id="userdetails.modify"
          defaultMessage="Modifier" />
      </Link>
    );
  }
};

const mapStateToProps = state => ({
  currentService: state.common.currentService,
  service: state.common.service
});

const mapDispatchToProps = dispatch => ({});

export class ServiceDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      currentService: '',
      serviceState: '',
      subventionState: ''
    }
  }

  componentWillMount() {
    var url = "http://localhost:4000/service/" + this.props.match.params.name;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.service;
      this.setState({
        'service': data,
        'currentService': data,
        'serviceState': data.state,
        'subventionState': data.stateSubvention
      })
    });
  }

  render() {
    const intl = this.props.intl;
    const currentService = this.state.currentService;
    const stateName = this.state.serviceState === 0 ? intl.formatMessage({ id: "editorganisme.active", defaultMessage: "Actif" }) : intl.formatMessage({ id: "editorganisme.inactive", defaultMessage: "Inactif" });
    const stateNameSub = this.state.subventionState === 0 ? intl.formatMessage({ id: "servicedetails.sub", defaultMessage: "Subventionné" }) : intl.formatMessage({ id: "servicedetails.nonsub", defaultMessage: "Non-subventionné" });
    if (!currentService) {
      return null;
    }

    return (
      <div className="profile-page">
        <div className="container page">
          <hr />
          <h1 className="text-xs-center">
            <FormattedMessage
              id="servicedetails.title"
              defaultMessage="Profil du Service" />
          </h1>
          <hr />
          <br />
          <br />
          <div className="container">
            <div className="row">
              <div className="text-xs-left">
                <h4>
                  <FormattedMessage
                    id="profile.username"
                    defaultMessage="Nom :" />
                  {currentService.name}</h4>
                <br />
                <h4>
                  <FormattedMessage
                    id="createservice.description"
                    defaultMessage="Description: " />
                  {currentService.description}</h4>
                <h4>
                  <FormattedMessage
                    id="createservice.subvention"
                    defaultMessage="Subvention: " />
                  {stateNameSub}</h4>
                <h4>
                  <FormattedMessage
                    id="createservice.state"
                    defaultMessage="Etat: " />
                  {stateName}</h4>
                <br />
                <h4>
                  <FormattedMessage
                    id="createservice.vigueur"
                    defaultMessage="En vigueur: " />
                  {currentService.datePrice}</h4>
                <h4>
                  <FormattedMessage
                    id="createservice.tarpar"
                    defaultMessage="Tarif parent: " />
                  {currentService.tarifParent} $</h4>
                <h4>
                <FormattedMessage
                    id="createservice.tarcis"
                    defaultMessage="Tarif CISSS: " />
                {currentService.tarifCISSS} $</h4>
                <br />

                <EditServiceDetails isService={true}
                  currentService={currentService} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ServiceDetails.propTypes = {
  intl: intlShape.isRequired
};
ServiceDetails = injectIntl(ServiceDetails);

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);
