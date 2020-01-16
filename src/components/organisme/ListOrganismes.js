import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { GETORGANISMES, ORGANISMESEARCH } from '../../constants/actionTypes';

const mapStateToProps = state => ({
    organismes: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({
    onLoad: () =>
        dispatch({ type: GETORGANISMES }),
    onSearch: () =>
        dispatch({ type: ORGANISMESEARCH, payload: this.search })
});
export class ListOrganismes extends React.Component {
    constructor(){
        super();
        this.state = {
            search: '',
            organismes: []
        }
    }

    componentWillMount() {
        var url = "http://localhost:4000/organismes"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState({ 'organismes': data });
        });

    }

    render() {
        const data = this.state.organismes;

        return (

            <div className="container page">

                <hr />
                <h1 className="text-xs-center">
                    <FormattedMessage
                        id="listorganismes.title"
                        defaultMessage="Liste des Organismes" />
                </h1>
                <hr />
                <br />
                <br />

                <div className="row">
                    <div className="col-md-8 offset-md-3 col-xs-12">
                        <div className="text-xs-center">

                            <label>
                                <FormattedMessage
                                    id="listorganismes.search"
                                    defaultMessage="Rechercher par nom :" />
                            </label>
                            <br />
                            <input type="text" value={this.search}>
                            </input>
                            <button onClick={this.props.onSearch}>Go</button>
                        </div>
                        <br />
                        <br />

                        <div className="text-xs-left">
                            {(data != null) && Object.values(data).map((d) =>
                                <li key={d.Email}>
                                    <Link to={"/organisme/" + d.Email} className="nav-link">
                                        {d.Name}
                                    </Link>
                                    <hr />
                                </li>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} export default connect(mapStateToProps, mapDispatchToProps)(ListOrganismes);