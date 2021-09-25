import os
import errno
import logging
import inspect
from constants import LOGGER_FORMAT, UPLOAD_FOLDER
from flask import jsonify
from werkzeug.utils import secure_filename


class GenerateQuiz:
    def __init__(self):
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def generate_quiz_driver(self, quiz_details, file, db):
        try:
            quiz_details_dict = {}
            file_destination = self.upload_files(file)
            timed = quiz_details['timed']
            quiz_details_dict['quiz_name'] = quiz_details['quiz_name']
            quiz_details_dict['access_code'] = quiz_details['access_code']
            quiz_details_dict['quiz_type'] = quiz_details['quiz_type']
            quiz_details_dict['creator_id'] = quiz_details['creator_id']
            quiz_details_dict['active'] = False
            if timed == "yes":
                quiz_details_dict['duration'] = (int(quiz_details['hours'])*60) + int(quiz_details['minutes'])
            no_of_mcq = int(quiz_details['mcq'])
            no_of_fbq = int(quiz_details['fbq'])
            no_of_tfq = int(quiz_details['tfq'])
            questions = self.generate_questions(no_of_mcq, no_of_fbq, no_of_tfq, file_destination)
            quiz_id = db.quiz.insert_one(quiz_details_dict).inserted_id
            return 200, jsonify(
                message="success",
                questions=questions,
                quiz_id=str(quiz_id)
            )
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def upload_files(self, file):
        try:
            target = os.path.join(UPLOAD_FOLDER, 'quiz_docs')
            if not os.path.isdir(target):
                os.mkdir(target)
            file = file
            filename = secure_filename(file.filename)
            destination = "/".join([target, filename])
            file.save(destination)
            return destination
        except OSError as exc:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {exc}")
            return ""

    def generate_questions(self, no_of_mcq, no_of_fbq, no_of_tfq, file_destination):
        mcquestions, fbquestions, tfquestions = [], [], []
        for i in range(no_of_mcq*2):
            question = {
                        'context': "Blabla",
                        'question': "Which company owns ABC?",
                        'options': ["Walt Disney Company", "CNN", "Facebook", "Google"],
                        'correctAnswer': 1,
                        'isSelected': False
                        }
            mcquestions.append(question)

        for i in range(no_of_fbq*2):
            question = {
                        'question': "The ________________ newspaper defined southern California",
                        'correctAnswer': 1,
                        'options':  ["New York Times", "Los Angeles Times", "San Jose Tribune", "San Francisco Tribune"],
                        'isSelected': False
                        }
            fbquestions.append(question)

        for i in range(no_of_tfq*2):
            question = {
                        'question': "Southern California is often abbreviated SoCal.",
                        'correctAnswer': "true",
                        'isSelected': False
                        }
            tfquestions.append(question)

        return {'mcq': mcquestions, 'fbq': fbquestions, 'tfq': tfquestions}

    def save_questions(self, questions_data, db):
        try:
            questions = questions_data['questions']
            tfq = questions['tfq']
            mcq = questions['mcq']
            fbq = questions['fbq']
            quiz_id = questions_data['quiz_id']
            for question in tfq:
                if question['isSelected']:
                    db.questions.insert_one({
                        'question': question['question'],
                        'answer': question['correctAnswer'],
                        'type': 'tfq',
                        'quiz_id': quiz_id
                    })
            for question in mcq:
                if question['isSelected']:
                    db.questions.insert_one({
                        'context': question['context'],
                        'question': question['question'],
                        'answer': question['correctAnswer'],
                        'options': question['options'],
                        'type': 'mcq',
                        'quiz_id': quiz_id
                    })
            for question in fbq:
                if question['isSelected']:
                    db.questions.insert_one({
                        'question': question['question'],
                        'answer': question['correctAnswer'],
                        'options': question['options'],
                        'type': 'fbq',
                        'quiz_id': quiz_id
                    })
            return 200, jsonify(message="Success")
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")








