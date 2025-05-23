import os
import random
from pandas import DataFrame
from flask import Flask, jsonify, request, send_file, send_from_directory
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

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(imagesFolder, filename)

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
        kpis = request.form['kpis']

        idtache = tacheDao.get_by_idOperateur(idop)[idtache-1]['idTache']

        id = anaDao.create(idraq, idtache, dateDebut, dateFin, isErreur, kpis)
        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Verification #' + str(id) + ' créée pour la raquette #' + str(idraq) + ' pour l\'opérateur #' + str(idop) + ' dans l\'Experience #' + str(idexp) + '.'
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
        raqsWithErreurs = raqDao.get_raquette_with_error(idexp)
        print(raqsWithErreurs)
        idRaqErreursAAffiche = []
        for raqWithErreurs in raqsWithErreurs:
            idRaqErreursAAffiche.append(raqWithErreurs['idRaquette'])

        iaNbErreur = tacheDao.get_by_id(tacheDao.get_by_idOperateur(idop)[idtache-1]['idTache'])['iaNbErreurDetecte']
        random.seed(iaNbErreur + idexp)
        raqsAAffiche = random.sample(idRaqErreursAAffiche, iaNbErreur)
        return jsonify(raqsAAffiche)

@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getVisibiliteKpi", methods=['GET'])
def getVisibiliteKpi(idexp, idop, idtache):
    if request.method == "GET":
        visibiliteKpi = tacheDao.get_by_idOperateur(idop)
        visibiliteKpi = visibiliteKpi[idtache-1]['visibiliteKpi']
        return jsonify({'visibiliteKpi': visibiliteKpi})

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
            return jsonify({'tempsCible': kpi1}), 200

        except Exception as e:
            return jsonify({'state': 'error', 'message': str(e)}), 500
        
# Nombres de raquettes controlées dans la tache (KPI2)
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/raquettescontrolees", methods=['GET'])
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getkpi2", methods=['GET'])
def raquettesControlees(idexp, idop, idtache):
    if request.method == "GET":
        idtache = tacheDao.get_by_idOperateur(idop)[idtache-1]['idTache']
        nbRaquettesControlees = len(anaDao.get_by_idTache(idtache))
        return jsonify({'nbRaquettesControlees': nbRaquettesControlees}), 200
    
# Nombre de raquettes jetees (KPI6)
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/raquettesjetees", methods=['GET'])
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getkpi6", methods=['GET'])
def raquettesJetees(idexp, idop, idtache):
    if request.method == "GET":
        idtache = tacheDao.get_by_idOperateur(idop)[idtache-1]['idTache']
        raquettes = raqDao.get_by_idExperience(idexp)
        analyses = anaDao.get_by_idTache(idtache)

        raquettesJetees = 0

        for r in raquettes:
            if r['idErreur'] != "null":
                for a in analyses:
                    if a['idRaquette'] == r['idRaquette']:
                        if a['isErreur'] == 2:
                            raquettesJetees += 1
        
        return jsonify({'raquettesJetees': raquettesJetees}), 200
    
# Temps de réparation en fonction de l'expertise de l'opérateur (KPI9)
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/analyse/<int:idraquette>/tempsreparation", methods=['GET'])
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/analyse/<int:idraquette>/getkpi9", methods=['GET'])
def tempsReparation(idexp, idop, idtache, idraquette):
    if request.method == "GET":
        raquette = raqDao.get_by_id(idraquette)
        erreur = errDao.get_by_id(raquette['idErreur'])
        op = opDao.get_by_id(idop)
        
        tempsReparation = "00:00"
        if raquette['idErreur'] != 'null':
            tempsReparation = multiply_times(erreur['tempsDefaut'], op['nivExp'])
        
        return jsonify({'tempsReparation': tempsReparation}), 200

# Somme des erreurs non détectées (KPI10)
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/erreursnondetectees", methods=['GET'])
@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/getkpi10", methods=['GET'])
def erreursNonDetectees(idexp, idop, idtache):
    if request.method == "GET":
        idtache = tacheDao.get_by_idOperateur(idop)[idtache-1]['idTache']
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
# This is gonna calculate "tempsObjectifDuMoment" and not the KPI5 !!
@app.route('/experience/<int:idexp>/getkpi5', methods=['GET'])
def getkpi5(idexp):
    if request.method == "GET":
        # Fetch experience data
        exp = expDao.get_by_id(idexp)
        if not exp:
            return jsonify({'state': 'error', 'message': 'Experience not found'}), 404

        timeCycle = 10
        

        # Fetch errors related to the experience
        errors = errDao.get_by_idExperience(idexp)
        if not errors:
            return jsonify({'state': 'error', 'message': 'No errors found for this experience'}), 404

        # Initialize T_values (tempsDefaut for each error)
        error_times = {error['idErreur']: int(error['tempsDefaut'].split(':')[0]) * 60 + int(error['tempsDefaut'].split(':')[1]) for error in errors}

        # Initialize frequency dictionary
        error_frequencies = {error['idErreur']: 0 for error in errors}

        # Fetch raquette data to count occurrences of each error
        raquettes = raqDao.get_by_idExperience(idexp)
        for raquette in raquettes:
            error_id = raquette['idErreur']
            if error_id in error_frequencies:
                error_frequencies[error_id] += 1

        # Calculate KPI5: total objective time
        totalTime = timeCycle  # Start with cycle time
        for error_id, time in error_times.items():
            if error_frequencies[error_id]:
                totalTime += time * error_frequencies[error_id]

        return jsonify({'kpi5': totalTime}), 200


# KPI7 -> Nb de non conformités (KPI6 + KPI10) 
# KPI10-> Nb de non conformités non détectées
@app.route("/experience/<int:idexp>/get_kpi10", methods=["GET"])
def get_kpi10(idexp):  # Add 'idexp' as a parameter
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT COUNT(*) FROM raquette r
            JOIN analyse a ON r.idRaquette = a.idRaquette
            WHERE r.idErreur IS NOT NULL
            AND a.isErreur = 0
            AND r.idExperience = %s  -- Filter by Experience ID
        """
        cursor.execute(query, (idexp,))
        result = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return jsonify({"erreurs_non_detectees": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/<int:idtache>/export", methods=['GET'])
def exportToCsv(idexp, idop, idtache):
    if request.method == "GET":
        idtachedeop = idtache
        idtache = tacheDao.get_by_idOperateur(idop)[idtache-1]['idTache']
        analyses = anaDao.get_by_idTache(idtache)
        op = opDao.get_by_id(idop)
        filename = "export_" + op['nom'] + "_" + op['prenom'] + "_" + str(idtache) + ".csv"
        with open(filename, 'w') as file:
            file.write("idRaquette;dateDebut;dateFin;isErreur;kpi1;kpi2;kpi3;kpi4;kpi5;kpi6;kpi7;kpi8;kpi9;kpi10;kpi11\n")
            for analyse in analyses:
                analyse['kpis'] = eval(analyse['kpis'])
                file.write(str(analyse['idRaquette']) + ";" + analyse['dateDebut'] + ";" + analyse['dateFin'] + ";" + str(analyse['isErreur']) + ";" + str(analyse['kpis']['kpi1']) + ";" + str(analyse['kpis']['kpi2']) + ";" + str(analyse['kpis']['kpi3']) + ";" + str(analyse['kpis']['kpi4']) + ";" + str(analyse['kpis']['kpi5']) + ";" + str(analyse['kpis']['kpi6']) + ";" + str(analyse['kpis']['kpi7']) + ";" + str(analyse['kpis']['kpi8']) + ";" + str(analyse['kpis']['kpi9']) + ";" + str(analyse['kpis']['kpi10']) + ";" + str(analyse['kpis']['kpi11']) +"\n")
        return send_file(filename, as_attachment=True)

# import json
# import os
# KPI_FILE_PATH = 'kpi_data.json'  # Path to the JSON file where KPI data will be stored
# @app.route('/experience/<int:idexp>/updatekpi4', methods=['POST'])
# def updateKpi4(idexp):
#     if request.method == "POST":
#         # Fetch the new KPI4 value from the request
#         new_kpi4 = request.json.get('kpi4')
        
#         if new_kpi4 is None:
#             return jsonify({'state': 'error', 'message': 'Missing KPI4 value'}), 400
        
#         # Read the existing data from the JSON file
#         if os.path.exists(KPI_FILE_PATH):
#             with open(KPI_FILE_PATH, 'r') as file:
#                 kpi_data = json.load(file)
#         else:
#             kpi_data = {}

#         # Update the KPI4 value for the given experience ID
#         if str(idexp) not in kpi_data:
#             kpi_data[str(idexp)] = {}
        
#         kpi_data[str(idexp)]['kpi4'] = new_kpi4

#         # Write the updated data back to the JSON file
#         try:
#             with open(KPI_FILE_PATH, 'w') as file:
#                 json.dump(kpi_data, file, indent=4)
#             return jsonify({'state': 'success', 'message': f'KPI4 updated to {new_kpi4} for experience {idexp}'}), 200
#         except Exception as e:
#             return jsonify({'state': 'error', 'message': str(e)}), 500
        
# @app.route('/experience/<int:idexp>/getkpi4', methods=['GET'])
# def getKpi4(idexp):
#     if request.method == "GET":
#         # Read the existing data from the JSON file
#         if os.path.exists(KPI_FILE_PATH):
#             with open(KPI_FILE_PATH, 'r') as file:
#                 kpi_data = json.load(file)
#         else:
#             kpi_data = {}

#         # Fetch the KPI4 value for the given experience ID
#         kpi4 = kpi_data.get(str(idexp), {}).get('kpi4', 0)  # Default to 0 if KPI4 is not found
        
#         return jsonify({'kpi4': kpi4}), 200

# @app.route('/experience/<int:idexp>/updatekpi6', methods=['POST'])
# def updateKpi6(idexp):
#     if request.method == "POST":
#         # Fetch the new KPI6 value from the request
#         new_kpi6 = request.json.get('kpi6')
        
#         if new_kpi6 is None:
#             return jsonify({'state': 'error', 'message': 'Missing KPI6 value'}), 400
        
#         # Read the existing data from the JSON file
#         if os.path.exists(KPI_FILE_PATH):
#             with open(KPI_FILE_PATH, 'r') as file:
#                 kpi_data = json.load(file)
#         else:
#             kpi_data = {}

#         # Update the KPI6 value for the given experience ID
#         kpi_data[str(idexp)] = {'kpi6': new_kpi6}

#         # Write the updated data back to the JSON file
#         try:
#             with open(KPI_FILE_PATH, 'w') as file:
#                 json.dump(kpi_data, file, indent=4)
#             return jsonify({'state': 'success', 'message': f'KPI6 updated to {new_kpi6} for experience {idexp}'}), 200
#         except Exception as e:
#             return jsonify({'state': 'error', 'message': str(e)}), 500

# @app.route('/experience/<int:idexp>/getkpi3', methods=['GET'])
# def getKpi3(idexp):
#     if request.method == "GET":
#         # Read the existing data from the JSON file
#         if os.path.exists(KPI_FILE_PATH):
#             with open(KPI_FILE_PATH, 'r') as file:
#                 kpi_data = json.load(file)
#         else:
#             kpi_data = {}

#         # Fetch the KPI3 value for the given experience ID
#         kpi3 = kpi_data.get(str(idexp), {}).get('kpi3', 0)  # Default to 0 if KPI3 is not found
        
#         return jsonify({'kpi3': kpi3}), 200

# @app.route('/experience/<int:idexp>/updatekpi3', methods=['POST'])
# def updateKpi3(idexp):
#     if request.method == "POST":
#         # Fetch the new KPI3 value from the request
#         new_kpi3 = request.json.get('kpi3')
        
#         if new_kpi3 is None:
#             return jsonify({'state': 'error', 'message': 'Missing KPI3 value'}), 400
        
#         # Read the existing data from the JSON file
#         if os.path.exists(KPI_FILE_PATH):
#             with open(KPI_FILE_PATH, 'r') as file:
#                 kpi_data = json.load(file)
#         else:
#             kpi_data = {}

#         # Update the KPI3 value for the given experience ID
#         if str(idexp) not in kpi_data:
#             kpi_data[str(idexp)] = {}
        
#         kpi_data[str(idexp)]['kpi3'] = new_kpi3

#         # Write the updated data back to the JSON file
#         try:
#             with open(KPI_FILE_PATH, 'w') as file:
#                 json.dump(kpi_data, file, indent=4)
#             return jsonify({'state': 'success', 'message': f'KPI3 updated to {new_kpi3} for experience {idexp}'}), 200
#         except Exception as e:
#             return jsonify({'state': 'error', 'message': str(e)}), 500
