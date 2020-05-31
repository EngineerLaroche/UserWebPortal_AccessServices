import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Request from "superagent";
import { tableIcons } from "../../utils";
import MaterialTable from "material-table";

const EditOrganismeDetails = (props) => {
  if (props.isOrganisme) {
    return (
      <Link
        to={`/organisme/edit/${props.currentOrganisme.email}`}
        className="btn btn-sm btn-primary"
      >
        <i className="ion-gear-a"> </i>
        {"Modifier Organisme"}
      </Link>
    );
  }
};

// Redirige vers la page qui permet de modifier les parametres d'un Point de Service
export const EditPointServiceSettings = (props) => {
  return (
    <Link to={"/pointservice/edit/" + props.pointServiceEmail}>
      <div class="aa">
        <i className="ion-gear-a"> </i>
        {"Modifier"}
      </div>
    </Link>
  );
};

const mapStateToProps = (state) => ({
  currentOrganisme: state.common.currentOrganisme,
  organisme: state.common.organisme,
});

const mapDispatchToProps = (dispatch) => ({});

export class OrganismeDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      currentOrganisme: "",
    };
  }

  componentWillMount() {
    var url =
      "http://localhost:4000/organisme/" + this.props.match.params.email;
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.organisme;
      this.setState({ organisme: data });
      this.setState({ currentOrganisme: data });
    });
  }

  render() {
    const currentOrganisme = this.state.currentOrganisme;
    if (!currentOrganisme) {
      return null;
    }

    return (
      <div className="profile-page">
        <h1 className="text-xs-center">
          <div class="titlecolor">
            <FormattedMessage
              id="organismedetails.title"
              defaultMessage="Profil de l'organisme"
            />
          </div>
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
                :<h7 class="aa"> {currentOrganisme.name}</h7>
              </h4>
              <hr />
              <h6>
                {"Statut: "}
                <h7 class="gg">{currentOrganisme.actif}</h7>
                <br />
                {"Identifiant: "}
                <h7 class="aa">{currentOrganisme.id}</h7>
                <br />
                {"Adresse: "}
                <h7 class="aa">
                  {currentOrganisme.nocivique} {currentOrganisme.street} {", "}{" "}
                  {currentOrganisme.city} {", "} {currentOrganisme.province}
                </h7>
              </h6>
            </div>

            <div class="column2">
              <h5 class="bold text-xs-center">Contact</h5>
              <hr />
              <h6>
                {"Email: "}
                <h7 class="aa">{currentOrganisme.email}</h7>
                <br />
                {"Tel. : "}
                <h7 class="aa">{currentOrganisme.phone}</h7>
                <br />
                {"Fax : "}
                <h7 class="aa">{currentOrganisme.fax}</h7>
              </h6>
            </div>
          </div>
          <br />
          <EditOrganismeDetails
            isOrganisme={true}
            currentOrganisme={currentOrganisme}
          />
          <hr />
          <div class="floatleft">
            <h5 class="bold">
              Relations: <h7 class="info"> Points de Services (2)</h7>
            </h5>
          </div>
          <div class="floatright">
            <button className="btn btn-sm btn-info">
              {" Ajouter / Retirer "}
            </button>
          </div>
          <br />
          <br />
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              icons={tableIcons}
              options={{
                pageSizeOptions: [2, 3, 4, 5, 10],
                headerStyle: {
                  fontSize: "13px",
                  padding: "5px",
                  fontWeight: "bold",
                  backgroundColor: "#5bc0de",
                  color: "#FFF",
                },
                cellStyle: { fontSize: "12px", padding: "5px" },
              }}
              columns={[
                { title: "ID", field: "id" },
                { title: "Nom", field: "name" },
                { title: "Email", field: "email" },
                { title: "Tel.", field: "phone" },
                { title: "ID_Org.", field: "org" },
                { title: "Modifier", field: "edit" },
              ]}
              data={[
                {
                  id: "3",
                  name: (
                    <Link to={""} className="aa">
                      {"GroupeLaval"}
                    </Link>
                  ),
                  email: "grlaval@outlook.com",
                  phone: "4502587979",
                  org: "3",
                  edit: (
                    <ul className="nav navbar-nav pull-xs-left">
                      <EditPointServiceSettings pointServiceEmail="grlaval@outlook.com" />
                    </ul>
                  ),
                },
                {
                  id: "5",
                  name: (
                    <Link to={""} className="aa">
                      {"GroupeSutton"}
                    </Link>
                  ),
                  email: "grsutton@outlook.com",
                  phone: "4506258879",
                  org: "3",
                  edit: (
                    <ul className="nav navbar-nav pull-xs-left">
                      <EditPointServiceSettings pointServiceEmail="grsutton@outlook.com" />
                    </ul>
                  ),
                },
                {
                  id: "6",
                  name: (
                    <Link to={""} className="aa">
                      {"SAAQ"}
                    </Link>
                  ),
                  email: "saaq@outlook.com",
                  phone: "4508884848",
                  org: "3",
                  edit: (
                    <ul className="nav navbar-nav pull-xs-left">
                      <EditPointServiceSettings pointServiceEmail="saaq@outlook.com" />
                    </ul>
                  ),
                },
              ]}
              title=""
            />
          </div>
          <hr />
          <div class="floatleft">
            <h5 class="bold">
              Relations: <h7 class="info"> Referents (2)</h7>
            </h5>
          </div>
          <div class="floatright">
            <button className="btn btn-sm btn-info">
              {"  Ajouter / Retirer "}
            </button>
          </div>
          <br />
          <br />
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              icons={tableIcons}
              options={{
                pageSizeOptions: [2, 3, 4, 5, 10],
                headerStyle: {
                  fontSize: "13px",
                  padding: "5px",
                  fontWeight: "bold",
                  backgroundColor: "#5bc0de",
                  color: "#FFF",
                },
                cellStyle: { fontSize: "12px", padding: "5px" },
              }}
              columns={[
                { title: "ID", field: "id" },
                { title: "Nom", field: "name" },
                { title: "Rôle", field: "role" },
                { title: "Tel.", field: "phone" },
                { title: "Email", field: "email" },
              ]}
              data={[
                {
                  id: "1",
                  name: (
                    <Link to={""} className="aa">
                      {"Celine Picard"}
                    </Link>
                  ),
                  role: "Directrice",
                  phone: "4502801999",
                  email: "cpicard@outlook.com",
                },
                {
                  id: "5",
                  name: (
                    <Link to={""} className="aa">
                      {"Evelyne Vezina"}
                    </Link>
                  ),
                  role: "Recruteur",
                  phone: "4502229969",
                  email: "evezina@outlook.com",
                },
              ]}
              title=""
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganismeDetails);
