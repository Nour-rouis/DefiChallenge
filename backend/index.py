import os
import random
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from connexion import get_db_connection
import dao.experiencedao as expDao
import dao.operateurdao as opDao
import dao.raquettedao as raqDao
import dao.tachedao as tacheDao
import dao.analysedao as anaDao
import dao.erreurdao as errDao

imagesFolder = "./images/"

app = Flask(__name__)
CORS(app)

conn = get_db_connection()

def add_times(time1, time2):
    """
    Adds two times. (mm:ss)

    Args:
        time1 (str): The first time.
        time2 (str): The second time.

    Returns:
        str: The sum of the two times.
    """
    time1 = time1.split(":")
    time2 = time2.split(":")
    minutes = int(time1[0]) + int(time2[0])
    seconds = int(time1[1]) + int(time2[1])
    if seconds >= 60:
        minutes += 1
        seconds -= 60
    return str(minutes) + ":" + str(seconds).zfill(2)

def subtract_times(time1, time2):
    """
    Subtracts two times. (mm:ss)

    Args:
        time1 (str): The first time.
        time2 (str): The second time.

    Returns:
        str: The difference between the two times.
    """
    time1 = time1.split(":")
    time2 = time2.split(":")
    minutes = int(time1[0]) - int(time2[0])
    seconds = int(time1[1]) - int(time2[1])
    if seconds < 0:
        minutes -= 1
        seconds += 60
    return str(minutes) + ":" + str(seconds).zfill(2)


def timeToFloat(time):
    """
    Convert a time (mm:ss) to a float (minutes).

    Args:
        time (str): The time to convert.

    Returns:
        float: The time in minutes.
    """
    time = time.split(":")
    return int(time[0]) + int(time[1]) / 60

def floatToTime(time):
    """
    Convert a float (minutes) to a time (mm:ss).

    Args:
        time (float): The time to convert.

    Returns:
        str: The time in mm:ss format.
    """
    minutes = int(time)
    seconds = int((time - minutes) * 60)
    return str(minutes) + ":" + str(seconds).zfill(2)

def multiply_times(time, factor):
  """
  Multiplie une durée au format "mm:ss" par un facteur réel.

  Args:
    time: La durée au format "mm:ss".
    factor: Le facteur de multiplication.

  Returns:
    La durée multipliée, au format "mm:ss".
  """
  minutes, seconds = map(int, time.split(':'))
  total_seconds = minutes * 60 + seconds
  new_total_seconds = int(total_seconds * factor)
  new_minutes, new_seconds = divmod(new_total_seconds, 60)
  return f"{new_minutes:02d}:{new_seconds:02d}"


# --- PAGE ACCUEIL --- #

@app.route("/experiences", methods=['GET'])
def experiences():
    if request.method == "GET":
        
        experiences = expDao.get_all()
        return jsonify(experiences)

def valid_experience(nom, nbTache):
    error = None
    if not isinstance(nom, str):
        error = "[ERROR] Nom incorrect"
    if not nbTache.isdigit():
        error = "[ERROR] Nombre de tache incorrect"
    
    if error == None:
        return {"valid" : True}
    else:
        return {"valid" : False, "error" : error}

@app.route("/experience/new", methods=['POST'])
def experiencenew():
    if request.method == "POST":
        nom = request.form["nom"]
        nbTache = request.form["nombreTache"]
        option = request.form["option"]
        Tmoy = request.form["Tmoy"]
        id = expDao.create(nom, nbTache, option, Tmoy)
        return jsonify(
            {
                'state' : 'success',
                'message' : '[SUCCESS] Experience #' + str(id) + ' créée.'
            }
        )

@app.route("/experience/<int:idexp>/delete", methods=['GET'])
def experiencedelete(idexp):
    if request.method == "GET":
        expDao.delete(idexp)
        print("[DELETE] Experience #" + str(idexp) + " a bien été supprimée.")
        return jsonify(
            {
                'state' : 'success',
                'message' : '[SUCCESS] Experience #' + str(idexp) + ' supprimé.'
            }
        )

# --- PAGE OPERATORS --- #

@app.route("/experience/<int:idexp>/operators", methods=['GET'])
def getopsexperience(idexp):
    if request.method == "GET":
        operators = opDao.get_by_idExperience(idexp)
        return jsonify(operators)
 
# --- PAGE EXPERIENCE --- #

@app.route("/experience/<int:idexp>", methods=['GET'])
def experience(idexp):
    if request.method == "GET":
        experience = expDao.get_by_id(idexp)
        return jsonify(experience)

@app.route("/experience/<int:idexp>/update", methods=['POST'])
def experienceupdate(idexp):
    if request.method == "POST":
        nom = request.form["nom"]
        nbTache = request.form["nombreTache"]
        option = request.form["option"]
        Tmoy = request.form["Tmoy"]

        validation = valid_experience(nom, nbTache)

        if validation['valid']:
            expDao.update(idexp, nom, nbTache, option, Tmoy)
            return jsonify(
                {
                    'state' : 'success',
                    'message' : '[SUCCESS] Experience #' + str(idexp) + ' modifiée'
                }
            )
        else:
            return jsonify(
                {
                    'state' : 'error',
                    'message' : validation['error']
                }
            )
   
@app.route("/experience/<int:idexp>/showresults", methods=['GET'])
def getexperienceresult(idexp):
    if request.method == "GET":
        return jsonify({"Message" : "Not implemented yet"})

@app.route("/experience/<int:idexp>/downloadresults")
def downloadexperienceresults(idexp):
    path = "./README.md"
    return send_file(path, as_attachment=True)

# --- PAGE ERREUR --- #

@app.route("/experience/<int:idexp>/erreurs", methods=['GET'])
def geterreurs(idexp):
    if request.method == "GET":
        erreurs = errDao.get_by_idExperience(idexp)
        return jsonify(erreurs)
    
def getErreursImages(idexp):
    erreurs = errDao.get_by_idExperience(idexp)
    images = []
    for erreur in erreurs:
        images.append(erreur['image'])
    return images
    
@app.route("/experience/<int:idexp>/erreur/new", methods=['POST'])
def newerreur(idexp):
    if request.method == "POST":

        file = request.files['image']

        if(file.filename == ''):
            return jsonify({
                'state' : 'error',
                'message' : '[ERROR] Aucun fichier sélectionné.'
            })
    
        if file:
            expFolder = imagesFolder + "exp" + str(idexp) + "/"
            filename = expFolder + file.filename
            if not os.path.exists(expFolder):
                os.makedirs(expFolder)
            file.save(filename)
            print("[CREATE] Image " + filename + " enregistrée.")
            id = errDao.create(request.form['nom'], str(filename), request.form['tempsDefaut'], idexp)
            return jsonify({
                    'state' : 'success',
                    'message' : '[SUCCESS] Erreur #' + str(id) + ' créée pour l\'Experience #' + str(idexp) + '.'
            }
            )
        
@app.route("/experience/<int:idexp>/erreur/<int:iderr>/update", methods=['POST'])
def updateerreur(idexp, iderr):
    if request.method == "POST":
        file = request.files['image']
        if file:
            filename = imagesFolder + "exp" + str(idexp) + "/" + file.filename
            file.save(filename)
            print("[UPDATE] Image " + filename + " enregistrée.")
            errDao.update(iderr, request.form['nom'], filename, request.form['tempsDefaut'], idexp)
            return jsonify({
                'state' : 'success',
                'message' : '[SUCCESS] Erreur #' + str(iderr) + ' a été mise à jour dans l\'Experience #' + str(idexp) + '.'
            })
        
@app.route("/experience/<int:idexp>/erreur/<int:iderr>/delete", methods=['GET'])
def deleteerreur(idexp, iderr):
    if request.method == "GET":
        image = errDao.get_by_id(iderr)['image']

        errDao.delete(iderr)

        if image != None:
            os.remove(image)
            print("[DELETE] Image " + image + " supprimée.")
            imagesError = getErreursImages(idexp)
            if os.path.exists(imagesFolder + "exp" + str(idexp) + "/") and len(imagesError) == 0:
                os.rmdir(imagesFolder + "exp" + str(idexp) + "/")
                print("[DELETE] Dossier exp" + str(idexp) + " supprimé.")

        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Erreur #' + str(iderr) + ' de l\'Experience #' + str(idexp) + ' a été supprimé.'
        })

# --- PAGE CREATE USER --- #

@app.route("/experience/<int:idexp>/operator/new", methods=['POST'])
def newoperator(idexp):
    if request.method == "POST":
        prenom = request.form['prenom']
        nom = request.form['nom']
        nivExp = request.form['nivExp']

        id = opDao.create(nom, prenom, nivExp, idexp)
        return jsonify(
            {
                'state' : 'success',
                'id' : id,
                'message' : '[SUCCESS] Opérateur #' + str(id) + ' créée pour l\'Experience #' + str(idexp) + '.'
            }
        )
    
@app.route('/experience/<int:idexp>/operator/<int:idope>/delete', methods=['GET'])
def deleteoperator(idexp, idope):
    if request.method== "GET":
        opDao.delete(idope)
        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Opérateur ' + str(idope) + ' dans l\'Experience #' + str(idexp) + ' a été supprimé.'
        })
    
# --- PAGE RAQUETTE --- #

@app.route("/experience/<int:idexp>/raquettes", methods=['GET'])
def getraquettes(idexp):
    if request.method == "GET":
        raquettes = raqDao.get_by_idExperience(idexp)
        return jsonify(raquettes)
    
@app.route("/experience/<int:idexp>/raquette/new", methods=['POST'])
def newraquettes(idexp):
    if request.method == "POST":
        nomRaquette = request.form['nomRaquette']
        idErreur = request.form['idErreur']

        id = raqDao.create(nomRaquette, idErreur, idexp)
        return jsonify(
            {
                'state' : 'success',
                'message' : '[SUCCESS] Raquette #' + str(id) + ' créée dans l\'Experience #' + str(idexp) + '.'
            }
        )
    
@app.route("/experience/<int:idexp>/raquette/<int:idraq>/update", methods=['POST'])
def updateraquette(idexp, idraq):
    if request.method == "POST":
        nomRaquette = request.form['nomRaquette']
        idErreur = request.form['idErreur']

        raqDao.update(idraq, nomRaquette, idErreur, idexp)
        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Raquette #' + str(idraq) + ' a été mise à jour dans l\'Expérience #' + str(idexp) + '.'
        })
    
@app.route("/experience/<int:idexp>/raquette/<int:idraq>/delete", methods=['GET'])
def deleteraquette(idexp, idraq):
    if request.method == "GET":
        raqDao.delete(idraq)
        return jsonify({
            'state': "success",
            'message': "[SUCCESS] Raquette #" + str(idraq) + ' de l\'Experience #' + str(idexp) + ' a été supprimé.'
        })
    
# --- PAGE CONFIG TACHE --- #

@app.route('/experience/<int:idexp>/raquettes/nberreurs', methods=['GET'])
def countErrorRaquettes(idexp):
    if request.method == "GET":
        count = raqDao.count_errors_by_idExperience(idexp)
        return jsonify(count)

@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/new", methods=['POST'])
def newTache(idexp, idop):
    if request.method == "POST":
        iaPourcentage = request.form['iaNbErreurDetecte']
        visibiliteKpi = request.form['visibiliteKpi']

        id = tacheDao.create(iaPourcentage, visibiliteKpi, idop)
        return jsonify({
            'state' : 'success',
            'id' : id,
            'message' : '[SUCCESS] Tache #' + str(id) + ' créée pour l\'opérateur #' + str(idop) + ' dans l\'Experience #' + str(idexp) + '.' 
        })
    
@app.route("/experience/<int:idexp>/operator/<int:idop>/nbtaches", methods=['GET'])
def countTaches(idexp, idop):
    if request.method == "GET":
        count = tacheDao.count_by_idOperateur(idop)
        return jsonify(count)

# --- PAGE VERIFICATION --- #

@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/raquette/<int:idraq>/verification", methods=['POST'])
def verification(idexp, idop, idtache, idraq):
    if request.method == "POST":
        dateDebut = request.form['dateDebut']
        dateFin = request.form['dateFin']
        isErreur = request.form['isErreur']

        id = anaDao.create(idraq, idtache, dateDebut, dateFin, isErreur)
        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Verification #' + str(id) + ' créée pour la raquette #' + str(idraq) + ' pour l\'opérateur #' + idop + ' dans l\'Experience #' + str(idexp) + '.'
        })
    
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/raquettesrestantes", methods=['GET'])
def raquettesRestantes(idexp, idop, idtache):
    if request.method == "GET":
        raquettes = tacheDao.get_raquettes_restantes(idtache)
        return jsonify(raquettes)
    
@app.route("/experience/<int:idexp>/erreur/<int:iderr>/image", methods=['GET'])
def erreurImage(idexp, iderr):
    if request.method == "GET":
        image = errDao.get_by_id(iderr)['image']
        return send_file(image, as_attachment=False)

@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getErreurAffiche", methods=['GET'])
def getErreurAffiche(idexp, idop, idtache):
    if request.method == "GET":
        erreurs = raqDao.get_raquette_with_error(idexp)
        idErreurs = []
        for erreur in erreurs:
            idErreurs.append(erreur['idErreur'])

        iaNbErreur = tacheDao.get_by_id(idtache)['iaNbErreurDetecte']
        random.seed(iaNbErreur)
        errAffiche = random.sample(idErreurs, iaNbErreur)
        return jsonify(errAffiche)

# --- KPIS --- #

@app.route('/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/tempscible', methods=['GET'])
@app.route('/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getkpi1', methods=['GET'])
def getKpi1(idexp, idop, idtache):
    if request.method == "GET":
        exp = expDao.get_by_id(idexp)
        if not exp:
            return jsonify({'state': 'error', 'message': 'Experience not found'}), 404

        Tmoy = exp['Tmoy']
        option = exp['option']
        nbRaquette = raqDao.count_by_idExperience(idexp)['count']
        nbErreur = raqDao.count_errors_by_idExperience(idexp)['count']

        raquettesWithErrors = raqDao.get_raquette_with_error(idexp)
        errors = errDao.get_by_idExperience(idexp)

        sommeTErreur = "00:00"
        for raquette in raquettesWithErrors:
            for error in errors:
                if error['idErreur'] == raquette['idErreur']:
                    sommeTErreur = add_times(sommeTErreur, error['tempsDefaut'])
                    break
        
        T_values = {}
        for error in errors:
            T_values[error['idErreur']] = error['tempsDefaut']

        op = opDao.get_by_id(idop)
        Tc = "00:00"

        try:
            if option == 'A':
                Tc = Tmoy
            elif option == 'B':
                Tc = multiply_times(Tmoy, (nbRaquette / (nbRaquette - nbErreur)))
            elif option == 'C':
                Tc = add_times(Tmoy, sommeTErreur) # OK
            elif option == 'D':
                Tc = multiply_times(Tmoy, op['nivExp'])
            elif option == 'E':
                Tc = multiply_times(Tmoy, (nbRaquette / (nbRaquette - nbErreur) * op['nivExp']))
            elif option == 'F':
                Tc = multiply_times(add_times(Tmoy, sommeTErreur), op['nivExp'])
            else:
                return jsonify({'state': 'error', 'message': '[ERROR] Option invalide.'}), 400

            # KPI1 -> Temps cible
            kpi1 = Tc
            return jsonify({'kpi1': kpi1}), 200

        except Exception as e:
            return jsonify({'state': 'error', 'message': str(e)}), 500
        
# Nombres de raquettes controlées dans la tache (KPI2)
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/raquettescontrolees", methods=['GET'])
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getkpi2", methods=['GET'])
def raquettesControlees(idexp, idop, idtache):
    if request.method == "GET":
        nbRaquettesControlees = len(anaDao.get_by_idTache(idtache))
        return jsonify({'nbRaquettesControlees': nbRaquettesControlees}), 200
    
# Somme des erreurs non détectées (KPI10)
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/erreursnondetectees", methods=['GET'])
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getkpi10", methods=['GET'])
def erreursNonDetectees(idexp, idop, idtache):
    if request.method == "GET":
        raquettes = raqDao.get_by_idExperience(idexp)
        analyses = anaDao.get_by_idTache(idtache)

        erreursNonDetectees = 0

        for r in raquettes:
            if r['idErreur'] != "null":
                for a in analyses:
                    if a['idRaquette'] == r['idRaquette']:
                        if a['isErreur'] == 0:
                            erreursNonDetectees += 1
        
        return jsonify({'erreursNonDetectees': erreursNonDetectees}), 200