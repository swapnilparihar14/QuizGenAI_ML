import logging
from constants import LOGGER_FORMAT
from flask import jsonify
import inspect


class CrudOperations:

    def __init__(self):
        """ Constructor """
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def get_created_quizzes(self, user_details, db):
        """
        For home page to see created quizzes by the user
        :param user_details: user details from API
        :param db: Mongodb database object
        :return: list of user quizzes and
        """
        try:
            quizzes = db.quiz.find(
                {
                    'creator_id': user_details['id']
                }
            )

            user_quizzes = []
            for quiz in quizzes:
                quiz_dict = {
                    "id": str(quiz["_id"]),
                    "name": quiz["quiz_name"],
                    "access_code": quiz["access_code"],
                    "created_on": quiz["created_on"].strftime('%Y-%m-%d %H:%M:%S')
                }
                user_quizzes.append(quiz_dict)

            return 200, jsonify(
                quizzes=user_quizzes
            )
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def take_quiz(self, quiz_details, db):
        """
        For taking a quiz that has already been created
        :params quiz_details: quiz details from API
        :params db: database object
        """
        try:
            quiz = db.quiz.find_one(
                {
                    '_id': quiz_details["quiz_id"]
                }
            )

            if quiz_details['access_code'] == quiz['access_code']:
                quiz_dict = {'quiz_id': quiz_details["quiz_id"], 'duration': quiz['duration'], 'questions': []}
                questions = db.quiz.find_one(
                    {
                        'quiz_id': quiz_details["quiz_id"]
                    }
                )

                for question in questions:
                    question_type = question['type']
                    question_dict = {'question': question['question'], 'type': question_type}
                    if question_type  == 'mcq' or question_type == 'fbq':
                        question_dict['options'] = question['options']
                    quiz_dict['questions'].append(question_dict)

                return 200, jsonify(
                    quiz=questions
                )
            else:
                return 403, jsonify(message="Invalid access code")
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")