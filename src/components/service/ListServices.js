import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';
import { GET_SERVICES, SERVICE_SEARCH } from '../../constants/actionTypes';
import { FormattedMessage } from 'react-intl';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const mapStateToProps = state => ({
    services: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({
    onLoad: () =>
        dispatch({ type: GET_SERVICES }),
    onSearch: () =>
        dispatch({ type: SERVICE_SEARCH, payload: this.search })
});

export class ListServices extends React.Component {
    constructor(){
        super();
        this.state = {
            search: '',
            services: [],
            columnDefs: [
                { headerName: 'Name', field: 'name' },
                { headerName: 'Description', field: 'description' },
                { headerName: 'Tarif Parent', field: 'tarifParent' },
                { headerName: 'Tarif CISSS', field: 'tarifCISSS' },
                { headerName: 'Tarif Subvention', field: 'stateSubvention' },
                { headerName: 'State', field: 'state' },
                { headerName: 'Date Vigueur', field: 'datePrice' }

            ],
            rowData: []
        }
    }

    componentWillMount() {
        var url = "http://localhost:4000/services"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState({ 'services': data });
            data = this.state.services;
        });
    }

    render() {
        const data = this.state.services;

        return (

            <div className="container page">

                <hr />
                <h1 className="text-xs-center">
                    <FormattedMessage
                        id="listservices.title"
                        defaultMessage="Liste des Services" />
                </h1>
                <hr />
                <br />
                <br />

                <div className="row">
                    <div className="col-md-8 offset-md-2 col-xs-12">
                        <div className="text-xs-center">

                            <label>
                                <FormattedMessage
                                    id="listorganismes.search"
                                    defaultMessage="Search by name :" />
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
                                <li key={d.Name}>
                                    <Link to={"/service/" + d.Name} className="nav-link">
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
} export default connect(mapStateToProps, mapDispatchToProps)(ListServices);