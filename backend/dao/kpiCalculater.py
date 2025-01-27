from flask import Flask, request, jsonify
from flask_cors import CORS
from connexion import get_db_connection


T_VALUES = {
    "T1": 45, 
    "T2": 50,
    "T3": 55,
    "T4": 60,
    "T5": 65,
    "T6": 70
}

XP_VALUES = {
    "Xp1": 0.1,
    "Xp2": 0.2,
    "Xp3": 0.3,
    "Xp4": 0.4,
    "Xp5": 0.5,
    "Xp6": 0.6,
    "Xp7": 0.7,
    "Xp8": 0.8,
    "Xp9": 0.9,
    "Xp10": 1.0 
}

app = Flask(__name__)
CORS(app)

conn = get_db_connection()

# Define a route
@app.route('/', methods=['GET'])
def greetings():
    return "Hello, world :) !"

# Define a route that accepts POST requests
@app.route('/kpi1', methods=['POST'])
def calculate_kpi1():
    data = request.json
    Tmoy = data.get("Tmoy")  # Average time for 24 rackets
    option = data.get("option")  # Option A or B..
    T_values = data.get("T_values", T_VALUES) 
    XP_VALUES = data.get("XP_VALUES", XP_VALUES)

    if not Tmoy or not option:
        return jsonify({"error": "Tmoy and option are required"}), 400

    try:
        if option == "A":
            Tc = Tmoy 
        elif option == "B":
            Tc = Tmoy * (30 / 24)
        elif option == "C":
            Tc = Tmoy + sum(T_values.values()) 
        elif option == "D":
            Tc = (Tmoy ) * XP_VALUES
        elif option == "E":
            Tc = (Tmoy * (30 / 24)) * XP_VALUES
        elif option == "F":
            Tc = (Tmoy + sum(T_values.values()) ) * XP_VALUES
        else:
            return jsonify({"error": "Invalid option"}), 400

        return jsonify({"Tc": Tc}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/kpi2', methods=['GET', 'POST'])
def kpi2():
    if request.method == 'GET':
        result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi2",)).fetchone()
        count = result[0] if result else 0
        return jsonify({"kpi2": count}), 200

    if request.method == 'POST':
        conn.execute('UPDATE kpi_counters SET count = count + 1 WHERE name = ?', ("kpi2",))
        conn.commit()
        result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi2",)).fetchone()
        return jsonify({"message": "KPI2 counter incremented.", "kpi2": result[0]}), 200

@app.route('/kpi3', methods=['GET', 'POST'])
def kpi3():
    if request.method == 'GET':
        result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi3",)).fetchone()
        count = result[0] if result else 0
        return jsonify({"kpi3": count}), 200

    if request.method == 'POST':
        conn.execute('UPDATE kpi_counters SET count = count + 1 WHERE name = ?', ("kpi3",))
        conn.commit()
        result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi3",)).fetchone()
        return jsonify({"message": "KPI3 counter incremented.", "kpi3": result[0]}), 200

@app.route('/kpi4', methods=['GET'])
def kpi4():
    kpi2_result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi2",)).fetchone()
    kpi2 = kpi2_result[0] if kpi2_result else 0
    taux_avancement = 100 * kpi2 / 30
    return jsonify({"kpi4": taux_avancement}), 200

@app.route('/kpi5', methods=['POST'])
def kpi5():
    data = request.json
    temps_objectif = data.get("temps_objectif")

    if temps_objectif is None:
        return jsonify({"error": "temps_objectif is required"}), 400

    kpi3_result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi3",)).fetchone()
    kpi3 = kpi3_result[0] if kpi3_result else 0

    if kpi3 == 0:
        return jsonify({"error": "kpi3 value is zero, cannot calculate productivity"}), 400

    productivite = 100 * temps_objectif / kpi3
    return jsonify({"kpi5": productivite}), 200

@app.route('/kpi6', methods=['POST'])
def kpi6():
    conn.execute('UPDATE kpi_counters SET count = count + 1 WHERE name = ?', ("kpi6",))
    conn.commit()
    result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi6",)).fetchone()
    return jsonify({"message": "KPI6 counter incremented.", "kpi6": result[0]}), 200

@app.route('/kpi7', methods=['POST'])
def kpi7():
    conn.execute('UPDATE kpi_counters SET count = count + 1 WHERE name = ?', ("kpi7",))
    conn.commit()
    result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi7",)).fetchone()
    return jsonify({"message": "KPI7 counter incremented.", "kpi7": result[0]}), 200

@app.route('/kpi8', methods=['GET'])
def kpi8():
    kpi2_result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi2",)).fetchone()
    kpi2 = kpi2_result[0] if kpi2_result else 0

    kpi7_result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi7",)).fetchone()
    kpi7 = kpi7_result[0] if kpi7_result else 0

    if kpi2 == 0:
        return jsonify({"error": "kpi2 value is zero, cannot calculate quality rate"}), 400

    taux_qualite = 100 * (kpi2 - kpi7) / kpi2
    return jsonify({"kpi8": taux_qualite}), 200

@app.route('/kpi9', methods=['POST'])
def kpi9():
    data = request.json
    rythme_reel = data.get("rythme_reel")

    if rythme_reel is None:
        return jsonify({"error": "rythme_reel is required"}), 400

    temps_prediction = rythme_reel  # Assuming rythme_reel determines prediction directly
    return jsonify({"kpi9": temps_prediction}), 200

@app.route('/kpi10', methods=['GET'])
def kpi10():
    result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi10",)).fetchone()
    count = result[0] if result else 0
    return jsonify({"kpi10": count}), 200

@app.route('/kpi11', methods=['GET'])
def kpi11():
    kpi1_result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi1",)).fetchone()
    kpi1 = kpi1_result[0] if kpi1_result else 0

    kpi3_result = conn.execute('SELECT count FROM kpi_counters WHERE name = ?', ("kpi3",)).fetchone()
    kpi3 = kpi3_result[0] if kpi3_result else 0

    difference = kpi1 - kpi3
    return jsonify({"kpi11": difference}), 200

if __name__ == '__main__':
    app.run(debug=True)
