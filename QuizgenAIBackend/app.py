from flask import Flask, request, jsonify
from tfgenerator import TrueFalsePreprocessing
from login_register import Authentication
from flask_pymongo import PyMongo
from connect import URI
from flask_cors import CORS


app = Flask(__name__)


def connectdb(app):
    mongodb_client = PyMongo(app, uri=URI)
    db = mongodb_client.db
    return db


db = connectdb(app)

CORS(app)

@app.route('/')
def hello_world():
    return 'This is my first API call!'


@app.route("/registerUser", methods=['POST'])
def register_user():
    if request.method == 'POST':
        user_details = request.get_json()
        auth = Authentication()
        code, json_message = auth.user_registration(db, user_details)
        return json_message, code


@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        user_details = request.get_json()
        auth = Authentication()
        code, json_message = auth.user_login(db, user_details)
        return json_message, code


@app.route("/true_false_questions", methods=["GET"])
def tfgen():
    if request.method == 'GET':
        sentence_json = request.get_json()
        sentence = sentence_json['sentence']
        tfpre = TrueFalsePreprocessing()
        false_question = tfpre.tfdriver(sentence)
        return jsonify(message=false_question)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
