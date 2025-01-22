from flask import Flask, jsonify, request
from connexion import get_db_connection
import dao.experiencedao as expDao

app = Flask(__name__)

conn = get_db_connection()


@app.route("/")
def index():
    if request.method == "GET":

        data = {"Hello": "World", "experience": expDao.get_by_id(1)}

        return jsonify(data)
