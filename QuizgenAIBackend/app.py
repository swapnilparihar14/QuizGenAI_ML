from flask import Flask, request, jsonify, Response
import connection
import login_register
from TFQuestion.tfgenerator import TrueFalseGenerator

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
        return json_message, code

@app.route("/true_false_questions", methods=["GET"])
def tfgen():
    if request.method == 'GET':
        tfgen = TrueFalseGenerator()
        false_question = tfgen.generate_tf_questions("The old woman was sitting under a tree.",
                                                     "The old woman was sitting")
        return false_question

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
