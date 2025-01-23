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
        raquettes.append({"idRaquette": row[0], "nomErreur": row[1], "imageErreur": row[2]})
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
    cursor.execute('SELECT * FROM raquette WHERE idRaquette = ?', (id,))
    row = cursor.fetchone()
    conn.close()
    return {"idRaquette": row[0], "nomErreur": row[1], "imageErreur": row[2]}

def create(nomErreur, imageErreur):
    """
    Crée un nouvel enregistrement dans la table raquette.
    
    Args:
        nomErreur (str): Le nom de l'erreur de la raquette.
        imageErreur (str): Le chemin de l'image de l'erreur de la raquette.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO raquette (nomErreur, imageErreur) VALUES (?, ?)', (nomErreur, imageErreur))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvelle Raquette #", id)
    return id

def update(id, nomErreur, imageErreur):
    """
    Met à jour un enregistrement de la table raquette selon l'identifiant spécifié.
    
    Args:
        id (str): L'identifiant de l'enregistrement à mettre à jour.
        nomErreur (str): Le nom de l'erreur de la raquette.
        imageErreur (str): Le chemin de l'image de l'erreur de la raquette.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE raquette SET nomErreur = ?, imageErreur = ? WHERE idRaquette = ?', (nomErreur, imageErreur, id))
    conn.commit()
    conn.close()
    print("[DATABASE] Raquette #", id, "mise à jour")

def delete(id):
    """
    Supprime un enregistrement de la table raquette selon l'identifiant spécifié.
    
    Args:
        id (str): L'identifiant de la raquette à supprimer.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM raquette WHERE idRaquette = ?', (id,))
    conn.commit()
    conn.close()
    print("[DATABASE] Raquette #", id, "supprimée")

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
    cursor.execute('SELECT * FROM raquette WHERE idExperience = ?', (idExperience,))
    rows = cursor.fetchall()
    conn.close()
    raquettes = []
    for row in rows:
        raquettes.append({"idRaquette": row[0], "nomErreur": row[1], "imageErreur": row[2]})
    return raquettes