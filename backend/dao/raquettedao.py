from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table raquette.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM raquette')
    rows = cursor.fetchall()
    conn.close()
    raquettes = []
    for row in rows:
        raquettes.append({"idRaquette": row[0], 
                          "nomRaquette": row[1],
                          "idErreur": row[2], 
                          "idExperience": row[3]})
    return raquettes

def get_by_id(id):
    """
    Récupère un enregistrement de la table raquette selon l'identifiant spécifié.
    
    Args:
        id (str): L'identifiant de l'enregistrement à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM raquette WHERE idRaquette = ?', 
                   (id,))
    row = cursor.fetchone()
    conn.close()
    return {"idRaquette": row[0], 
            "nomRaquette": row[1],
            "idErreur": row[2], 
            "idExperience": row[3]}

def create(nomRaquette, idErreur, idExperience):
    """
    Crée un nouvel enregistrement dans la table raquette.
    
    Args:
        nomRaquette (str): Le nom qui correspond à la valeur du codebar.
        nomErreur (str): Le nom de l'erreur de la raquette.
        imageErreur (str): Le chemin de l'image de l'erreur de la raquette.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    conn = get_db_connection(False)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO raquette (nomRaquette, idErreur, idExperience) VALUES (?, ?, ?)', 
                   (nomRaquette, idErreur, idExperience))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvelle Raquette #", id)
    return id

def update(idRaquette, nomRaquette, idErreur, idExperience):
    """
    Met à jour un enregistrement de la table raquette selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à mettre à jour.
        nomRaquette (str): Le nom qui correspond à la valeur du codebar.
        nomErreur (str): Le nom de l'erreur de la raquette.
        imageErreur (str): Le chemin de l'image de l'erreur de la raquette.
    """
    if idErreur == "0":
        conn = get_db_connection(False)
    else:
        conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE raquette SET nomRaquette = ?, idErreur = ?, idExperience = ? WHERE idRaquette = ?', 
                   (nomRaquette, idErreur, idExperience, idRaquette))
    conn.commit()
    conn.close()
    print("[DATABASE] Raquette #", idRaquette, "mise à jour")

def delete(idRaquette):
    """
    Supprime un enregistrement de la table raquette selon l'identifiant spécifié.
    
    Args:
        id (str): L'identifiant de la raquette à supprimer.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM raquette WHERE idRaquette = ?', 
                   (idRaquette,))
    conn.commit()
    conn.close()
    print("[DATABASE] Raquette #", idRaquette, "supprimée")

def get_by_idExperience(idExperience):
    """
    Récupère un enregistrement de la table raquette selon l'identifiant de l'expérience spécifié.
    
    Args:
        idExperience (int): L'identifiant de l'expérience de la raquette à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM raquette WHERE idExperience = ?', 
                   (idExperience,))
    rows = cursor.fetchall()
    conn.close()
    raquettes = []  
    for row in rows:
        raquettes.append({"idRaquette": row[0], 
                          "nomRaquette": row[1],
                          "idErreur": row[2], 
                          "idExperience": row[3]})
    return raquettes

def count_by_idExperience(idExperience):
    """
    Compte le nombre de raquettes d'une expérience spécifiée.

    Args:
        idExperience (int): L'identifiant de l'expérience des raquettes à compter.

    Returns:
        dict: Le nombre de raquettes dans l'expérience.
    """

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as COUNT FROM raquette WHERE idExperience = ?', 
                   (idExperience,))
    row = cursor.fetchone()
    conn.close()
    return {"count" : row[0]}

def count_errors_by_idExperience(idExperience):
    """
    Compte le nombre de raquette avec erreur dans une expérience spécifiée.

    Args:
        idExperience (int): L'identifiant de l'expérience des erreurs à compter.

    Returns:
        dict: Le nombre de raquette avec erreurs dans l'expérience.
    """

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as COUNT FROM raquette WHERE idErreur != "null" AND idExperience = ?',
                   (idExperience,))
    row = cursor.fetchone()
    conn.close()
    return {"count" : row[0]}

def get_raquette_with_error(idExperience):
    """
    Récupère les raquettes avec erreur d'une expérience spécifiée.

    Args:
        idExperience (int): L'identifiant de l'expérience des erreurs à récupérer.

    Returns:
        dict: Les raquettes avec erreur de l'expérience.
    """

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM raquette WHERE idErreur AND idExperience = ?', 
                   (idExperience,))
    rows = cursor.fetchall()
    conn.close()
    raquettes = []
    for row in rows:
        raquettes.append({"idRaquette": row[0], 
                          "nomRaquette": row[1],
                          "idErreur": row[2], 
                          "idExperience": row[3]})
    return raquettes