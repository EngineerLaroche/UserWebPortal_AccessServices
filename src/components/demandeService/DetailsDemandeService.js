import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Request from 'superagent';


const EditDemandeServiceDetails = props => {
    return (
        <div>
            {props.editRights &&
                <Link to={"/demandeService/edit/" + props.currentDemandeService.Id} className="btn btn-primary">
                    <i className="ion-gear-a"> </i>
                    Modifier Demande de service
                </Link>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    currentDemandeService: state.common.currentDemandeService,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({});

export class DetailsDemandeService extends React.Component {

    constructor() {
        super();
        this.state = {
            currentDemandeService: ''
        }
    }

    componentWillMount() {
        var url = "http://localhost:4000/demandeservice/" + this.props.match.params.id;
        Request.get(url).then((response) => {
            console.log(response.body);
            var data = response.body.DemandeDeService;
            this.setState({ 'currentDemandeService': data });
        });
    }

    render() {
        var disposFirstParent = [];
        var disposSecondParent = [];
        var editRights = true;
        const currentDemandeService = this.state.currentDemandeService;
        if (!currentDemandeService) {
            return null;
        }
        var typeText = "";
        switch (currentDemandeService.ServiceType) {
            case 1:
                typeText = "Visite supervisée";
                break;
            case 2:
                typeText = "Conversation téléphonique supervisée";
                break;
            case 3:
                typeText = "Échange de garde supervisé";
                break;
        }
        var FirstParentTypeText = "";
        var SecondParentTypeText = "Non défini";
        switch (currentDemandeService.FirstParent.Type) {
            case 1:
                FirstParentTypeText = "Parent gardien";
                break;
            case 2:
                FirstParentTypeText = "Parent visiteur";
                break;
            case 3:
                FirstParentTypeText = "Tuteur";
                break;
            case 4:
                FirstParentTypeText = "Famille Accueil";
                break;
        }
        switch (currentDemandeService.SecondParent.Type) {
            case 1:
                SecondParentTypeText = "Parent gardien";
                break;
            case 2:
                SecondParentTypeText = "Parent visiteur";
                break;
            case 3:
                SecondParentTypeText = "Tuteur";
                break;
            case 4:
                SecondParentTypeText = "Famille Accueil";
                break;
        }

        var firstParentAvocatsText = "";
        var secondParentAvocatsText = "";
        if (typeof currentDemandeService.FirstParentAvocats != 'undefined') {
            for (var j = 0; j < currentDemandeService.FirstParentAvocats.length; j++) {
                firstParentAvocatsText += currentDemandeService.FirstParentAvocats[j].Firstname + " " + currentDemandeService.FirstParentAvocats[j].Lastname + ", ";
            }
            firstParentAvocatsText = firstParentAvocatsText.slice(0, firstParentAvocatsText.length - 2)
        }

        if(typeof currentDemandeService.SecondParentAvocats != 'undefined')
        for (var j = 0; j < currentDemandeService.SecondParentAvocats.length; j++) {
            secondParentAvocatsText += currentDemandeService.SecondParentAvocats[j].Firstname + " " + currentDemandeService.SecondParentAvocats[j].Lastname + ", ";
        }
        secondParentAvocatsText = secondParentAvocatsText.slice(0, secondParentAvocatsText.length - 2)

        var motifsText = "";
        for (var i = 0; i < currentDemandeService.Motifs.length; i++) {
            motifsText += currentDemandeService.Motifs[i].Type + ", ";
        }
        motifsText = motifsText.slice(0, motifsText.length - 2);

        if (this.props.currentUser != null) {
            editRights = true;
        }

        if (this.state != null && this.state.currentDemandeService != null && this.state.currentDemandeService.FirstParentDispos != null) {
            Object.values(this.state.currentDemandeService.FirstParentDispos).map((d) =>
                disposFirstParent.push({ value: d.Date, label: d.Date.toString() + ", from: " + d.From + " to: " + d.To })
            );
        }

        if (this.state != null && this.state.currentDemandeService != null && this.state.currentDemandeService.SecondParentDispos != null) {
            Object.values(this.state.currentDemandeService.SecondParentDispos).map((d) =>
                disposSecondParent.push({ value: d.Date, label: d.Date.toString() + ", from: " + d.From + " to: " + d.To })
            );
        }

        return (

            <div className="profile-page">
                <div className="container page">

                    <hr />
                    <h1 className="text-xs-center">Details de la demande de service</h1>
                    <hr />
                    <br />
                    <div className="container">
                        <div className="row">
                            <div className="text-xs-left">
                                <div class="row">
                                    <h2 className="text-xs-center"><b>Type de demande: </b>{typeText}</h2>
                                </div>
                                <div class="row">
                                    <h2 className="text-xs-center"><b>Motif(s) de la demande: </b>{motifsText}</h2>
                                </div>
                                <div class="row">
                                    <h3 className="text-xs-center"><b>Frequence:</b> {currentDemandeService.Frequence}</h3>
                                    <h3 className="text-xs-center"><b>Dossier famille:</b> {currentDemandeService.Famille.NumeroDossier}</h3>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-md-4 form-group">
                                        <h2 className="text-xs-center">Enfants</h2>
                                        <ul className="list-group text-center">
                                            {(currentDemandeService.Enfants != null) &&
                                                Object.keys(currentDemandeService.Enfants).map(function (key) {
                                                    return (
                                                        <li>
                                                            <div>
                                                                <h4><b>Nom:</b> {currentDemandeService.Enfants[key].Firstname + " " + currentDemandeService.Enfants[key].Lastname}</h4>
                                                                <h4><b>Allergies:</b> {currentDemandeService.Enfants[key].Allergies}</h4>
                                                                <h4><b>Gardien actuel:</b> {currentDemandeService.Enfants[key].Garde}</h4>
                                                            </div>
                                                        </li>)
                                                }.bind(this))
                                            }
                                        </ul>
                                        <br />
                                        <h2 className="text-xs-center">Transport</h2>
                                        <fieldset className="form-group">
                                            <b>Nom:</b> {currentDemandeService.Transport.Name}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Telephone:</b> {currentDemandeService.Transport.Phone}
                                        </fieldset>
                                    </div>
                                    <div class="col-md-4 form-group">
                                        <h2 className="text-xs-center">Infos {FirstParentTypeText}</h2>
                                        <fieldset className="form-group">
                                            <b>Nom:</b> {currentDemandeService.FirstParent.Firstname} {currentDemandeService.FirstParent.Lastname}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Date de naissance:</b> {currentDemandeService.FirstParent.BirthDate}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Telephone:</b> {currentDemandeService.FirstParent.Phone}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Email:</b> {currentDemandeService.FirstParent.Email}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Numero permis de conduire:</b> {currentDemandeService.FirstParent.NoPermisConduire}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Numero RAMQ:</b> {currentDemandeService.FirstParent.NoRAMQ}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Contact en cas d'urgence:</b> {currentDemandeService.FirstParent.ContactUrgence}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Avocat(s):</b> {firstParentAvocatsText}
                                        </fieldset>
                                        <h2 className="text-xs-center">Adresse</h2>
                                        <fieldset className="form-group">
                                            <b>Numero civique:</b> {currentDemandeService.FirstParentAddress.NoCivique}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Rue:</b> {currentDemandeService.FirstParentAddress.Street}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Ville:</b> {currentDemandeService.FirstParentAddress.City}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Province:</b> {currentDemandeService.FirstParentAddress.Province}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Code postale:</b> {currentDemandeService.FirstParentAddress.PostalCode}
                                        </fieldset>
                                        <h2 className="text-xs-center">Dispos Premier parent</h2>
                                        <ul className="list-group text-center">
                                            {(disposFirstParent != null) &&
                                                Object.keys(disposFirstParent).map(function (key) {
                                                    return <li className="list-group-item list-group-item-info">{disposFirstParent[key].label}</li>
                                                }.bind(this))
                                            }
                                        </ul>
                                    </div>
                                    <div class="col-md-4 form-group">
                                        <h2 className="text-xs-center">Infos {SecondParentTypeText}</h2>
                                        <fieldset className="form-group">
                                            <b>Nom:</b> {currentDemandeService.SecondParent.Firstname} {currentDemandeService.SecondParent.Lastname}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Date de naissance:</b> {currentDemandeService.SecondParent.BirthDate}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Telephone:</b> {currentDemandeService.SecondParent.Phone}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Email:</b> {currentDemandeService.SecondParent.Email}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Numero permis de conduire:</b> {currentDemandeService.SecondParent.NoPermisConduire}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Numero RAMQ:</b> {currentDemandeService.SecondParent.NoRAMQ}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Contact en cas d'urgence:</b> {currentDemandeService.SecondParent.ContactUrgence}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Avocat(s):</b> {secondParentAvocatsText}
                                        </fieldset>
                                        <h2 className="text-xs-center">Adresse</h2>
                                        <fieldset className="form-group">
                                            <b>Numero civique:</b> {currentDemandeService.SecondParentAddress.NoCivique}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Rue:</b> {currentDemandeService.SecondParentAddress.Street}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Ville:</b> {currentDemandeService.SecondParentAddress.City}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Province:</b> {currentDemandeService.SecondParentAddress.Province}
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <b>Code postale:</b> {currentDemandeService.SecondParentAddress.PostalCode}
                                        </fieldset>
                                        <h2 className="text-xs-center">Dispos Second parent</h2>
                                        <ul className="list-group text-center">
                                            {(disposSecondParent != null) &&
                                                Object.keys(disposSecondParent).map(function (key) {
                                                    return <li className="list-group-item list-group-item-info">{disposSecondParent[key].label}</li>
                                                }.bind(this))
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <br />
                                <EditDemandeServiceDetails editRights={editRights}
                                    currentDemandeService={currentDemandeService} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDemandeService);