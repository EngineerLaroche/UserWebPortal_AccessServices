import React from 'react';
import { Link } from 'react-router-dom';
import Request from 'superagent';
import { connect } from 'react-redux';
import agent from '../../agent';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
  DEACTIVATE,
  REACTIVATE
} from '../../constants/actionTypes';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <div>
        {props.hasHighRights &&
          <Link to={"/user_edit/" + props.profile.email} className="btn btn-sm btn-outline-secondary action-btn">
            <i className="ion-gear-a">
            </i>
            <FormattedMessage
              id="userdetails.modify"
              defaultMessage="Modifier profil" />
          </Link>
        }
        {(props.hasHighRights && !props.isActivated) &&
          <button onClick={props.onClickReactivate} className="btn btn-sm btn-outline-secondary action-btn">
            <i className="ion-gear-a">
            </i>
            <FormattedMessage
              id="userdetails.reactivate"
              defaultMessage=" Réactiver utilisateur" />
          </button>
        }
        {(props.hasHighRights && props.isActivated) &&
          <button onClick={props.onClickDeactivate} className="btn btn-sm btn-outline-secondary action-btn">
            <i className="ion-gear-a">
            </i>
            <FormattedMessage
              id="userdetails.desactivate"
              defaultMessage=" Désactiver utilisateur" />
          </button>
        }
      </div>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  onClickDeactivate: (email) => dispatch({ type: DEACTIVATE, payload: agent.Auth.deactivate(email) }),
  onClickReactivate: (email) => dispatch({ type: REACTIVATE, payload: agent.Auth.reactivate(email) })
});

class Profile extends React.Component {

  componentWillMount() {
    var url = "http://localhost:4000/user/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.user;
      this.setState(data);
    });
  }

  render() {
    const intl = this.props.intl;
    const profile = this.state;
    if (!profile) {
      return null;
    }
    const user = this.props.currentUser;
    if (!user) {
      return null;
    }
    const hasHighRights = this.props.currentUser.role <= profile.role;

    const isActivated = (profile.active === 0);

    const name = profile.firstname + " " + profile.lastname;


    var role;
    switch (profile.role) {
      case 1:
        role = intl.formatMessage({
          id: "role.directeur",
          defaultMessage: "Directeur"
        });
        break;
      case 2:
        role = intl.formatMessage({
          id: "role.coordonateur",
          defaultMessage: "Coordonateur"
        });
        break;
      case 3:
        role = intl.formatMessage({
          id: "role.adjointcoordonateur",
          defaultMessage: "Adjoint-Coordonateur"
        });
        break;
      default:
        role = intl.formatMessage({
          id: "role.adjointcoordonateur",
          defaultMessage: "Adjoint-Coordonateur"
        });
        break;
    }


    return (
      <div className="profile-page">
        <div className="user-info">

          <hr />
          <h1 className="text-xs-center">
            <FormattedMessage
              id="userdetails.title"
              defaultMessage="Profil Utilisateur" />
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
                    defaultMessage="Nom d'utilisateur:" />
                  {name}
                </h4>
                <h4>
                  <FormattedMessage
                    id="profile.email"
                    defaultMessage="Email:" />
                  {profile.email}
                </h4>
                <h4>
                  <FormattedMessage
                    id="profile.role"
                    defaultMessage="Rôle:" />
                  {role}
                </h4>
                <br />

                <EditProfileSettings isUser={true} profile={profile} isActivated={isActivated} onClickDeactivate={() => { this.props.onClickDeactivate(profile.email) }} onClickReactivate={() => { this.props.onClickReactivate(profile.email) }} hasHighRights={hasHighRights} />

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  intl: intlShape.isRequired
};
Profile = injectIntl(Profile);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile, mapStateToProps };
