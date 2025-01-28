from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table experience.
    
    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM experience')
    rows = cursor.fetchall()
    conn.close()
    experiences = []
    for row in rows:
        experiences.append({"idExperience": row[0], 
                            "nom": row[1], 
                            "nombreTache": row[2],
                            "option": row[3],
                            "Tmoy" : row[4]})
    return experiences

def get_by_id(id):
    """
    Récupère un enregistrement de la table experience selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à récupérer.
    
    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM experience WHERE idExperience = ?', 
                   (id,))
    row = cursor.fetchone()
    conn.close()
    return {"idExperience": row[0], 
            "nom": row[1], 
            "nombreTache": row[2],
            "option": row[3],
            "Tmoy" : row[4]}

def create(nom, nbTache, option, Tmoy):
    """
    Crée un nouvel enregistrement dans la table experience.
    
    Args:
        nom (str): Le nom de l'expérience.
        nbTache (int): Le nombre de tâches effectuées.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO experience (nom, nombreTache, option, Tmoy) VALUES (?, ?, ?, ?)', 
                   (nom, nbTache, option, Tmoy))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvelle Experience #", id)
    return id

def update(id, nom, nbTache, option, Tmoy):
    """
    Met à jour un enregistrement de la table experience selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à mettre à jour.
        nom (str): Le nom de l'expérience.
        nbTache (int): Le nombre de tâches effectuées.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE experience SET nom = ?, nombreTache = ?, option = ?, Tmoy = ? WHERE idExperience = ?', 
                   (nom, nbTache, option, Tmoy, id))
    conn.commit()
    conn.close()
    print("[DATABASE] Experience #", id, " mise à jour")
    
def delete(id):
    """
    Supprime un enregistrement de la table experience selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'enregistrement à supprimer.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM experience WHERE idExperience = ?', 
                   (id,))
    conn.commit()
    conn.close()
    print("[DATABASE] Experience #", id, " supprimée")

