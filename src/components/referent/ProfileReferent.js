import React from 'react';
import { Link } from 'react-router-dom';
import Request from 'superagent';
import { connect } from 'react-redux';

const EditProfileReferentSettings = props => {
  if (props.isReferent) {
    return (
      <Link to={`/editreferent/${props.currentReferent.email}`} className="btn btn-primary">
        <i className="ion-gear-a"></i> 
        Modifier Référent
      </Link>
    );
  }
};

const mapStateToProps = state => ({
  currentReferent: state.common.currentReferent,
  referent: state.referent
});

const mapDispatchToProps = dispatch => ({  });

export class Referent extends React.Component {

  constructor(){
    super();
    this.state = {
      currentReferent: ''
    }
  }

  componentWillMount() {
    var url = "http://localhost:4000/referent/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.referent;
      this.setState({'referent':data});
      this.setState({'currentReferent':data});
    });
  }

  render() {
    const referent = this.state.currentReferent;
    if (!referent) {
      return null;
    }

    const name = referent.firstname + " " + referent.lastname;
    
    return (
      <div className="referent-page">
        <div className="referent-info">
          <br/>
          <br/>
          <h1 className="text-xs-center">Profil du référent</h1>
          <br/>
          <br/>
          <div className="container">
            <div className="row">
              <div className="text-xs-left">

                <h4>Nom: {name}</h4>
                <h4>Email: {referent.email}</h4>
                <h4>Titre: {referent.title}</h4>
                <br/>
                <h4>Telephone travail: {referent.workphone}</h4>
                <h4>Telephone cellulaire: {referent.cellphone}</h4>
                <h4>Fax: {referent.fax}</h4>
                <h4>Preference: {referent.preference}</h4>
                <EditProfileReferentSettings isReferent={true} 
                                              currentReferent={referent} 
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

export default connect(mapStateToProps, mapDispatchToProps)(Referent);
//export { Referent, mapStateToProps };
