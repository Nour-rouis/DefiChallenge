from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table analyse.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyse')
    rows = cursor.fetchall()
    conn.close()
    analyses = []
    for row in rows:
        analyses.append({"idRaquette": row[0], 
                         "idTache": row[1], 
                         "dateDebut": row[2], 
                         "dateFin": row[3], 
                         "isErreur": row[4]})
    return analyses

def get_by_ids(idRaquette, idTache):
    """
    Récupère un enregistrement de la table analyse selon les identifiants spécifiés.
    
    Args:
        idRaquette (int): L'identifiant de la raquette à récupérer.
        idTache (int): L'identifiant de la tâche à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyse WHERE idRaquette = ? AND idTache = ?', 
                   (idRaquette, idTache))
    row = cursor.fetchone()
    conn.close()
    return {"idRaquette": row[0], 
            "idTache": row[1], 
            "dateDebut": row[2], 
            "dateFin": row[3], 
            "isErreur": row[4]}

def create(idRaquette, idTache, dateDebut, dateFin, isErreur):
    """
    Crée un nouvel enregistrement dans la table analyse.
    
    Args:
        idRaquette (int): L'identifiant de la raquette utilisée.
        idTache (int): L'identifiant de la tâche effectuée.
        dateDebut (str): La date de début de l'analyse.
        dateFin (str): La date de fin de l'analyse.
        isErreur (bool): Indique si l'analyse a généré une erreur.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO analyse (idRaquette, idTache, dateDebut, dateFin, isErreur) VALUES (?, ?, ?, ?, ?)', 
                   (idRaquette, idTache, dateDebut, dateFin, isErreur))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvelle Analyse #", id)
    return id

def update(idRaquette, idTache, dateDebut, dateFin, isErreur):
    """
    Met à jour un enregistrement de la table analyse selon les identifiants spécifiés.
    
    Args:
        idRaquette (int): L'identifiant de la raquette utilisée.
        idTache (int): L'identifiant de la tâche effectuée.
        dateDebut (str): La date de début de l'analyse.
        dateFin (str): La date de fin de l'analyse.
        isErreur (bool): Indique si l'analyse a généré une erreur.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE analyse SET dateDebut = ?, dateFin = ?, isErreur = ? WHERE idRaquette = ? AND idTache = ?', 
                   (dateDebut, dateFin, isErreur, idRaquette, idTache))
    conn.commit()
    conn.close()
    print("[DATABASE] Analyse #", idRaquette, idTache, " mise à jour")

def delete(idRaquette, idTache):
    """
    Supprime un enregistrement de la table analyse selon les identifiants spécifiés.
    
    Args:
        idRaquette (int): L'identifiant de la raquette à supprimer.
        idTache (int): L'identifiant de la tâche à supprimer.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM analyse WHERE idRaquette = ? AND idTache = ?', 
                   (idRaquette, idTache))
    conn.commit()
    conn.close()
    print("[DATABASE] Analyse #", idRaquette, idTache, " supprimée")

def get_by_idTache(idTache):
    """
    Récupère tous les enregistrements de la table analyse selon l'identifiant de la tâche spécifié.
    
    Args:
        idTache (int): L'identifiant de la tâche à récupérer.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyse WHERE idTache = ?', 
                   (idTache,))
    rows = cursor.fetchall()
    conn.close()
    analyses = []
    for row in rows:
        analyses.append({"idRaquette": row[0], 
                         "idTache": row[1], 
                         "dateDebut": row[2], 
                         "dateFin": row[3], 
                         "isErreur": row[4]})
    return analyses