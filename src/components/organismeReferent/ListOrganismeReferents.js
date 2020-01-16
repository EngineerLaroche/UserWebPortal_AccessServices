import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    organismeReferents: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({

});

export class ListOrganismeReferents extends React.Component {
    constructor(){
        super();
        this.state = {
            search: '',
            organismeReferents: []
        }
    }

    componentWillMount(){
        var url = "http://localhost:4000/organismeReferents"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState({'organismeReferents': data});
        });
    }

    render() {
        const data = this.state.organismeReferents;

        return (

            <div className="container page">
                    
                <hr/>
                <h1 className="text-xs-center">Liste des Organismes Reférents</h1>
                <hr/>
                <br/>
                <br/>
                
                <div className="row">
                    <div className="col-md-8 offset-md-3 col-xs-12">
                        <div className="text-xs-center">
                        
                        <label>Search by email: </label>
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
                            <Link to={"/organismereferent/" + d.Email} className="nav-link">
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
} export default connect(mapStateToProps, mapDispatchToProps)(ListOrganismeReferents);