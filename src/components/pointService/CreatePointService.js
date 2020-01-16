import ListErrors from '../ListErrors';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

import {
    UPDATE_FIELD_AUTH,
    CREATE_POINT_SERVICE,
    REGISTER_PAGE_UNLOADED
} from '../../constants/actionTypes';

 const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeName: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'name', value }),
    onChangeEmail: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
    onChangePhone: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'phone', value }),
    onChangeFax: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'fax', value }),
    onChangeNocivique: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'nocivique', value }),
    onChangeStreet: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'street', value }),
    onChangeCity: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'city', value }),
    onChangeProvince: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'province', value }),
    onChangePostalcode: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'postalcode', value }),
    onSubmit: (name, email, phone, fax, nocivique, street, city, province, postalcode) => {
        const payload = agent.PointService.register(name, email, phone, fax, nocivique, street, city, province, postalcode);
        dispatch({ type: CREATE_POINT_SERVICE, payload })
    },
    onUnload: () =>
        dispatch({ type: REGISTER_PAGE_UNLOADED })
});

export class CreatePointService extends React.Component {
    constructor() {
        super();
        this.changeName = ev => this.props.onChangeName(ev.target.value);
        this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
        this.changePhone = ev => this.props.onChangePhone(ev.target.value);  
        this.changeFax = ev => this.props.onChangeFax(ev.target.value);
        this.changeNocivique = ev => this.props.onChangeNocivique(ev.target.value);
        this.changeCity = ev => this.props.onChangeCity(ev.target.value);
        this.changeStreet = ev => this.props.onChangeStreet(ev.target.value);
        this.changeProvince = ev => this.props.onChangeProvince(ev.target.value);
        this.changePostalcode = ev => this.props.onChangePostalcode(ev.target.value);    
        this.submitForm = (name, email, phone, fax, nocivique, street, city, province, postalcode) => 
        ev => {
            ev.preventDefault();
            this.props.onSubmit(name, email, phone, fax, nocivique, street, city, province, postalcode);
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    // componentWillMount() {
    //     var url = "http://localhost:4000/pointServices"
    //     Request.get(url).then((response) => {
    //         console.log(response.body);
    //         var data = response.body.rows;
    //         this.setState(data);
    //     });
    // }

    render() {

        const name = this.props.name;
        const email = this.props.email;
        const phone = this.props.phone;      
        const fax = this.props.fax;
        const nocivique = this.props.nocivique;
        const street = this.props.street;
        const city = this.props.city;
        const province = this.props.province;
        const postalcode = this.props.postalcode;

        return (
            <div className="auth-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">Créer Point de Service</h1>
                    <hr />
                    <br />
                    <br />

                    <ListErrors errors={this.props.errors} />

                    <div className="row">
                        <div className="col-md-8 offset-md-2 col-xs-12">
                            <form onSubmit={this.submitForm(name, email, phone, fax, nocivique, street, city, province, postalcode).bind(this)}>
                            <h3 className="text-xs-center">Information</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Nom"
                                            value={this.props.name}
                                            onChange={this.changeName} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Email"
                                            value={this.props.email}
                                            onChange={this.changeEmail} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Téléphone"
                                            value={this.props.phone}
                                            onChange={this.changePhone} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Fax"
                                            value={this.props.fax}
                                            onChange={this.changeFax} />
                                    </fieldset>
                                </fieldset>
                                <h3 className="text-xs-center">Adresse</h3>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Numero civique"
                                            value={this.props.nocivique}
                                            onChange={this.changeNocivique} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Street"
                                            value={this.props.street}
                                            onChange={this.changeStreet} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="City"
                                            value={this.props.city}
                                            onChange={this.changeCity} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Province"
                                            value={this.props.province}
                                            onChange={this.changeProvince} />
                                    </fieldset>
                                </fieldset>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Code postal"
                                            value={this.props.postalcode}
                                            onChange={this.changePostalcode} />
                                    </fieldset>
                                </fieldset>
                                <br/>
                                <div className="text-xs-center">
                                <button
                                    className="btn btn-lg btn-primary btn-block"
                                    type="submit"
                                    disabled={this.props.inProgress}>
                                    Créer Point Service
                                </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePointService);
