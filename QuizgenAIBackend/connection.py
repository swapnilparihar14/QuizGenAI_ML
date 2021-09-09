from flask_pymongo import PyMongo

def connectDB(app):
    mongodb_client = PyMongo(app, uri="mongodb+srv://quizgenai:Sjsu2021@quizgenaicluster.6dzhx.mongodb.net/quizgenai_db")
    db = mongodb_client.db
    return db
