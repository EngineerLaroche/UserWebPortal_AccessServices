import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';
import { GETREFERENTS } from '../../constants/actionTypes';

const mapStateToProps = state => ({
    referents: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({
    onLoad: () =>
        dispatch({ type: GETREFERENTS })
});

export class ListReferents extends React.Component {
    constructor() {
        super();
        this.state = {
            search: '',
            referents: []
        }
    }

    searchReferents(query) {
        var url = "http://localhost:4000/referent/search/" + query;
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.returnedReferents;
            this.setState({ 'referents': data });
        });
    }

    componentWillMount() {
        var url = "http://localhost:4000/referents"
        Request.get(url).then((response) => {
            console.log(response.body);

            var data = response.body.referents;

            this.setState({ 'referents': data });
        });
    }

    handleChange(value, param) {
        this.setState({ [param]: value });
    }

    render() {
        var data = this.state.referents;
        var search = this.state.search;

        return (

            <div className="container page">

                <hr />
                <h1 className="text-xs-center">Liste des Référents</h1>
                <hr />
                <br />
                <br />

                <div className="row">
                    <div className="col-md-8 offset-md-2 col-xs-12">
                        <div className="text-xs-center">
                            
                            <label>Search: </label>
                            <br/>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input
                                        type="text"
                                        value={this.search}
                                        onChange={(e) => { this.handleChange(e.target.value, 'search') }} />
                                    <button onClick={() => 
                                        { this.searchReferents(search) }}>Go</button>
                                </fieldset>
                            </fieldset>
                            </div>
                            <br/>
                            <br/>
                            <div className="text-xs-center">
                            {(data != null) && Object.values(data).map((d) =>
                                <li key={d.Email}>
                                    <Link to={"/referent/" + d.Email} className="nav-link">
                                        {d.Firstname} {d.Lastname}
                                    </Link>
                                    <hr/>
                                </li>
                            )}
                            {(data != null && data.length === 0) &&
                                <p>Aucun référent trouvé</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} export default connect(mapStateToProps, mapDispatchToProps)(ListReferents);