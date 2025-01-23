from flask import Flask, jsonify, request
from connexion import get_db_connection
import dao.experiencedao as expDao

app = Flask(__name__)

conn = get_db_connection()


@app.route("/getexperiences")
def index():
    if request.method == "GET":
        
        experiences = expDao.get_all()
        return jsonify(experiences)
