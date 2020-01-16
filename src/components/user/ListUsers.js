import { Link } from "react-router-dom";
import Request from 'superagent';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { GETUSERS, USERSEARCH } from '../../constants/actionTypes';

export const EditProfileSettings = props => {
    if (props.isUser) {
        return (
            <Link to={"/user_edit/" + props.userEmail}>
                <i className="ion-gear-a"> </i>
                <FormattedMessage
                    id="listusers.modify"
                    defaultMessage="Modifier" />
            </Link>
        );
    }
    return null;
};

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    profile: state.profile,
    users: '',
    search: ''
});

const mapDispatchToProps = dispatch => ({
    onLoad: () =>
        dispatch({ type: GETUSERS }),
    onSearch: () =>
        dispatch({ type: USERSEARCH, payload: this.search })
});

export class ListUsers extends React.Component {

    componentWillMount() {
        var url = "http://localhost:4000/users"
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.rows;
            this.setState(data);
        });
    }


    render() {
        const data = this.state;
        const isUser = this.props.currentUser && (this.props.currentUser.role === 1 || this.props.currentUser.role === 2);

        return (

            <div className="container page">

                <hr />
                <h1 className="text-xs-center">
                    <FormattedMessage
                        id="listusers.title"
                        defaultMessage="Liste des Usagers" />
                </h1>
                <hr />
                <br />
                <br />

                <div className="row">
                    <div className="col-md-8 offset-md-2 col-xs-12">
                        <div className="text-xs-center">

                            <label>
                                <FormattedMessage
                                    id="listusers.search"
                                    defaultMessage="Rechercher par email :" />
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
                                    <Link to={"/user/" + d.Email} className="nav-link">
                                        {d.Firstname} {d.Lastname}
                                </Link>
                                <ul className="nav navbar-nav pull-xs-right">
                                    <EditProfileSettings isUser={isUser} userEmail={d.Email}/>
                                </ul>
                                <hr/>
                            </li>
                        )}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
} export default connect(mapStateToProps, mapDispatchToProps)(ListUsers);