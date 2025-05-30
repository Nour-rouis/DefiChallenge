from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table tache.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tache')
    rows = cursor.fetchall()
    conn.close()
    taches = []
    for row in rows:
        taches.append({"idTache": row[0], 
                       "numTache": row[1],
                       "iaNbErreurDetecte": row[2],
                       "visibiliteKpi": row[3], 
                       "idOperateur": row[4]})
    return taches

def get_by_id(id):
    """
    Récupère un enregistrement de la table tache selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tache WHERE idTache = ?', 
                   (id,))
    row = cursor.fetchone()
    conn.close()
    return {"idTache": row[0], 
            "numTache": row[1],
            "iaNbErreurDetecte": row[2], 
            "visibiliteKpi": row[3],
            "idOperateur": row[4]}

def create(iaNbErreurDetecte, visibiliteKpi, idOperateur):
    """
    Crée un nouvel enregistrement dans la table tache.
    
    Args:
        iaPourcentage (int): Le pourcentage de réussite de l'IA pour la tâche.
        idOperateur (int): L'identifiant de l'opérateur de la tâche.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    count = count_by_idOperateur(idOperateur)
    count += 1

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tache (numTache, iaNbErreurDetecte, visibiliteKpi, idOperateur) VALUES (?, ?, ?, ?)', 
                   (count, iaNbErreurDetecte, visibiliteKpi, idOperateur))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvelle Tache #", id)
    return id

def update(id, numTache, iaNbErreurDetecte, visibiliteKpi, idOperateur):
    """
    Met à jour un enregistrement de la table tache selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à mettre à jour.
        iaPourcentage (int): Le pourcentage de réussite de l'IA pour la tâche.
        idOperateur (int): L'identifiant de l'opérateur de la tâche.
    
    Returns:
        bool: True si la mise à jour a réussi, False sinon.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE tache SET numTache = ?, iaNbErreurDetecte = ?, visibiliteKpi = ?, idOperateur = ? WHERE idTache = ?', 
                   (numTache, iaNbErreurDetecte, visibiliteKpi, idOperateur, id))
    conn.commit()
    conn.close()
    return True

def delete(id):
    """
    Supprime un enregistrement de la table tache selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à supprimer.
    
    Returns:
        bool: True si la suppression a réussi, False sinon.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tache WHERE idTache = ?', 
                   (id,))
    conn.commit()
    conn.close()
    return True

def get_by_idOperateur(idOperateur):
    """
    Récupère tous les enregistrements de la table tache selon l'identifiant de l'opérateur spécifié.
    
    Args:
        idOperateur (int): L'identifiant de l'opérateur.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tache WHERE idOperateur = ?', 
                   (idOperateur,))
    rows = cursor.fetchall()
    conn.close()
    taches = []
    for row in rows:
        taches.append({"idTache": row[0], 
                       "numTache": row[1],
                       "iaNbErreurDetecte": row[2], 
                       "visibiliteKpi": row[3],
                       "idOperateur": row[4]})
    return taches

def count_by_idOperateur(idOperateur):
    """
    Compte le nombre d'enregistrements de la table tache selon l'identifiant de l'opérateur spécifié.
    
    Args:
        idOperateur (int): L'identifiant de l'opérateur.
    
    Returns:
        int: Le nombre d'enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM tache WHERE idOperateur = ?', 
                   (idOperateur,))
    row = cursor.fetchone()
    conn.close()
    return row[0]

def get_by_idExperience(idExperience):
    """
    Récupère tous les enregistrements de la table tache selon l'identifiant de l'expérience spécifié.
    
    Args:
        idExperience (int): L'identifiant de l'expérience.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT t.* FROM tache t JOIN operateur o ON t.idOperateur = o.idOperateur WHERE o.idExperience = ?', 
                   (idExperience,))
    rows = cursor.fetchall()
    conn.close()
    taches = []
    for row in rows:
        taches.append({"idTache": row[0], 
                       "numTache": row[1],
                       "iaNbErreurDetecte": row[2],
                       "visibiliteKpi": row[3],
                       "idOperateur": row[4]})
    return taches

def get_raquettes_restantes(idTache):
    """
    Récupère toutes les raquettes restantes pour une tâche spécifiée.
    
    Args:
        idTache (int): L'identifiant de la tâche.
    
    Returns:
        list: Une liste de dictionnaires représentant les raquettes restantes.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT r.* FROM raquette r WHERE r.idRaquette NOT IN (SELECT a.idRaquette FROM analyse a WHERE a.idTache = ?)', 
                   (idTache,))
    rows = cursor.fetchall()
    conn.close()
    raquettes = []
    for row in rows:
        raquettes.append({"idRaquette": row[0], 
                          "nomRaquette": row[1],
                          "idErreur": row[2], 
                          "idExperience": row[3]})
    return raquettes