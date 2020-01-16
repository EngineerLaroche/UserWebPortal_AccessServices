module.exports = function (db) {
    db.serialize(function () {
        //Creation de la table User
        db.run(
            "CREATE TABLE IF NOT EXISTS `User` (`Id` INTEGER PRIMARY KEY, `Firstname` TEXT, `Lastname` TEXT, `Email` TEXT UNIQUE, `Password` TEXT, 'Role' INTEGER, 'LoginAttempts' INTEGER, 'Active' INTEGER, FOREIGN KEY(Role) REFERENCES Role(Id))"
        );
        //Creation de la table qui stocke les mauvaises tentatives de connexions
        db.run(
            "CREATE TABLE IF NOT EXISTS `BadLoginAttempts` (`Id` INTEGER PRIMARY KEY, `Email` TEXT, 'Date' TEXT)"
        );
        //Creation de la table Role
        db.run(
            "CREATE TABLE IF NOT EXISTS `Role` (`Id` INTEGER PRIMARY KEY, `Title` TEXT)"
        );
        //Creation de la table OrganismeReferent
        db.run(
            "CREATE TABLE IF NOT EXISTS `OrganismeReferent` (`Id` INTEGER PRIMARY KEY, `Name` TEXT, 'Email' TEXT, 'Address' INTEGER, 'Phone' TEXT, 'Fax' TEXT, 'WebSite' TEXT, 'State' INTEGER, 'Organisme' INTEGER, FOREIGN KEY(Address) REFERENCES Address(Id), FOREIGN KEY(Organisme) REFERENCES Organisme(Id))"
        );
        //Creation de la table Organisme
        db.run(
            "CREATE TABLE IF NOT EXISTS `Organisme` (`Id` INTEGER PRIMARY KEY, `Name` TEXT, 'Email' TEXT, 'Address' INTEGER, 'Phone' TEXT, 'Fax' TEXT, FOREIGN KEY(Address) REFERENCES Address(Id))"
        );
        //Creation de la table Address
        db.run(
            "CREATE TABLE IF NOT EXISTS `Address` (`Id` INTEGER PRIMARY KEY, `NoCivique` TEXT, 'Street' TEXT, 'City' TEXT, 'Province' TEXT, 'PostalCode' TEXT)"
        );
        //Creation de la table des preferences de reception de rapport d'un referent
        db.run(
            "CREATE TABLE IF NOT EXISTS `Preference` (`Id` INTEGER PRIMARY KEY, `Type` TEXT)"
        );
        //Creation de la table des association entre preferences de reception rapport et referent
        db.run(
            "CREATE TABLE IF NOT EXISTS `PreferenceReferent` (`Id` INTEGER PRIMARY KEY, `ReferentId` INTEGER, `PreferenceId` INTEGER)"
        );
        //Creation de la table Referent
        db.run(
            "CREATE TABLE IF NOT EXISTS `Referent` (`Id` INTEGER PRIMARY KEY, `Firstname` TEXT, 'Lastname' TEXT, 'Title' TEXT, 'WorkPhone' TEXT, 'CellPhone' TEXT, 'Fax' TEXT, 'Email' TEXT UNIQUE)"
        );
        //Creation de la table d'association des Referent aux OrganismeReferent
        db.run(
            "CREATE TABLE IF NOT EXISTS `ReferentOrganismeReferent` (`Id` INTEGER PRIMARY KEY, `ReferentId` INTEGER, 'OrganismeReferentId' INTEGER, FOREIGN KEY(ReferentId) REFERENCES Referent(Id), FOREIGN KEY(OrganismeReferentId) REFERENCES OrganismeReferent(Id))"
        );




        //Creation de la table PointService
        db.run(
            "CREATE TABLE IF NOT EXISTS `PointService` (`Id` INTEGER PRIMARY KEY, `Name` TEXT, 'Email' TEXT UNIQUE, 'Phone' TEXT, 'Fax' TEXT, 'Nocivique' TEXT, 'Street' TEXT, 'City' TEXT, 'Province' TEXT, 'Postalcode' TEXT)"
        );
        //Creation de la table Service
        db.run(
            "CREATE TABLE IF NOT EXISTS `Service` (`Id` INTEGER PRIMARY KEY, `Name` TEXT UNIQUE, 'Description' TEXT, 'TarifParent' INTEGER, 'TarifCISSS' INTEGER, 'StateSubvention' INTEGER, 'State' INTEGER, 'DatePrice' TEXT)"
        );
        //Creation de la table d'association des Service aux Points de Service
        // db.run(
        //     "CREATE TABLE IF NOT EXISTS `ServicePointService` (`Id` INTEGER PRIMARY KEY, `ServiceId` INTEGER, 'PointServiceId' INTEGER, FOREIGN KEY(ServiceId) REFERENCES Service(Id), FOREIGN KEY(PointServiceId) REFERENCES PointService(Id))"
        // );
        //Ajout d'une association entre Point Service et Service par défaut
        // db.run(
        //     "INSERT INTO SERVICEPOINTSERVICE SELECT 1, 1, 1 WHERE NOT EXISTS (SELECT * FROM ServicePointService) "
        // );




        //Creation de la table famille
        db.run(
            "CREATE TABLE IF NOT EXISTS `Famille` (`Id` INTEGER PRIMARY KEY, `NumeroDossier` TEXT)"
        );
        //Creation de la table de parent
        db.run(
            "CREATE TABLE IF NOT EXISTS `Parent` (`Id` INTEGER PRIMARY KEY, `Firstname` TEXT, 'Lastname' TEXT, 'Phone' TEXT, 'Email' TEXT, 'Address' INTEGER, 'BirthDate' DATE, 'Famille' INTEGER, 'NoteSpecifique' TEXT, 'NoPermisConduire' TEXT, 'NoRAMQ' TEXT, 'ContactUrgence' TEXT, 'CarteIdentite' TEXT, 'Type' INTEGER, FOREIGN KEY(Type) REFERENCES ParentType(Id), FOREIGN KEY(Address) REFERENCES Address(Id), FOREIGN KEY(Famille) REFERENCES Famille(Id))"
        );
        //Creation de la table de type de parent
        db.run(
            "CREATE TABLE IF NOT EXISTS `ParentType` (`Id` INTEGER PRIMARY KEY, `Type` TEXT)"
        );
        //Creation de la table de lien entre parent et referent
        db.run(
            "CREATE TABLE IF NOT EXISTS `LienReferentParent` (`Id` INTEGER PRIMARY KEY, `ReferentId` INTEGER, 'ParentId' INTEGER, FOREIGN KEY(ReferentId) REFERENCES Referent(Id), FOREIGN KEY(ParentId) REFERENCES Parent(Id))"
        );
        //Creation de la table enfant
        db.run(
            "CREATE TABLE IF NOT EXISTS `Enfant` (`Id` INTEGER PRIMARY KEY, `Firstname` TEXT, 'Lastname' TEXT, 'BirthDate' DATE, 'Famille' TEXT, 'Allergies' TEXT, 'NoRAMQ' TEXT, 'Garde' TEXT, FOREIGN KEY(Famille) REFERENCES Famille(NumeroDossier))"
        );
        //Creation de la table de lien entre enfant et referent
        db.run(
            "CREATE TABLE IF NOT EXISTS `LienReferentEnfant` (`Id` INTEGER PRIMARY KEY, `ReferentId` INTEGER, 'EnfantId' INTEGER, FOREIGN KEY(ReferentId) REFERENCES Referent(Id), FOREIGN KEY(EnfantId) REFERENCES Enfant(Id))"
        );
        //Creation de la table transport
        db.run(
            "CREATE TABLE IF NOT EXISTS `Transport` (`Id` INTEGER PRIMARY KEY, `Name` TEXT, 'Phone' TEXT)"
        );
        //Creation de la table transport
        db.run(
            "CREATE TABLE IF NOT EXISTS `TransportService` (`Id` INTEGER PRIMARY KEY, `TransportId` INTEGER, 'ServiceId' INTEGER, FOREIGN KEY(TransportId) REFERENCES Transport(Id), FOREIGN KEY(ServiceId) REFERENCES DemandeDeService(Id))"
        );
        //Creation de la table de demande de service
        db.run(
            "CREATE TABLE IF NOT EXISTS `DemandeDeService` (`Id` INTEGER PRIMARY KEY, `Date` DATE, 'Frequence' TEXT, `Type` INTEGER, 'AssumeFrais' INTEGER, 'Auteur' INTEGER, FOREIGN KEY(AssumeFrais) REFERENCES Parent(Id), FOREIGN KEY(Auteur) REFERENCES Parent(Id))"
        );
        //Creation de la table du role d'un parent dans une demande de service
        db.run(
            "CREATE TABLE IF NOT EXISTS `RoleParentService` (`Id` INTEGER PRIMARY KEY, `ServiceId` DATE, 'ParentId' TEXT, 'Role' INTEGER, FOREIGN KEY(ServiceId) REFERENCES DemandeDeService(Id), FOREIGN KEY(ParentId) REFERENCES Parent(Id))"
        );
        //Creation de la table d'association entre un enfant et une demande de service
        db.run(
            "CREATE TABLE IF NOT EXISTS `EnfantService` (`Id` INTEGER PRIMARY KEY, `ServiceId` DATE, 'EnfantId' TEXT, FOREIGN KEY(ServiceId) REFERENCES DemandeDeService(Id), FOREIGN KEY(EnfantId) REFERENCES Enfant(Id))"
        );
        //Creation de la table des motifs possibles de demande de service
        db.run(
            "CREATE TABLE IF NOT EXISTS `Motif` (`Id` INTEGER PRIMARY KEY, `Type` TEXT)"
        );
        //Creation de la table association des motifs avec un service
        db.run(
            "CREATE TABLE IF NOT EXISTS `ServiceMotif` (`Id` INTEGER PRIMARY KEY, `MotifId` INTEGER, 'ServiceId' INTEGER, FOREIGN KEY(ServiceId) REFERENCES DemandeDeService(Id), FOREIGN KEY(MotifId) REFERENCES Motif(Id))"
        );
        //Creation de la table des disponibilités pour une demande de service
        db.run(
            "CREATE TABLE IF NOT EXISTS `Disponibilite` (`Id` INTEGER PRIMARY KEY, `Date` DATE, 'From' DATE, 'To' DATE, `DemandeServiceId` INTEGER, `ParentId` INTEGER,  FOREIGN KEY(DemandeServiceId) REFERENCES DemandeDeService(Id), FOREIGN KEY(ParentId) REFERENCES Parent(Id))"
        );
        //Ajout d'un point de service par défaut
         db.run(
             "INSERT INTO POINTSERVICE SELECT 1, 'SAQ_Laval', 'saqlaval@outlook.com', '450-284-7985', '450-498-8585', '158', 'Avenue_XIV', 'Laval', 'Quebec', 'J7T3G0' WHERE NOT EXISTS (SELECT * FROM PointService)"
         );
         //Ajout d'un service par défaut
         db.run(
            "INSERT INTO SERVICE SELECT 1, 'Support_TI', 'Mise a niveau des composants informatiques', '120', '25', '0', '0', '01/11/2018' WHERE NOT EXISTS (SELECT * FROM Service)"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 1, 'Abus sexuel' EXCEPT SELECT * FROM Motif WHERE Id=1"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 2, 'Aliénation parentale' EXCEPT SELECT * FROM Motif WHERE Id=2"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 3, 'Compétences parentales' EXCEPT SELECT * FROM Motif WHERE Id=3"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 4, 'Consommation d`alcool' EXCEPT SELECT * FROM Motif WHERE Id=4"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 5, 'Déficience intellectuelle' EXCEPT SELECT * FROM Motif WHERE Id=5"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 6, 'Dénigrement' EXCEPT SELECT * FROM Motif WHERE Id=6"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 7, 'Habiletés parentales' EXCEPT SELECT * FROM Motif WHERE Id=7"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 8, 'Inquiétude' EXCEPT SELECT * FROM Motif WHERE Id=8"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 9, 'Interdit de contact' EXCEPT SELECT * FROM Motif WHERE Id=9"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 10, 'Interdit de contact (entre parents)' EXCEPT SELECT * FROM Motif WHERE Id=10"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 11, 'Menace' EXCEPT SELECT * FROM Motif WHERE Id=11"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 12, 'Menace d`enlèvement de l`enfant' EXCEPT SELECT * FROM Motif WHERE Id=12"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 13, 'Mésentente' EXCEPT SELECT * FROM Motif WHERE Id=13"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 14, 'Négligence' EXCEPT SELECT * FROM Motif WHERE Id=14"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 15, 'Reprise de contact' EXCEPT SELECT * FROM Motif WHERE Id=15"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 16, 'Suspicion d`attouchements' EXCEPT SELECT * FROM Motif WHERE Id=16"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 17, 'Toxicomanie' EXCEPT SELECT * FROM Motif WHERE Id=17"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 18, 'Toubles de santé mentale' EXCEPT SELECT * FROM Motif WHERE Id=18"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 19, 'Violence physique' EXCEPT SELECT * FROM Motif WHERE Id=19"
        );
        //Ajout de motif
        db.run(
            "INSERT INTO MOTIF SELECT 20, 'Violence verbale' EXCEPT SELECT * FROM Motif WHERE Id=20"
        );
        //Ajout du role de directeur
        db.run(
            "INSERT INTO ROLE SELECT 1, 'Directeur' EXCEPT SELECT * FROM Role WHERE Id=1"
        );
        //Ajout du role de coordonateur
        db.run(
            "INSERT INTO ROLE SELECT 2, 'Coordonateur' EXCEPT SELECT * FROM Role WHERE Id=2"
        );
        //Ajout du role d'adjoint-coordonateur
        db.run(
            "INSERT INTO ROLE SELECT 3, 'Adjoint-Coordonateur' EXCEPT SELECT * FROM Role WHERE Id=3"
        );
        //Ajout du role d'intervenant'
        db.run(
            "INSERT INTO ROLE SELECT 4, 'Intervenant' EXCEPT SELECT * FROM Role WHERE Id=4"
        );
        //Ajout de l'utilisateur par défaut
        db.run(
            "INSERT INTO USER SELECT 1, 'Yvan' , 'Ross' , 'yross@gucci.com' , '12345' , '1', '0', '0' WHERE NOT EXISTS (SELECT * FROM User) "
        );
        //Ajout d'une adresse pour l'organisme par défaut
        db.run(
            "INSERT INTO ADDRESS SELECT 1, '4123' , 'Rue des tests',  'Montreal', 'Quebec' , 'h3h 3h3' WHERE NOT EXISTS (SELECT * FROM Address) "
        );
        //Ajout d'un organisme par défaut
        db.run(
            "INSERT INTO ORGANISME SELECT 1, 'Organisme_communaitaire_mtl' , 'organisme_mtl@organisme.com',  '1', '1-800-888-1111' , '454789692231' WHERE NOT EXISTS (SELECT * FROM Organisme)"
        );
        //Ajout d'un organisme referent par défaut
        db.run(
            "INSERT INTO ORGANISMEREFERENT SELECT 1, 'Organisme-Referent Inc.', 'testreferent@organisme.com',  '1', '454729692231', '1-820-888-1111', 'www.testincreferent.com', '0', '1' WHERE NOT EXISTS (SELECT * FROM OrganismeReferent) "
        );
        //Ajout d'un referent par défaut
        db.run(
            "INSERT INTO REFERENT SELECT 1, 'Referent', 'Test',  'Avocat', '454729692231', '1-820-888-1111', '123456789', 'referent@test.com' WHERE NOT EXISTS (SELECT * FROM Referent) "
        );
        //Ajout de la preference de reception rapport Fax
        db.run(
            "INSERT INTO PREFERENCE SELECT 1, 'Fax' EXCEPT SELECT * FROM Preference WHERE Id=1"
        );
        //Ajout de la preference de reception rapport Courriel
        db.run(
            "INSERT INTO PREFERENCE SELECT 2, 'Courriel' EXCEPT SELECT * FROM Preference WHERE Id=2"
        );
        //Ajout de la preference de reception rapport Papier
        db.run(
            "INSERT INTO PREFERENCE SELECT 3, 'Papier' EXCEPT SELECT * FROM Preference WHERE Id=3"
        );
        //Ajout d'une preference de reception rapport pour le referent par defaut
        db.run(
            "INSERT INTO PREFERENCEREFERENT SELECT 1, 1, 1 EXCEPT SELECT * FROM PreferenceReferent WHERE Id=1"
        );
        //Ajout d'une association entre organisme referent et referent par défaut
        db.run(
            "INSERT INTO REFERENTORGANISMEREFERENT SELECT 1, 1, 1 WHERE NOT EXISTS (SELECT * FROM ReferentOrganismeReferent) "
        );
        //Ajout des types de parents
        db.run(
            "INSERT INTO ParentType SELECT 1, 'Gardien' EXCEPT SELECT * FROM ParentType WHERE Id=1"
        );
        //Ajout des types de parents
        db.run(
            "INSERT INTO ParentType SELECT 2, 'Visiteur' EXCEPT SELECT * FROM ParentType WHERE Id=2"
        );
        //Ajout des types de parents
        db.run(
            "INSERT INTO ParentType SELECT 3, 'Tuteur' EXCEPT SELECT * FROM ParentType WHERE Id=3"
        );
        //Ajout des types de parents
        db.run(
            "INSERT INTO ParentType SELECT 4, 'Famille Acceuil' EXCEPT SELECT * FROM ParentType WHERE Id=4"
        );
        //Initialise les tentatives de connexions a 0 pour tous les utilisateurs
        db.run(
            "UPDATE User SET LoginAttempts = 0"
        );
    });
}