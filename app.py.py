from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# User Data
user_data = {
    "xp": 0,
    "level": 1,
    "hp": 100,
    "gold": 0
}

def calculate_level(xp):
    return xp // 100 + 1

@app.route("/")
def home():
    return render_template("index.html", data=user_data)

@app.route("/complete_workout", methods=["POST"])
def complete_workout():

    workout = request.json["workout"]

    xp_gain = 50
    gold_gain = 10

    if workout == "extra":
        xp_gain = 75
        gold_gain = 20

    user_data["xp"] += xp_gain
    user_data["gold"] += gold_gain
    user_data["level"] = calculate_level(user_data["xp"])

    return jsonify(user_data)

@app.route("/missed_day", methods=["POST"])
def missed_day():

    user_data["hp"] -= 10

    if user_data["hp"] <= 0:
        user_data["level"] -= 1
        user_data["hp"] = 100

    return jsonify(user_data)

if __name__ == "__main__":
    app.run(debug=True)