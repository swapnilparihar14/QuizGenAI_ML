import json
import logging
import random
from constants import LOGGER_FORMAT
from flask import jsonify
import inspect
from bson.objectid import ObjectId
import datetime


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
                    'creator_id': user_details.get("id"),
                    'quiz_type': {'$ne': "practice"}
                }
            )

            user_quizzes = []
            for quiz in quizzes:
                duration, max_score = "", 0
                all_questions = db.questions.find({'quiz_id': str(quiz["_id"])})
                for question in all_questions:
                    max_score += 1
                if "duration" in quiz:
                    hrs = str(int(quiz["duration"] / 60))
                    min = str(int(quiz["duration"] % 60))
                    duration = hrs + " hr " + min + " min" if hrs != "0" else min + " min"
                quiz_dict = {
                    "id": str(quiz["_id"]),
                    "name": quiz["quiz_name"],
                    "access_code": quiz["access_code"],
                    "created_on": quiz["created_on"],
                    "no_of_questions": max_score,
                    "quiz_type": quiz["quiz_type"],
                    "duration": duration
                }
                user_quizzes.append(quiz_dict)
            return 200, jsonify(
                quizzes=user_quizzes
            )
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def get_practice_quizzes(self, db, user_details):
        """
        For home page to see created quizzes by the user
        :param user_details: user details from API
        :param db: Mongodb database object
        :return: list of user quizzes and
        """
        try:
            quizzes = db.quiz.find(
                {
                    'creator_id': user_details.get("id"),
                    'quiz_type': "practice"
                }
            )

            user_quizzes = []
            for quiz in quizzes:
                duration, max_score = "", 0
                all_questions = db.questions.find({'quiz_id': str(quiz["_id"])})
                for question in all_questions:
                    max_score += 1
                if "duration" in quiz:
                    hrs = str(int(quiz["duration"] / 60))
                    min = str(int(quiz["duration"] % 60))
                    duration = hrs + " hr " + min + " min" if hrs != "0" else min + " min"
                quiz_dict = {
                    "id": str(quiz["_id"]),
                    "name": quiz["quiz_name"],
                    "taken_on": quiz["created_on"],
                    "no_of_questions": max_score,
                    "duration": duration,
                    "score": quiz["score"]
                }
                user_quizzes.append(quiz_dict)
            return 200, jsonify(
                quizzes=user_quizzes
            )
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def take_created_quiz(self, quiz_details, practice, db):
        """
        For taking a quiz that has already been created
        :params quiz_details: quiz details from API
        :params db: database object
        """
        try:
            found = db.user_table.find_one({
                '_id': ObjectId(quiz_details.get("user_id")),
                "quizzes_taken.id": quiz_details.get("quiz_id")
            })
            if found is None:
                quiz = db.quiz.find_one({'_id': ObjectId(quiz_details.get("quiz_id"))})

                if quiz_details.get('access_code') == quiz['access_code']:
                    quiz_dict = {
                        'quiz_id': quiz_details.get("quiz_id"),
                        'duration': quiz['duration'] if 'duration' in quiz.keys() else "",
                        'questions': []
                    }
                    question_list = []
                    questions = db.questions.find(
                        {
                            'quiz_id': quiz_details.get("quiz_id")
                        }
                    )

                    for question in questions:
                        question_type = question['type']
                        question_dict = {
                            'question': question['question'],
                            'type': question_type,
                            'question_id': str(question['_id'])
                        }
                        if question_type == 'mcq' or question_type == 'fbq':
                            question_dict['options'] = question['options']
                        question_list.append(question_dict)
                    random.shuffle(question_list)
                    quiz_dict['questions'] = question_list
                    return 200, jsonify(
                        quiz=quiz_dict
                    )
                else:
                    return 403, jsonify(message="Invalid access code")
            else:
                return 403, jsonify(message="You have already taken this quiz")
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error quiz could not be fetched")

    def get_all_created_questions(self, db, quiz_details):
        """
        For taking a quiz that has already been created
        :params quiz_details: quiz details from API
        :params db: database object
        """
        try:
            all_questions = db.questions.find({'quiz_id': quiz_details.get('quiz_id')})
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

    def get_quiz_score(self, db, quiz_details):
        try:
            correct_ans, wrong_ans, your_score, max_score = 0, 0, 0, 0
            questions = quiz_details["questions"]
            user_id = quiz_details["user_id"]
            quiz_type = quiz_details["quiz_type"]
            user_ans_array = []
            time_right_now = datetime.datetime.now()
            for question in questions:
                result = db.questions.find_one({'_id': ObjectId(question["question_id"])})

                if str(result["answer"]).lower() == str(question["answer"]).lower():
                    correct_ans += 1
                    your_score += 1
                else:
                    wrong_ans += 1
                user_ans_array.append({
                    "question_id": question["question_id"],
                    "user_id": user_id,
                    "answer": question["answer"]
                })
            if user_ans_array:
                db.user_answers.insert_many(user_ans_array)
            for non_sense in quiz_details["nonsense_questions"]:
                db.questions.remove({
                    "_id": ObjectId(non_sense)
                })
            all_questions = db.questions.find({'quiz_id': quiz_details.get('quiz_id')})
            for question in all_questions:
                max_score += 1
            if quiz_type == "practice":
                db.quiz.update_one({
                    "_id": ObjectId(quiz_details.get('quiz_id'))
                }, {
                    "$set": {
                        "score": your_score
                    }
                })
            else:
                quiz = db.quiz.find_one({'_id': ObjectId(quiz_details.get("quiz_id"))})
                db.user_table.update_one({
                    "_id": ObjectId(user_id)
                }, {
                    "$push": {
                        "quizzes_taken": {
                            "id": quiz_details.get('quiz_id'),
                            "score": your_score,
                            "no_of_questions": max_score,
                            "taken_on": datetime.datetime.now(),
                            "name": quiz["quiz_name"]
                        }
                    }
                })
            return 200, jsonify(
                correct_ans=correct_ans,
                wrong_ans=wrong_ans,
                your_score=your_score,
                max_score=max_score
            )
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def get_your_taken_or_practice_quiz(self, db, quiz_details):
        """
        For taking a quiz that has already been created
        :params quiz_details: quiz details from API
        :params db: database object
        """
        try:
            all_questions = db.questions.find({'quiz_id': quiz_details.get('quiz_id')})
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
                tmp = str(question['_id'])

                if db.user_answers.find_one({'question_id': tmp, 'user_id': quiz_details.get('user_id')}):
                    user_ans = db.user_answers.find_one({'question_id': tmp, 'user_id': quiz_details.get('user_id')})
                    temp_dict['yourAnswer'] = user_ans['answer']

                else:
                    temp_dict['yourAnswer'] = ""

                # print(tmp, question['answer'], user_ans['answer'])

                if question['type'] == 'tfq':
                    temp_dict['question'] = question['question']
                    temp_dict['correctAnswer'] = question['answer']
                    to_return_tfq.append(temp_dict)

                if question['type'] == 'mcq':
                    temp_dict['question'] = question['question']
                    temp_dict['correctAnswer'] = question['answer']
                    temp_dict['options'] = question['options']
                    to_return_mcq.append(temp_dict)

                if question['type'] == 'fbq':
                    temp_dict['question'] = question['question']
                    temp_dict['correctAnswer'] = question['answer']
                    temp_dict['options'] = question['options']
                    to_return_fbq.append(temp_dict)

            to_return_dict['fbq'] = to_return_fbq
            to_return_dict['mcq'] = to_return_mcq
            to_return_dict['tfq'] = to_return_tfq
            to_return_wrapper['questions'] = to_return_dict

            # print(to_return)
            if all_questions is not None:
                return 200, jsonify(
                    to_return_wrapper
                )
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def get_taken_quizzes(self, db, quiz_details):
        """
        For taking a quiz that has already been created
        :params quiz_details: quiz details from API
        :params db: database object
        """
        try:
            quiz_details = db.user_table.find_one({'_id': ObjectId(quiz_details.get('id'))})

            quizzes = quiz_details["quizzes_taken"]

            # print(to_return)
            return 200, jsonify(
                quizzes=quizzes
            )

        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")
