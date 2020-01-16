import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';



const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link to="/settings" className="btn btn-primary">
        <i className="ion-gear-a"> </i>
        <FormattedMessage
          id="profile.modify"
          defaultMessage="Modifier Profil" />
      </Link>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({});

export class Profile extends React.Component {

  render() {
    const intl = this.props.intl;
    const profile = this.props.currentUser;
    if (!profile) {
      return null;
    }

    const isUser = this.props.currentUser && (this.props.currentUser.role === 1 || this.props.currentUser.role === 2);
    const name = this.props.currentUser.firstname + " " + this.props.currentUser.lastname;

    var role;
    switch (this.props.currentUser.role) {
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
        <div className="container page">

          <hr />
          <h1 className="text-xs-center">
            <FormattedMessage
              id="profile.title"
              defaultMessage="Mon Profil" />
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

                <EditProfileSettings isUser={isUser} />

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
//export { Profile };
