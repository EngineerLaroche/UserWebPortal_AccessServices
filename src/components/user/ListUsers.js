import { Link } from "react-router-dom";
import Request from "superagent";
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { GETUSERS, USERSEARCH } from "../../constants/actionTypes";
import { roleIdToText, tableIcons } from "../../utils";
import MaterialTable from "material-table";

// Pour modifier le profil des usagers
export const EditProfileSettings = (props) => {
  if (props.isUser) {
    return (
      <Link to={"/user_edit/" + props.userEmail}>
        <i className="ion-gear-a"> </i>
        <FormattedMessage id="listusers.modify" defaultMessage="Modifier" />
      </Link>
    );
  }
  return null;
};

const mapStateToProps = (state) => ({
  currentUser: state.common.currentUser,
  profile: state.profile,
  users: "",
  search: "",
});

// Au support de la recherche et affichage des users
const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch({ type: GETUSERS }),
  onSearch: () => dispatch({ type: USERSEARCH, payload: this.search }),
});

// CLASS - LIST USERS
export class ListUsers extends React.Component {
  componentWillMount() {
    var url = "http://localhost:4000/users";
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.rows;
      this.setState(data);
    });
  }

  render() {
    const dataUsers = this.state;
    var allUsers = [];
    const isUser =
      this.props.currentUser &&
      (this.props.currentUser.role === 1 || this.props.currentUser.role === 2);

    {
      // Insertion des donnees de chq usager dans une liste
      dataUsers != null &&
        Object.values(dataUsers).map((d) =>
          allUsers.push({
            id: d.Id,
            name: (
              <Link to={"/user/" + d.Email} className="nav-link">
                {d.Firstname} {d.Lastname}
              </Link>
            ),
            role: roleIdToText(d.Role),
            email: d.Email,
            edit: (
              <ul className="nav navbar-nav pull-xs-right">
                <EditProfileSettings isUser={isUser} userEmail={d.Email} />
              </ul>
            ),
            //actif: activeIdToText(d.Active),
          })
        );
    }

    return (     
      <div class="searchcenter">
        <hr />
        <hr />
        <h1 className="text-xs-center">
            <FormattedMessage
              id="listusers.title"
              defaultMessage="Liste des Usagers"
            />
        </h1>
        <br />
        <div style={{ maxWidth: "100%" }}>
          <MaterialTable
            icons={tableIcons}
            columns={[
              { title: "ID", field: "id" },
              { title: "Nom", field: "name" },
              { title: "Rôle", field: "role" },
              { title: "Email", field: "email" },
              { title: "Modifier", field: "edit" },
              //{ title: "Actif", field: "actif" },
            ]}
            data={allUsers}
            title="Usagers actifs"
          />
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListUsers);
