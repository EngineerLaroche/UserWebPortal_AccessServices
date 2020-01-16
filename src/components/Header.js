import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import agent from '../agent';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import {
    CREATE_DEMANDE_SERVICE,
    LOCALE_SET,
    LOGOUT,
} from "../constants/actionTypes";

const mapDispatchToProps = dispatch => ({
    setLocale: (lang) => {
        window.localStorage.setItem('chosenLanguage', lang);
        dispatch({ type: LOCALE_SET, payload: lang });
    },
    onClickLogout: () => dispatch({ type: LOGOUT, payload: agent.Auth.logout() })
});

const IntlDropDown = props => {
    return (
        <select
            className="nav-link form-control"
            onChange={props.setLang}
            value={props.lang}
        >
            <option value="fr">Francais</option>
            <option value="en">English</option>
        </select>
    );
};

const LoggedOutView = props => {
    if (!props.currentUser) {
        return (
            <ul className="nav navbar-nav pull-xs-right">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <FormattedMessage
                            id="header.homepage"
                            defaultMessage="Accueil" />
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <FormattedMessage
                            id="header.login"
                            defaultMessage="Connexion" />
                    </Link>
                </li>
                <li className="nav-item">
                    <IntlDropDown lang={props.lang} setLang={props.setLang} />
                </li>
            </ul>
        );
    }
    return null;
};
const LoggedInView = props => {

    if (props.currentUser) {
        return (

            <ul className="nav navbar-nav pull-xs-right">
                <li className="nav-item">
                    <NavDropdown title={props.display} id="basic-nav-dropdown">
                        <MenuItem href="/users">
                            <FormattedMessage
                                id="show.user"
                                defaultMessage="Usager" />
                        </MenuItem>
                        <MenuItem href="/referents">
                            <FormattedMessage
                                id="show.referents"
                                defaultMessage="Référents" />
                        </MenuItem>
                        <MenuItem href="/organismereferents">
                            <FormattedMessage
                                id="show.organismereferents"
                                defaultMessage="Organismes Référents" />
                        </MenuItem>
                        <MenuItem href="/organismes">
                            <FormattedMessage
                                id="show.organismes"
                                defaultMessage="Organismes" />
                        </MenuItem>
                        <MenuItem href="/services">
                            <FormattedMessage
                                id="show.services"
                                defaultMessage="Services" />
                        </MenuItem>
                        <MenuItem href="/pointservices">
                            <FormattedMessage
                                id="show.pointservices"
                                defaultMessage="Points de services" />
                        </MenuItem>
                        <MenuItem href="/demandeServices">
                            <FormattedMessage
                                id="show.demandeservices"
                                defaultMessage="Demande de services" />
                        </MenuItem>
                    </NavDropdown>
                </li>

                {(props.userRole === '1' || props.userRole === '2') &&
                    <li className="nav-item">
                        <NavDropdown title={props.create} id="basic-nav-dropdown">
                            <MenuItem href="/user/register">
                                <FormattedMessage
                                    id="show.user"
                                    defaultMessage="Usager" />
                            </MenuItem>
                            <MenuItem href="/referent/register">
                                <FormattedMessage
                                    id="show.referents"
                                    defaultMessage="Référents" />
                            </MenuItem>
                            <MenuItem href="/organismereferent/create">
                                <FormattedMessage
                                    id="show.organismereferents"
                                    defaultMessage="Organismes Référents" />
                            </MenuItem>
                            <MenuItem href="/organisme/create">
                                <FormattedMessage
                                    id="show.organismes"
                                    defaultMessage="Organismes" />
                            </MenuItem>
                            <MenuItem href="/service/create">
                                <FormattedMessage
                                    id="show.services"
                                    defaultMessage="Services" />
                            </MenuItem>
                            <MenuItem href="/pointService/create">
                                <FormattedMessage
                                    id="show.pointservices"
                                    defaultMessage="Points de services" />
                            </MenuItem>
                            <MenuItem href="/demandeService/create">
                                <FormattedMessage
                                    id="show.demandeservices"
                                    defaultMessage="Demande de services" />
                            </MenuItem>
                        </NavDropdown>
                    </li>}

                {props.userRole === '4' &&
                    <li className="nav-item">
                        <NavDropdown title={props.create} id="basic-nav-dropdown">
                            <MenuItem href="/referent/register">
                                <FormattedMessage
                                    id="show.referents"
                                    defaultMessage="Référents" />
                            </MenuItem>
                            <MenuItem href="/service/create">
                                <FormattedMessage
                                    id="show.services"
                                    defaultMessage="Services" />
                            </MenuItem>
                            <MenuItem href="/demandeService/create">
                                <FormattedMessage
                                    id="show.demandeservices"
                                    defaultMessage="Demande de services" />
                            </MenuItem>
                        </NavDropdown>
                    </li>}

                <li className="nav-item">
                    <a href="/Profile" class="btn btn-outline-success" role="button">
                        <FormattedMessage
                            id="header.profile"
                            defaultMessage="Mon profil" />
                    </a>
                </li>

                <li className="nav-item">
                    <IntlDropDown lang={props.lang} setLang={props.setLang} />
                </li>
                
                <li className="nav-item">
                    <button className="btn btn-outline-warning" onClick={props.onClickLogout}>
                        <FormattedMessage
                            id="header.logout"
                            defaultMessage="Deconnexion" />
                    </button>
                </li>
            </ul>
        );
    }
    return null;
};

class Header extends React.Component {
    constructor() {
        super();
        this.setLang = ev => this.props.setLocale(ev.target.value);
        this.userRole = localStorage.getItem('role');
    }
    render() {
        const intl = this.props.intl;
        return (
            <nav className="navbar navbar-light">
                <div className="container">
                    <br />

                    <Link to="/" className="navbar-brand">
                        {this.props.appName}
                    </Link>

                    <LoggedOutView currentUser={this.props.currentUser} setLang={this.setLang}
                        lang={this.props.lang} />
                    <LoggedInView currentUser={this.props.currentUser}
                        setLang={this.setLang}
                        lang={this.props.lang}
                        onClickLogout={this.props.onClickLogout}
                        userRole={this.userRole}
                        display={intl.formatMessage({ id: "header.display", defaultMessage: "Afficher" })}
                        create={intl.formatMessage({ id: "header.create", defaultMessage: "Créer" })}
                    />
                </div>
            </nav>
        );
    }
}

Header.propTypes = {
    intl: intlShape.isRequired
};
Header = injectIntl(Header);

export default connect(null, mapDispatchToProps)(Header);