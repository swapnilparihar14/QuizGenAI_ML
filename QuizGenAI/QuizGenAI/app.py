# To create an environment
# py -3 -m venv venv
# venv\Scripts\activate

# Libraries need to be installed
# pip install -U Werkzeug
# pip install flask_cors
# pip install flask


from flask import Flask, request, jsonify, Response, render_template, redirect, url_for
import json
from datetime import timedelta
from werkzeug.utils import secure_filename
from flask_cors import CORS
from TextExtractor import Dotx2text, DecoderSection
import os
import uuid

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = [
    '.doc', '.docx', '.pdf', '.ppt', '.pptx', '.txt', '.xml']
app.config['UPLOAD_PATH'] = 'uploads'

CORS(app)
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route('/home')
def home():
    return render_template('index.html')


@app.route('/home', methods=['POST'])
def upload_file():
    """POST method to take text file input from the user"""
    uploaded_file = request.files['file']

    # Prevents malware from attacking the system
    filename = secure_filename(uploaded_file.filename)

    # Generate Unique filename
    unique_filename = str(uuid.uuid4())

    if uploaded_file.filename != '':
        file_ext = os.path.splitext(filename)[1]

        # Incorrect file extensions will be filtered here
        if file_ext not in app.config['UPLOAD_EXTENSIONS']:
            return jsonify({"status": 400, "message": "Invalid File format"})

        # Save file in a temporary Upload folder, May need to change it later
        uploaded_file.save(os.path.join(
            app.config['UPLOAD_PATH'], str(unique_filename+filename)))

        # Decoding text from file
        text = DecoderSection.decoderselection(os.path.join(
            app.config['UPLOAD_PATH'], str(unique_filename+filename)))

    # If decoding is successful return success else error
    if text["status"] == 100:
        return jsonify({"status": 100, "message": text["message"]})
    else:
        return jsonify(text)


@ app.route('/')
def success():
    # Default Home page for debugging
    return "Success"


@ app.errorhandler(413)
def too_large(e):
    return "File is too large", 413


if __name__ == '__main__':
    app.run(debug=True)
    # app.run(host='0.0.0.0', debug=True)
