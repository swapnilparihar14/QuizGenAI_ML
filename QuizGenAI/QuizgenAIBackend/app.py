from flask import Flask, request, jsonify
from tfgenerator import TrueFalsePreprocessing
from models import Models
from login_register import Authentication
from flask_pymongo import PyMongo
from connect import URI
from flask_cors import CORS
from constants import UPLOAD_FOLDER
from generate_quiz import GenerateQuiz
from long_question_generation import model_prod
from crud_operations import CrudOperations
from constants import ERROR_MESSAGE
import json

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)


def connectdb(app):
    mongodb_client = PyMongo(app, uri=URI)
    db = mongodb_client.db
    return db


db = connectdb(app)
# # #Use CAPITAL LETTERS FOR GLOBAL VARIABLES
models = Models()
AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions, t5_model, t5_tokenizer = models.generate_all_models()

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
        tfpre = TrueFalsePreprocessing(AllenNLPpredictor)
        false_question = tfpre.tfdriver(sentence, GPT2tokenizer, GPT2model, BERT_model_tfquestions)
        return jsonify(message=false_question)

@app.route("/long_question", methods=["POST"])
def long_quest():
    if request.method == 'POST':
        sentence_json = request.get_json()
        context = sentence_json['context']
        keyword = sentence_json['keyword']

        temp_model_obj = model_prod(t5_model, t5_tokenizer)
        long_question = temp_model_obj.generate_question(context, keyword)
        return jsonify(message=long_question)


@app.route("/review_questions", methods=["POST"])
def get_review_questions():
    if request.method == 'POST':
        quiz_details = request.form
        file = request.files['file']
        gen_quiz = GenerateQuiz(AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions, t5_model, t5_tokenizer)
        code, json_message = gen_quiz.generate_quiz_driver(quiz_details, file, db)
        return json_message, code


@app.route("/create_quiz", methods=["POST"])
def get_create_questions():
    if request.method == 'POST':
        selected_questions = request.get_json()
        gen_quiz = GenerateQuiz(AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions, t5_model, t5_tokenizer)
        code, json_message = gen_quiz.save_questions(selected_questions, db)
        return json_message, code


@app.route("/get_created_quizzes", methods=["GET"])
def get_created_quizzes():
    if request.method == 'GET':
        user_details = request.args
        crud_operations = CrudOperations()
        code, json_message = crud_operations.get_created_quizzes(user_details, db)
        return json_message, code


@app.route("/get_your_created_quiz", methods=["GET"])
def get_your_created_quiz():
    if request.method == "GET":
        quiz_details = request.args
        crud_operations = CrudOperations()
        code, json_message = crud_operations.get_all_created_questions(db, quiz_details)
        return json_message, code


@app.route("/get_your_taken_or_practice_quiz", methods=["GET"])
def get_your_taken_or_practice_quiz():
    if request.method == "GET":
        quiz_details = request.args
        crud_operations = CrudOperations()
        code, json_message = crud_operations.get_your_taken_or_practice_quiz(db, quiz_details)
        return json_message, code


@app.route("/get_taken_quizzes", methods=["GET"])
def get_taken_quizzes():
    if request.method == "GET":
        quiz_details = request.args
        crud_operations = CrudOperations()
        code, json_message = crud_operations.get_taken_quizzes(db, quiz_details)
        return json_message, code


@app.route("/get_practice_quizzes", methods=["GET"])
def get_practice_quizzes():
    if request.method == "GET":
        quiz_details = request.args
        crud_operations = CrudOperations()
        code, json_message = crud_operations.get_practice_quizzes(db, quiz_details)
        return json_message, code


@app.route("/take_created_quiz", methods=["GET"])
def take_created_quiz():
    if request.method == 'GET':
        quiz_details = request.args
        crud_operations = CrudOperations()
        code, json_message = crud_operations.take_created_quiz(quiz_details, False, db)
        return json_message, code


@app.route("/get_quiz_score", methods=["POST"])
def get_quiz_score():
    if request.method == "POST":
        quiz_scores = request.get_json()
        crud_operations = CrudOperations()
        code, json_message = crud_operations.get_quiz_score(db, quiz_scores)
        return json_message, code


@app.route("/take_practice_quiz", methods=["POST"])
def take_practice_quiz():
    if request.method == "POST":
        quiz_details = request.form
        file = request.files['file']
        json_message = ERROR_MESSAGE
        gen_quiz = GenerateQuiz(AllenNLPpredictor, GPT2tokenizer, GPT2model,
                                BERT_model_tfquestions, t5_model, t5_tokenizer, is_selected=True)
        code, questions_data = gen_quiz.generate_quiz_driver(quiz_details, file, db)
        if code == 200:
            code, message = gen_quiz.save_questions(json.loads(questions_data.data), db)
            if code == 200:
                crud_operations = CrudOperations()
                code, json_message = crud_operations.take_created_quiz(json.loads(questions_data.data), True, db)
        return json_message, code


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
