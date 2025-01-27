from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from connexion import get_db_connection
import dao.experiencedao as expDao
import dao.operateurdao as opDao
import dao.raquettedao as raqDao
import dao.tachedao as tacheDao
import dao.analysedao as anaDao
import dao.erreurdao as errDao

app = Flask(__name__)
CORS(app)

conn = get_db_connection()

# --- PAGE ACCUEIL --- #

@app.route("/experiences", methods=['GET'])
def experiences():
    if request.method == "GET":
        
        experiences = expDao.get_all()
        return jsonify(experiences)

def valid_experience(nom, nbRaquette, nbTache, option):
    error = None
    if not isinstance(nom, str):
        error = "[ERROR] Nom incorrect"
    if not nbRaquette.isdigit():
        error = "[ERROR] Nombre de raquette incorrect"
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
        nbRaquette = request.form["nombreRaquette"]
        nbTache = request.form["nombreTache"]
        option = request.form["option"]
        id = expDao.create(nom, nbRaquette, nbTache, option)
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
        nbRaquette = request.form["nbRaquette"]
        nbTache = request.form["nbTache"]
        option = request.form["option"]

        validation = valid_experience(nom, nbRaquette, nbTache)

        if validation['valid']:
            expDao.update(idexp, nom, nbRaquette, nbTache, option)
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
                'message' : '[SUCCESS] Opérateur #' + str(id) + ' créée pour l\'Experience #' + str(idexp) + '.'
            }
        )
    
@app.route('/experience/<int:idexp>/operator/<int:idope>/delete', methods=['GET'])
def deleteoperator(idexp, idope):
    if request.method== "GET":
        opDao.delete(idope)
        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Opérateur ' + str(idope) + ' dans l\'Experience #' + idexp + ' a été supprimé.'
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

@app.route('/experience/<int:idexp>/raquettes/counterrors', methods=['GET'])
def countErrorRaquettes(idexp):
    if request.method == "GET":
        count = raqDao.count_errors_by_idExperience(idexp)
        return jsonify(count)

@app.route("/experience/<int:idexp>/operator/<int:idop>/tache/new", methods=['POST'])
def newTache(idexp, idop):
    if request.method == "POST":
        iaPourcentage = request.form['iaPourcentage']
        visibiliteKpi = request.form['visibiliteKpi']

        id = tacheDao.create(iaPourcentage, visibiliteKpi, idop)
        return jsonify({
            'state' : 'success',
            'message' : '[SUCCESS] Tache #' + str(id) + ' créée pour l\'opérateur #' + str(idop) + ' dans l\'Experience #' + str(idexp) + '.' 
        })

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
def raquettesErreur(idexp, iderr):
    if request.method == "GET":
        image = errDao.get_by_id(iderr)['image']
        return send_file(image, as_attachment=True)