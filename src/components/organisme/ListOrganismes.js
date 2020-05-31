import { Link } from "react-router-dom";
import Request from "superagent";
import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { GETORGANISMES, ORGANISMESEARCH } from "../../constants/actionTypes";
import { tableIcons } from "../../utils";
import MaterialTable from "material-table";

// Redirige vers la page qui permet de modifier les parametres d'un Organisme
export const EditOrganismeSettings = (props) => {
  return (
    <Link to={"/organisme/edit/" + props.organismeEmail}>
      <div class="aa">
        <i className="ion-gear-a"> </i>
        <FormattedMessage
          id="listorganismes.modify"
          defaultMessage="Modifier"
        />
      </div>
    </Link>
  );
};

const mapStateToProps = (state) => ({
  organismes: "",
  search: "",
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch({ type: GETORGANISMES }),
  onSearch: () => dispatch({ type: ORGANISMESEARCH, payload: this.search }),
});

export class ListOrganismes extends React.Component {
  constructor() {
    super();
    this.state = {
      search: "",
      organismes: [],
    };
  }

  componentWillMount() {
    var url = "http://localhost:4000/organismes";
    Request.get(url).then((response) => {
      console.log(response.body);
      var data = response.body.rows;
      this.setState({ organismes: data });
    });
  }

  render() {
    const dataOrganismes = this.state.organismes;
    var allOrganismes = [];

    {
      // Insertion des donnees de chq organisme dans une liste
      dataOrganismes != null &&
        Object.values(dataOrganismes).map((d) =>
          allOrganismes.push({
            id: d.Id,
            name: (
              <Link to={"/organisme/" + d.Email} className="nav-link">
                <div class="aa">{d.Name}</div>
              </Link>
            ),
            email: d.Email,
            phone: d.Phone,
            add:
              d.NoCivique + " " + d.Street + ", " + d.City + ", " + d.Province,
            edit: (
              <ul className="nav navbar-nav pull-xs-right">
                <EditOrganismeSettings organismeEmail={d.Email} />
              </ul>
            ),
          })
        );
    }

    return (
      <div>
        <h2 className="text-xs-center">
          <div class="titlecolor">
            <FormattedMessage
              id="listorganismes.title"
              defaultMessage="Repertoire des Organismes"
            />
          </div>
        </h2>
        <br />
        <div class="searchcenter">
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              icons={tableIcons}
              options={{
                pageSizeOptions: [2, 3, 4, 5, 10],
                headerStyle: {
                  fontSize: "13px",
                  padding: "10px",
                  fontWeight: "bold",
                },
                cellStyle: { fontSize: "12px" },
              }}
              columns={[
                { title: "ID", field: "id" },
                { title: "Nom", field: "name" },
                { title: "Email", field: "email" },
                { title: "Tel.", field: "phone" },
                { title: "Adresse", field: "add" },
                { title: "Modifier", field: "edit" },
              ]}
              data={allOrganismes}
              title=""
            />
          </div>
        </div>
        <br/>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListOrganismes);
