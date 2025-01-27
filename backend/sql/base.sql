CREATE TABLE experience(
   idExperience INTEGER,
   nom TEXT NOT NULL,
   nombreTache INTEGER NOT NULL,
   option TEXT NOT NULL,
   PRIMARY KEY(idExperience)
);

CREATE TABLE erreur(
   idErreur INTEGER,
   nom TEXT,
   image TEXT,
   tempsDefaut TEXT,
   idExperience INTEGER NOT NULL,
   PRIMARY KEY(idErreur),
   FOREIGN KEY(idExperience) REFERENCES experience(idExperience)
);

CREATE TABLE raquette(
   idRaquette TEXT,
   idErreur INTEGER,
   idExperience INTEGER NOT NULL,
   PRIMARY KEY(idRaquette),
   FOREIGN KEY(idErreur) REFERENCES erreur(idErreur),
   FOREIGN KEY(idExperience) REFERENCES experience(idExperience)
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
   visibiliteKpi TEXT,
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
