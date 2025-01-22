CREATE TABLE raquette(
   idRaquette TEXT,
   nomErreur TEXT,
   imageErreur TEXT,
   PRIMARY KEY(idRaquette)
);

CREATE TABLE experience(
   idExperience INTEGER,
   nom TEXT NOT NULL,
   nombreRaquette INTEGER NOT NULL,
   nombreTache INTEGER NOT NULL,
   PRIMARY KEY(idExperience)
);

CREATE TABLE operateur(
   idOperateur TEXT,
   nom TEXT NOT NULL,
   prenom TEXT NOT NULL,
   nivExp INTEGER NOT NULL,
   idExperience INTEGER NOT NULL,
   PRIMARY KEY(idOperateur),
   FOREIGN KEY(idExperience) REFERENCES experience(idExperience)
);

CREATE TABLE tache(
   idTache INTEGER,
   iaPourcentage INTEGER NOT NULL,
   idOperateur TEXT NOT NULL,
   PRIMARY KEY(idTache),
   FOREIGN KEY(idOperateur) REFERENCES operateur(idOperateur)
);

CREATE TABLE analyse(
   idRaquette TEXT,
   idTache INTEGER,
   dateDebut NUMERIC NOT NULL,
   dateFin NUMERIC NOT NULL,
   isErreur NUMERIC NOT NULL,
   PRIMARY KEY(idRaquette, idTache),
   FOREIGN KEY(idRaquette) REFERENCES raquette(idRaquette),
   FOREIGN KEY(idTache) REFERENCES tache(idTache)
);

CREATE TABLE listeRaquette(
   idRaquette TEXT,
   idExperience INTEGER,
   PRIMARY KEY(idRaquette, idExperience),
   FOREIGN KEY(idRaquette) REFERENCES raquette(idRaquette),
   FOREIGN KEY(idExperience) REFERENCES experience(idExperience)
);
