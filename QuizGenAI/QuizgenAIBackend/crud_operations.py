import json
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
                    "created_on": quiz["created_on"].strftime('%Y-%m-%d %H:%M:%S'),
                    "times_taken": 5
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
                    if question_type == 'mcq' or question_type == 'fbq':
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

    def get_all_questions(self, db, quiz_details):
        """
        For taking a quiz that has already been created
        :params quiz_details: quiz details from API
        :params db: database object
        """
        try:
            print(quiz_details)
            all_questions = db.questions.find(
                {
                    'quiz_id': quiz_details['quiz_id']
                }
            )
            to_return = list()

            to_return_tfq = list()
            to_return_mcq = list()
            to_return_fbq = list()

            to_return_dict = dict()
            to_return_wrapper = dict()
            to_return_wrapper['message'] = 'success'
            to_return_wrapper['questions'] = ''
            for question in all_questions:
                to_return.append(question)
                temp_dict = dict()

                if question['type'] == 'tfq':
                    temp_dict['question'] = question['question']
                    temp_dict['answer'] = question['answer']
                    to_return_tfq.append(temp_dict)

                if question['type'] == 'mcq':
                    temp_dict['question'] = question['question']
                    temp_dict['answer'] = question['answer']
                    temp_dict['context'] = question['context']
                    temp_dict['options'] = question['options']
                    to_return_mcq.append(temp_dict)

                if question['type'] == 'fbq':
                    temp_dict['question'] = question['question']
                    temp_dict['answer'] = question['answer']
                    temp_dict['options'] = question['options']
                    to_return_fbq.append(temp_dict)

            to_return_dict['fbq'] = to_return_fbq
            to_return_dict['mcq'] = to_return_mcq
            to_return_dict['tfq'] = to_return_tfq
            to_return_wrapper['questions'] = to_return_dict

            if all_questions is not None:
                return 200, jsonify(
                    to_return_wrapper
                )

        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")
