from flask import Flask, request, jsonify, Response
import connection
import login_register
from TFQuestions.tfgenerator import TrueFalseGenerator

app = Flask(__name__)
db = connection.connectDB(app)


@app.route('/')
def hello_world():
    return 'This is my first API call!'


@app.route("/registerUser", methods=['POST'])
def register_user():
    if request.method == 'POST':
        user_details = request.get_json()
        code, json_message = login_register.user_registration(db, user_details)
        return json_message, code


@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        user_details = request.get_json()
        code, json_message = login_register.user_login(db, user_details)
        print(code, json_message)
        return json_message, code

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
