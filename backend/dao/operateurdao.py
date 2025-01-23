from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table operateur.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM operateur')
    rows = cursor.fetchall()
    conn.close()
    operateurs = []
    for row in rows:
        operateurs.append({"idOperateur": row[0], "nom": row[1], "prenom": row[2], "nivExp": row[3], "idExperience": row[4]})
    return rows

def get_by_id(id):
    """
    Récupère un enregistrement de la table operateur selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM operateur WHERE idOperateur = ?', (id,))
    row = cursor.fetchone()
    conn.close()
    return {"idOperateur": row[0], "nom": row[1], "prenom": row[2], "nivExp": row[3], "idExperience": row[4]}

def create(nom, prenom, nivExp, idExperience):
    """
    Crée un nouvel enregistrement dans la table operateur.
    
    Args:
        nom (str): Le nom de l'opérateur.
        prenom (str): Le prénom de l'opérateur.
        nivExp (int): Le niveau d'expérience de l'opérateur.
        idExperience (int): L'identifiant de l'expérience de l'opérateur.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO operateur (nom, prenom, nivExp, idExperience) VALUES (?, ?, ?, ?)', (nom, prenom, nivExp, idExperience))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvel Operateur #", id)
    return id

def update(id, nom, prenom, nivExp, idExperience):
    """
    Met à jour un enregistrement de la table operateur selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à mettre à jour.
        nom (str): Le nom de l'opérateur.
        prenom (str): Le prénom de l'opérateur.
        nivExp (int): Le niveau d'expérience de l'opérateur.
        idExperience (int): L'identifiant de l'expérience de l'opérateur.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE operateur SET nom = ?, prenom = ?, nivExp = ?, idExperience = ? WHERE idOperateur = ?', (nom, prenom, nivExp, idExperience, id))
    conn.commit()
    conn.close()
    print("[DATABASE] Operateur #", id, "mis à jour")

def delete(id):
    """
    Supprime un enregistrement de la table operateur selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'opérateur à supprimer.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM operateur WHERE idOperateur = ?', (id,))
    conn.commit()
    conn.close()
    print("[DATABASE] Operateur #", id, "supprimé")

def get_by_idExperience(idExperience):
    """
    Récupère tous les enregistrements de la table operateur selon l'identifiant de l'expérience spécifié.
    
    Args:
        idExperience (int): L'identifiant de l'expérience.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM operateur WHERE idExperience = ?', (idExperience,))
    rows = cursor.fetchall()
    conn.close()
    operateurs = []
    for row in rows:
        operateurs.append({"idOperateur": row[0], "nom": row[1], "prenom": row[2], "nivExp": row[3], "idExperience": row[4]})
    return operateurs