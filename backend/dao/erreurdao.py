from connexion import get_db_connection

def get_all():
    """
    Récupère tous les enregistrements de la table erreur.

    Returns:
        list: Une liste de dictionnaires représentant les enregistrements.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM erreur')
    rows = cursor.fetchall()
    conn.close()
    erreurs = []
    for row in rows:
        erreurs.append({
            "idErreur": row[0],
            "nom": row[1],
            "image": row[2],
            "tempsDefaut": row[3],
            "idExperience": row[4]
        })
    return erreurs

def get_by_id(id):
    """
    Récupère un enregistrement de la table erreur selon l'identifiant spécifié.

    Args:
        id (int): L'identifiant de l'enregistrement à récupérer.

    Returns:
        dict: Un dictionnaire représentant l'enregistrement.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM erreur WHERE idErreur = ?',
                    (id,))
        row = cursor.fetchone()
        conn.close()
        return {
            "idErreur": row[0],
            "nom": row[1],
            "image": row[2],
            "tempsDefaut": row[3],
            "idExperience": row[4]
        }
    except:
        print("[DATABASE] Erreur #" + str(id) + " introuvable")
        return None

def create(nom, image, tempsDefaut, idExperience):
    """
    Crée un nouvel enregistrement dans la table erreur.

    Args:
        nom (str): Le nom de l'erreur.
        image (str): Le chemin vers l'image.
        tempsDefaut (str): Temps moyen de réparation du defaut.
        idExperience (int): L'identifiant de l'expérience de l'erreur.
    
    Returns:
        int: L'identifiant de l'enregistrement créé.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO erreur (nom, image, tempsDefaut, idExperience) VALUES (?, ?, ?, ?)',
                   (nom, image, tempsDefaut, idExperience))
    conn.commit()
    id = cursor.lastrowid
    conn.close()
    print("[DATABASE] Nouvelle erreur #" + str(id))
    return id

def update(id, nom, image, tempsDefaut, idExperience):
    """
    Met à jour un enregistrement de la table erreur selon l'identifiant spécifié.

    Args:
        id (int): L'identifiant de l'enregistrement à mettre à jour.
        nom (str): Le nom de l'erreur.
        image (str): Le chemin de l'image.
        tempsDefaut (str): Temps moyen de réparation du défaut.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE erreur SET nom = ?, image = ?, tempsDefaut = ?, idExperience = ? WHERE idErreur = ?',
                   (nom, image, tempsDefaut, idExperience))
    conn.commit()
    conn.close()
    print('[DATABASE] Erreur #', id, "mis à jour")
    return True

def delete(id):
    """
    Supprime un enregistrement de la table erreur selon l'identifiant spécifié.
    
    Args:
        id (int): L'identifiant de l'erreur à supprimer.
    """
    conn  = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM erreur WHERE idErreur = ?',
                   (id,))
    conn.commit()
    conn.close()
    print('[DATABASE] Erreur #', id, "supprimé")
    return True

def get_by_idExperience(idExperience):
    """
    Récupère tous les enregistrements de la table erreur selon l'identifiant de l'expérience spécifié.

    Args:
        idExperience (int): L'identifiant de l'expérience.

        Returns:
            list: Une liste de dictionanires représentant les enregistrements.
    """

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM erreur WHERE idExperience = ?',
                   (idExperience,))
    rows = cursor.fetchall()
    conn.close()
    erreurs = []
    for row in rows:
        erreurs.append({
            "idErreur": row[0],
            "nom": row[1],
            "image": row[2],
            "tempsDefaut": row[3],
            "idExperience": row[4]
        })
    return erreurs