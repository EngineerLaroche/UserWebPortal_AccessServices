import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';
import { GET_POINT_SERVICES, POINT_SERVICE_SEARCH } from '../../constants/actionTypes';

const mapStateToProps = state => ({
    pointServices: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({
onLoad: () =>
    dispatch({ type: GET_POINT_SERVICES }),
onSearch: () =>
    dispatch({ type: POINT_SERVICE_SEARCH, payload: this.search})
});

export class ListPointServices extends React.Component {
    constructor(){
        super();
        this.state = {
            search: '',
            pointServices: []
        }
    }

    componentWillMount(){
        var url = "http://localhost:4000/pointServices"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState({'pointServices': data});
        });
    }

    render() {
        const data = this.state.pointServices;

        return (

            <div className="container page">
                    
                <hr/>
                <h1 className="text-xs-center">Liste des Points de Service</h1>
                <hr/>
                <br/>
                <br/>
                
                <div className="row">
                    <div className="col-md-8 offset-md-2 col-xs-12">
                        <div className="text-xs-center">
                        
                        <label>Search by name: </label>
                        <br/>
                        <input type="text" value={this.search}>
                        </input> 
                        <button onClick={this.props.onSearch}>Go</button>
                        </div>
                        <br/>
                        <br/>
                        
                        <div className="text-xs-left">
                        { (data != null) && Object.values(data).map((d) => 
                        <li key={d.Email}>
                            <Link to={"/pointservice/" + d.Email} className="nav-link">
                                {d.Name}
                            </Link>
                            <hr/>
                        </li>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} export default connect(mapStateToProps, mapDispatchToProps)(ListPointServices);