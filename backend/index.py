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

import json
import os
KPI_FILE_PATH = 'kpi_data.json'  # Path to the JSON file where KPI data will be stored

@app.route('/experience/<int:idexp>/getkpi1', methods=['GET'])
def getKpi1(idexp):
    if request.method == "GET":
        # Fetch experience data
        exp = expDao.get_by_id(idexp)
        if not exp:
            return jsonify({'state': 'error', 'message': 'Experience not found'}), 404

        Tmoy = exp['Tmoy']
        option = exp['option']

        # Fetch error data for T_values
        errors = errDao.get_by_idExperience(idexp)
        T_values = {}
        for error in errors:
            T_values[error['id']] = error['tempsDefaut']

        # Fetch operator data for Xp_values
        ops = opDao.get_by_idExperience(idexp)
        Xp_values = {}
        for op in ops:
            Xp_values[op['id']] = int(op['nivExp'])  # Ensure that 'nivExp' is treated as an integer

        # Calculate Tc based on the option
        try:
            if option == 'A':
                Tc = Tmoy
            elif option == 'B':
                Tc = Tmoy * (30 / 24)
            elif option == 'C':
                Tc = Tmoy + sum(T_values.values())
            elif option == 'D':
                Tc = Tmoy * sum(Xp_values.values())  # Sum of the operator levels
            elif option == 'E':
                Tc = (Tmoy * (30 / 24)) * sum(Xp_values.values())  # Multiply by sum of operator levels
            elif option == 'F':
                Tc = (Tmoy + sum(T_values.values())) * sum(Xp_values.values())  # Add T_values sum and multiply by operator levels
            else:
                return jsonify({'state': 'error', 'message': '[ERROR] Option invalide.'}), 400

            # KPI1 -> Temps cible
            kpi1 = Tc
            return jsonify({'kpi1': kpi1}), 200

        except Exception as e:
            return jsonify({'state': 'error', 'message': str(e)}), 500

@app.route('/experience/<int:idexp>/getkpi3', methods=['GET'])
def getKpi3(idexp):
    if request.method == "GET":
        # Read the existing data from the JSON file
        if os.path.exists(KPI_FILE_PATH):
            with open(KPI_FILE_PATH, 'r') as file:
                kpi_data = json.load(file)
        else:
            kpi_data = {}

        # Fetch the KPI3 value for the given experience ID
        kpi3 = kpi_data.get(str(idexp), {}).get('kpi3', 0)  # Default to 0 if KPI3 is not found
        
        return jsonify({'kpi3': kpi3}), 200

@app.route('/experience/<int:idexp>/updatekpi3', methods=['POST'])
def updateKpi3(idexp):
    if request.method == "POST":
        # Fetch the new KPI3 value from the request
        new_kpi3 = request.json.get('kpi3')
        
        if new_kpi3 is None:
            return jsonify({'state': 'error', 'message': 'Missing KPI3 value'}), 400
        
        # Read the existing data from the JSON file
        if os.path.exists(KPI_FILE_PATH):
            with open(KPI_FILE_PATH, 'r') as file:
                kpi_data = json.load(file)
        else:
            kpi_data = {}

        # Update the KPI3 value for the given experience ID
        if str(idexp) not in kpi_data:
            kpi_data[str(idexp)] = {}
        
        kpi_data[str(idexp)]['kpi3'] = new_kpi3

        # Write the updated data back to the JSON file
        try:
            with open(KPI_FILE_PATH, 'w') as file:
                json.dump(kpi_data, file, indent=4)
            return jsonify({'state': 'success', 'message': f'KPI3 updated to {new_kpi3} for experience {idexp}'}), 200
        except Exception as e:
            return jsonify({'state': 'error', 'message': str(e)}), 500
        
@app.route('/experience/<int:idexp>/updatekpi4', methods=['POST'])
def updateKpi4(idexp):
    if request.method == "POST":
        # Fetch the new KPI4 value from the request
        new_kpi4 = request.json.get('kpi4')
        
        if new_kpi4 is None:
            return jsonify({'state': 'error', 'message': 'Missing KPI4 value'}), 400
        
        # Read the existing data from the JSON file
        if os.path.exists(KPI_FILE_PATH):
            with open(KPI_FILE_PATH, 'r') as file:
                kpi_data = json.load(file)
        else:
            kpi_data = {}

        # Update the KPI4 value for the given experience ID
        if str(idexp) not in kpi_data:
            kpi_data[str(idexp)] = {}
        
        kpi_data[str(idexp)]['kpi4'] = new_kpi4

        # Write the updated data back to the JSON file
        try:
            with open(KPI_FILE_PATH, 'w') as file:
                json.dump(kpi_data, file, indent=4)
            return jsonify({'state': 'success', 'message': f'KPI4 updated to {new_kpi4} for experience {idexp}'}), 200
        except Exception as e:
            return jsonify({'state': 'error', 'message': str(e)}), 500
        
@app.route('/experience/<int:idexp>/getkpi4', methods=['GET'])
def getKpi4(idexp):
    if request.method == "GET":
        # Read the existing data from the JSON file
        if os.path.exists(KPI_FILE_PATH):
            with open(KPI_FILE_PATH, 'r') as file:
                kpi_data = json.load(file)
        else:
            kpi_data = {}

        # Fetch the KPI4 value for the given experience ID
        kpi4 = kpi_data.get(str(idexp), {}).get('kpi4', 0)  # Default to 0 if KPI4 is not found
        
        return jsonify({'kpi4': kpi4}), 200


@app.route('/experience/<int:idexp>/updatekpi6', methods=['POST'])
def updateKpi6(idexp):
    if request.method == "POST":
        # Fetch the new KPI6 value from the request
        new_kpi6 = request.json.get('kpi6')
        
        if new_kpi6 is None:
            return jsonify({'state': 'error', 'message': 'Missing KPI6 value'}), 400
        
        # Read the existing data from the JSON file
        if os.path.exists(KPI_FILE_PATH):
            with open(KPI_FILE_PATH, 'r') as file:
                kpi_data = json.load(file)
        else:
            kpi_data = {}

        # Update the KPI6 value for the given experience ID
        kpi_data[str(idexp)] = {'kpi6': new_kpi6}

        # Write the updated data back to the JSON file
        try:
            with open(KPI_FILE_PATH, 'w') as file:
                json.dump(kpi_data, file, indent=4)
            return jsonify({'state': 'success', 'message': f'KPI6 updated to {new_kpi6} for experience {idexp}'}), 200
        except Exception as e:
            return jsonify({'state': 'error', 'message': str(e)}), 500
# KPI7 -> Nb de non conformités (KPI6 + erreurs non détectées) 
@app.route('/experience/<int:idexp>/getkpi7', methods=['GET'])
def getKpi7(idexp):
    if request.method == "GET":
        # Fetch experience data
        exp = expDao.get_by_id(idexp)
        if not exp:
            return jsonify({'state': 'error', 'message': 'Experience not found'}), 404
        
        # Fetch errors for T_values
        errors = errDao.get_by_idExperience(idexp)
        T_values = {}
        for error in errors:
            T_values[error['id']] = error['tempsDefaut']
        
        # Fetch operator data for Xp_values
        ops = opDao.get_by_idExperience(idexp)
        Xp_values = {}
        for op in ops:
            Xp_values[op['id']] = int(op['nivExp'])  # Ensure 'nivExp' is treated as an integer
        
        # Calculate KPI6 (e.g., number of repairs or issues detected)
        # Assuming KPI6 is related to the number of repairs performed
        kpi6 = sum(1 for error in errors if error['repaired'])  # Example: count errors that were repaired
        
        # Identify undetected errors (where operator decided not to repair)
        undetected_errors = sum(1 for error in errors if not error['repaired'] and error['detected'])
        
        # Calculate KPI7: KPI6 + Undetected Errors
        kpi7 = kpi6 + undetected_errors
        
        # Return the KPI7 value
        return jsonify({'kpi7': kpi7}), 200