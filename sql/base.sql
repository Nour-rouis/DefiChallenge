CREATE TABLE raquette(
   idRaquette VARCHAR(50),
   nomErreur VARCHAR(50),
   imageErreur TEXT,
   PRIMARY KEY(idRaquette)
);

CREATE TABLE Experience(
   idExperience COUNTER,
   nom TEXT NOT NULL,
   nombreRaquette INT NOT NULL,
   nombreTache INT NOT NULL,
   PRIMARY KEY(idExperience)
);

CREATE TABLE operateur(
   idOperateur VARCHAR(50),
   nom VARCHAR(50) NOT NULL,
   prenom VARCHAR(50) NOT NULL,
   nivExp INT NOT NULL,
   idExperience INT NOT NULL,
   PRIMARY KEY(idOperateur),
   FOREIGN KEY(idExperience) REFERENCES Experience(idExperience)
);

CREATE TABLE tache(
   idTache COUNTER,
   iaPourcentage INT NOT NULL,
   idOperateur VARCHAR(50) NOT NULL,
   PRIMARY KEY(idTache),
   FOREIGN KEY(idOperateur) REFERENCES operateur(idOperateur)
);

CREATE TABLE analyse(
   idRaquette VARCHAR(50),
   idTache INT,
   dateDebut DATETIME NOT NULL,
   dateFin DATETIME NOT NULL,
   isErreur LOGICAL NOT NULL,
   PRIMARY KEY(idRaquette, idTache),
   FOREIGN KEY(idRaquette) REFERENCES raquette(idRaquette),
   FOREIGN KEY(idTache) REFERENCES tache(idTache)
);

CREATE TABLE listeRaquette(
   idRaquette VARCHAR(50),
   idExperience INT,
   PRIMARY KEY(idRaquette, idExperience),
   FOREIGN KEY(idRaquette) REFERENCES raquette(idRaquette),
   FOREIGN KEY(idExperience) REFERENCES Experience(idExperience)
);
