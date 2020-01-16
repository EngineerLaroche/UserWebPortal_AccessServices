import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    demandeServices: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({

});

export class ListDemandeService extends React.Component {
    constructor(){
        super();
        this.state = {
            search: '',
            demandeServices: []
        }
    }

    componentWillMount(){
        var url = "http://localhost:4000/demandeServices"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.DemandeServices;
            this.setState({'demandeServices': data});
        });
    }

    render() {
        const data = this.state.demandeServices;
        console.log(data);

        return (

            <div className="container page">
                    
                <hr/>
                <h1 className="text-xs-center">Liste des demandes de service</h1>
                <hr/>
                <br/>
                <br/>
                
                <div className="row">
                    <div className="col-md-8 offset-md-3 col-xs-12">
                        <div className="text-xs-center">
                        
                        {/* <label>Search by email: </label>
                        <br/>
                        <input type="text" value={this.search}>
                        </input> 
                        <button onClick={this.props.onSearch}>Go</button>
                        </div>
                        <br/>
                        <br/> */}
                        </div>
                        <div className="text-xs-left">
                        { (data != null) && Object.values(data).map((d) => 
                        <li key={d.Id}>
                            <Link to={"/demandeService/" + d.Id} className="nav-link">
                                {d.Date}
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
} export default connect(mapStateToProps, mapDispatchToProps)(ListDemandeService);