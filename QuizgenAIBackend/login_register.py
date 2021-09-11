from flask import jsonify


def user_registration(db, user_details):
    try:
        # print(user_details)
        user = db.user_table.find_one(
            {
                'email_id': user_details['email_id']
            }
        )
        print(user)
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
    except:
        return 400, jsonify(message="Error")


def user_login(db, user_details):
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
    except:
        return 400, jsonify(message="Error")