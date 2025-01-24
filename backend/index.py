from flask import Flask, jsonify, request
from connexion import get_db_connection
import dao.experiencedao as expDao
import dao.operateurdao as opDao

app = Flask(__name__)

conn = get_db_connection()

# --- PAGE ACCUEIL --- #

@app.route("/experiences", methods=['GET'])
def experiences():
    if request.method == "GET":
        
        experiences = expDao.get_all()
        return jsonify(experiences)

def valid_experience(nom, nbRaquette, nbTache):
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
        nbRaquette = request.form["nbRaquette"]
        nbTache = request.form["nbTache"]

        validation = valid_experience(nom, nbRaquette, nbTache)

        if validation['valid']:
            id = expDao.create(nom, nbRaquette, nbTache)
            return jsonify(
                {
                    'state' : 'success',
                    'message' : '[SUCCESS] Experience #' + str(id) + ' créée.'
                }
            )
        else:
            return jsonify(
                {
                    'state' : 'error',
                    'message' : validation['error']
                }
            )

@app.route("/experience/<int:idexp>/delete", methods=['GET'])
def experiencedelete(idexp):
    if request.method == "GET":
        expDao.delete(idexp)
        print("[DELETE] Experience #" + str(idexp) + " a bien été supprimée.")

# --- PAGE EXPERIENCE --- #

@app.route("/experience/<int:idexp>", methods=['GET'])
def experience(idexp):
    if request.method == "GET":
        nom = request.form["nom"]
        nbRaquette = request.form["nbRaquette"]
        nbTache = request.form["nbTache"]

        experience = expDao.get_by_id(idexp, nom, nbRaquette, nbTache)
        return jsonify(experience)

@app.route("/experience/<int:idexp>/update", methods=['POST'])
def experienceupdate(idexp):
    if request.method == "POST":
        nom = request.form["nom"]
        nbRaquette = request.form["nbRaquette"]
        nbTache = request.form["nbTache"]

        validation = valid_experience(nom, nbRaquette, nbTache)

        if validation['valid']:
            expDao.update(idexp, nom, nbRaquette, nbTache)
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

@app.route("/experience/<int:idexp>/operators", methods=['GET'])
def getopsexperience(idexp):
    if request.method == "GET":
        operators = opDao.get_by_idExperience(idexp)
        return jsonify(operators)

# --- PAGE RAQUETTES --- #

