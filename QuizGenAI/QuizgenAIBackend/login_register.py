import inspect
from flask import jsonify
import logging
from constants import LOGGER_FORMAT


class Authentication:

    def __init__(self):
        """ Constructor """
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def user_registration(self, db, user_details):
        try:
            user = db.user_table.find_one(
                {
                    'email_id': user_details['email_id']
                }
            )
            if user is not None:
                return 409, jsonify(message="User already exists")
            user_id = db.user_table.insert_one(
                {
                    'first_name': user_details['first_name'],
                    'last_name': user_details['last_name'],
                    'email_id': user_details['email_id'],
                    'password': user_details['password'],
                    'type': user_details['type'],
                }
            ).inserted_id
            return 201, jsonify(
                message="success",
                _id=str(user_id),
                first_name=user_details['first_name'],
                type=user_details['type']
            )
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def user_login(self, db, user_details):
        try:
            print(user_details)
            user = db.user_table.find_one(
                {
                    'email_id': user_details['email_id']
                }
            )
            if user_details['password'] == user['password']:
                return 200, jsonify(
                    message="success",
                    _id=str(user['_id']),
                    first_name=user['first_name'],
                    type=user['type']
                )
            else:
                return 403, jsonify(message="Invalid Credentials")
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")