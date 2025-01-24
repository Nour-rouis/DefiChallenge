from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table listeRaquette.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM listeRaquette')
    rows = cursor.fetchall()
    conn.close()
    listeRaquettes = []
    for row in rows:
        listeRaquettes.append({"idRaquette": row[0], 
                               "idExperience": row[1]})
    return rows

def get_by_idRaquette(idRaquette):
    """
    Récupère un enregistrement de la table listeRaquette selon l'identifiant spécifié.
    
    Args:
        idRaquette (str): L'identifiant de l'enregistrement à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM listeRaquette WHERE idRaquette = ?', 
                   (idRaquette,))
    row = cursor.fetchone()
    conn.close()
    return {"idRaquette": row[0], "idExperience": row[1]}

def get_by_idExperience(idExperience):
    """
    Récupère un enregistrement de la table listeRaquette selon l'identifiant spécifié.
    
    Args:
        idExperience (int): L'identifiant de l'enregistrement à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM listeRaquette WHERE idExperience = ?', 
                   (idExperience,))
    row = cursor.fetchone()
    conn.close()
    return {"idRaquette": row[0], 
            "idExperience": row[1]}

def delete(idRaquette, idExperience):
    """
    Supprime un enregistrement de la table listeRaquette selon les identifiants spécifiés.
    
    Args:
        idRaquette (str): L'identifiant de la raquette à supprimer.
        idExperience (int): L'identifiant de l'expérience à supprimer.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM listeRaquette WHERE idRaquette = ? AND idExperience = ?', 
                   (idRaquette, idExperience))
    conn.commit()
    conn.close()
    print("[DATABASE] Raquette #", idRaquette, "de l'Experience #", idExperience, "supprimée")