//***TEMPORAIRE***
//Utilisé pour accéder et afficher les info du Référent à partir de la liste des Référents
//Ce fichier est dans le fond presqu'une copie du fichier ProfileReferent.js

import React from 'react';
import { Link } from 'react-router-dom';
import Request from 'superagent';
import { connect } from 'react-redux';
import agent from '../../agent';
import {
  DEACTIVATE,
  REACTIVATE
} from '../../constants/actionTypes';

const EditReferentSettings = props => {
  if (props.isReferent) {
    return (
      <div>
        <Link to={`/referent/edit/${props.referent.email}`} className="btn btn-sm btn-outline-secondary action-btn">
          <i className="ion-gear-a">
          </i>
          Modifier Référent
          </Link>
        {(props.hasHighRights && !props.isActivated) &&
          <button onClick={props.onClickReactivate} className="btn btn-sm btn-outline-secondary action-btn">
            <i className="ion-gear-a">
            </i>
            Réactiver Référent
          </button>
        }
        {(props.hasHighRights && props.isActivated) &&
          <button onClick={props.onClickDeactivate} className="btn btn-sm btn-outline-secondary action-btn">
            <i className="ion-gear-a">
            </i>
            Désactiver Référent
          </button>
        }
      </div>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  currentReferent: state.common.currentReferent,
  referent: state.referent
});

const mapDispatchToProps = dispatch => ({

  //agent.Auth ??
  onClickDeactivate: (email) => dispatch({ type: DEACTIVATE, payload: agent.Auth.deactivate(email) }),
  onClickReactivate: (email) => dispatch({ type: REACTIVATE, payload: agent.Auth.reactivate(email) })
});

class ReferentDetails extends React.Component {

  componentWillMount() {
    var url = "http://localhost:4000/referent/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.referent;
      this.setState(data);
    });
  }

  render() {
    const referent = this.state;
    if (!referent) {
      return null;
    }

    //Verifier cette constante...
    const isReferent = this.props.currentReferent;
    
    const isActivated = (referent.active === 0);
    const name = referent.firstname + " " + referent.lastname;


    // A utiliser pour la selection (comment contacter referent) entre workPhone, cellPhone et Fax....
    //
    // var role;
    // switch (profile.role) {
    //   case 1:
    //     role = "Directeur";
    //     break;
    //   case 2:
    //     role = "Coordonateur";
    //     break;
    //   case 3:
    //     role = "Adjoint-Coordonateur";
    //     break;
    //   default:
    //     role = "Intervenant";
    //     break;
    // }


    return (
      <div className="referent-page">
        <div className="referent-info">
        <br/>
          <br/>
          <h1 className="text-xs-center">Un Référent</h1>
          <br/>
          <br/>
          <div className="container">
            <div className="row">
              <div className="text-xs-left">

                <h4>Nom: {name}</h4>
                <h4>Email: {referent.email}</h4>
                <h4>Titre: {referent.titre}</h4>
                <br/>
                <h4>Telephone travail: {referent.workPhone}</h4>
                <h4>Telephone cellulaire: {referent.cellPhone}</h4>
                <h4>Fax: {referent.fax}</h4>
                <EditReferentSettings isReferent={true} 
                                      referent={referent} 
                                      isActivated={isActivated} 
                                      onClickDeactivate={ () => {this.props.onClickDeactivate(referent.email)}} 
                                      onClickReactivate={() => {this.props.onClickReactivate(referent.email)}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferentDetails);
export {ReferentDetails, mapStateToProps };
