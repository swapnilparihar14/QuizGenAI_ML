from flask import Flask, request, jsonify
import connection
import login_register

app = Flask(__name__)
db = connection.connectDB(app)


@app.route('/')
def hello_world():
    return 'This is my first API call!'


@app.route("/registerUser", methods=['POST'])
def register_user():
    if request.method == 'POST':
        user_details = request.get_json()
        return login_register.user_registration(db, user_details)


@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        user_details = request.get_json()
        return login_register.user_login(db, user_details)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
