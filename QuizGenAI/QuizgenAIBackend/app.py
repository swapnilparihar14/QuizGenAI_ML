from flask import Flask, request, jsonify
from tfgenerator import TrueFalsePreprocessing
from models import Models
from login_register import Authentication
from flask_pymongo import PyMongo
from connect import URI
from flask_cors import CORS
from constants import UPLOAD_FOLDER
from generate_quiz import GenerateQuiz

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)


def connectdb(app):
    mongodb_client = PyMongo(app, uri=URI)
    db = mongodb_client.db
    return db


db = connectdb(app)

# models = Models()
# AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions = models.generate_all_models()


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


# @app.route("/true_false_questions", methods=["GET"])
# def tfgen():
#     if request.method == 'GET':
#         sentence_json = request.get_json()
#         sentence = sentence_json['sentence']
#         tfpre = TrueFalsePreprocessing(AllenNLPpredictor)
#         false_question = tfpre.tfdriver(sentence, GPT2tokenizer, GPT2model, BERT_model_tfquestions)
#         return jsonify(message=false_question)


@app.route("/review_questions", methods=["POST"])
def get_review_questions():
    if request.method == 'POST':
        quiz_details = request.form
        file = request.files['file']
        gen_quiz = GenerateQuiz()
        code, json_message = gen_quiz.generate_quiz_driver(quiz_details, file, db)
        return json_message, code


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
