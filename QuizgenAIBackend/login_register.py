from flask import  jsonify


def user_registration(db, user_details):
    user = db.user_table.find_one(
        {
            'email_id': user_details['email_id']
        }
    )
    if user is not None:
        return jsonify(message="User already exists")
    user_id = db.user_table.insert_one(
        {
            'first_name': user_details['first_name'],
            'last_name': user_details['last_name'],
            'email_id': user_details['email_id'],
            'password': user_details['password'],
            'type': user_details['type'],
        }
    ).inserted_id
    return jsonify(
        message="success",
        _id=str(user_id),
        first_name=user_details['first_name'],
        type=user_details['type']
    )


def user_login(db, user_details):
    try:
        user = db.user_table.find_one(
            {
                'email_id': user_details['email_id']
            }
        )
        if user_details['password'] == user['password']:
            return jsonify(
                message="success",
                _id=str(user['_id']),
                first_name=user['first_name'],
                type=user['type']
            )
        else:
            return jsonify(message="Invalid Credentials")
    except:
        return jsonify(message="Invalid Credentials")