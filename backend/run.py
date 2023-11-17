from flask import Flask, request, jsonify, request
import datetime
from query_model import QuerylModel
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message

app = Flask(__name__)
app.config["SECRET_KEY"] = "ThisIsTheBiggestSecretEver"

bcrypt = Bcrypt(app)

DATABASE_FILE = r"databases/database.db"
query_model = QuerylModel(DATABASE_FILE, bcrypt)

# Mail config
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'werkplaats743@gmail.com'
app.config['MAIL_PASSWORD'] = 'uhgyjtvpmmkzjkup'

mail = Mail(app)


@app.route('/handle-login', methods=["GET", "POST"])
def handle_login():
    data = request.get_json()
    user = query_model.login_handler(data['email'])
    if user:
        password = user[0][4]
        if bcrypt.check_password_hash(password, data['password']):
            print('password right')
            return {'response': 'login validated',
                    'userId': user[0][0]}
        else:
            print('password false')
            return {'response': 'password not right'}
    else:
        print('not a user')
        return {'response': 'email does not exist'}


@app.route('/api/time')
def show_time():
    return {'time': datetime.datetime.now()}


@app.route('/api/question', methods=["POST"])
@app.route('/api/question/<id>', methods=["GET", "DELETE", "PATCH"])
# Question API endpoints
def question(id=None):
    if request.method == "GET":
        question = query_model.select_query(
            f"SELECT * FROM questions WHERE id = {id}")
        for data in question:
            match data[2]:
                case 0:
                    return {
                        'id': data[0],
                        'question': data[1],
                        'type': 'open',
                    }
                case 1:
                    options = query_model.single_cell_query(
                        f"""SELECT option
                            FROM multiple_choice 
                            WHERE question_id = {data[0]}""")
                    print(options)
                    return {
                        'id': data[0],
                        'question': data[1],
                        'type': 'mc',
                        'options': options
                    }

    if request.method == "POST":
        data = request.get_json()
        question = data['question']
        if "options" in data:
            options = data["options"]
            query_model.insert_new_mc_question(question, options)
        else:
            query_model.insert_new_open_question(question)

        return {"status": "Question saved"}

    if request.method == "DELETE":
        query_model.delete_question(id)
        return {"status": "OK"}

    if request.method == "PATCH":
        data = request.get_json()
        question_id = data["patch"]
        question = data["question"]
        query_model.patch_question(question_id, question)
        return {"status": "OK"}


@app.route('/api/question/user=<user_id>')
# API endpoint to get questions made by user
def questions_by_user(user_id):
    questions = query_model.questions_by_user(user_id)
    question_arr = []
    for question in questions:
        if question[2] == 0:
            question_arr.append({
                'id': question[0],
                'question': question[1],
                'type': 'open',
            })
        if question[2] == 1:
            options = query_model.single_cell_query(
                f"""SELECT option 
                    FROM multiple_choice 
                    WHERE question_id = {question[0]}""")
            question_arr.append({
                'id': question[0],
                'question': question[1],
                'type': 'mc',
                'options': options
            })

    return question_arr


@app.route('/api/question/filter/<value>')
# API endpoint to search for question
def question_filter(value):
    questions = query_model.filter_questions(value)
    question_arr = []
    for question in questions:
        user = query_model.single_cell_query(
            f"SELECT first_name, last_name FROM users WHERE id = {question[3]}")

        if question[2] == 0:
            question_arr.append({
                'id': question[0],
                'question': question[1],
                'type': 'open',
                'user': user[0],
            })
        if question[2] == 1:
            options = query_model.single_cell_query(
                f"""SELECT option
                    FROM multiple_choice 
                    WHERE question_id = {question[0]}""")

            question_arr.append({
                'id': question[0],
                'question': question[1],
                'type': 'mc',
                'user': user[0],
                'options': options
            })
    return question_arr


@app.route("/api/user", methods=["GET", "POST"])
@app.route("/api/user/<user_id>", methods=["GET", "DELETE"])
# User API endpoints
def user(user_id=None):
    if request.method == "GET":
        if user_id == None:
            users = query_model.get_all_users()
            userList = []
            for user in users:
                userList.append({
                    "id": user[0],
                    "firstName": user[2],
                    "lastName": user[3],
                    "email": user[1],
                    'admin': user[5],
                })
            return userList
        else:
            users_arr = []
            for user in user_id.split(','):
                user_info = query_model.get_user_by_id(user)
                users_arr.append({
                    "fullName": user_info[0][1],
                    "email": user_info[0][0]
                })
            return users_arr

    if request.method == "POST":
        data = request.get_json()
        for user in data:
            query_model.insert_new_user(
                user['firstName'], user['lastName'], user['email'], user['admin'])
        return {"status": "OK"}
    if request.method == "DELETE":
        query_model.delete_user(user_id)
        return {"status": "OK"}


@app.route("/api/user/filter/<value>", methods=["GET"])
# API endpoint for user filter
def filter_users(value):
    users = query_model.filter_users(value)
    userList = []
    for user in users:
        userList.append({
            "id": user[0],
            "firstName": user[2],
            "lastName": user[3],
            "email": user[1],
            'admin': user[5],

        })
    return userList


@app.route("/api/group", methods=["GET", "POST"])
# Group API endpoints
def groups():
    if request.method == "GET":
        groups = query_model.get_groups()
        group_array = []
        for group in groups:
            users = query_model.get_group_users(group[0])
            user_array = []
            for user in users:
                user_array.append(user[1])
            group_array.append({
                "groupId": group[0],
                "groupName": group[1],
                'people': user_array
            })
        return group_array
    if request.method == "POST":
        data = request.get_json()
        group_name = data["groupName"]
        group_users = data["users"]
        query_model.save_group(group_name, group_users)
        return {"status": "OK"}


@app.route("/api/survey", methods=["POST", "GET"])
@app.route("/api/survey/<survey_id>", methods=["GET"])
def survey(survey_id=None):
    if request.method == "GET":
        if survey_id == None:
            print("hello")
            surveys = query_model.get_all_surveys()
            print(surveys)
            survey_arr = []
            for survey in surveys:
                survey_arr.append({
                    "id": survey["id"],
                    "title": survey["title"],
                    "description": survey["discription"],

                })
            print(survey_arr)
            return survey_arr
        else:
            survey_info = query_model.get_survey_by_id(survey_id)
            survey_arr = {
                "title": survey_info[0]["title"],
                "description": survey_info[0]["description"],
                "questions": survey_info[0]["question"],
                "anon": survey_info[0]["anon"],
                "questions": []
            }

            for index, question in enumerate(survey_info):
                pass
                survey_arr["questions"].append({
                    "id": question[3],
                    "question": question[4],
                    "position": question[5],
                    "options": [],
                })
                if query_model.get_surevy_mc_options(question[3]):
                    options = query_model.get_surevy_mc_options(question[3])
                    for option in options:
                        survey_arr["questions"][index]["options"].append({
                            "id": option[1],
                            "option": option[0]
                        })
            return survey_arr

    if request.method == "POST":
        data = request.get_json()
        title = data["title"]
        description = data["description"]
        questions = data["questions"]
        anon = data["anon"]
        query_model.post_survey(title, description, anon, questions)
        survey_id = query_model.get_row_id('surveys')

        users = data["users"]
        groups = data["groups"]
        user_arr = []
        for group in groups:
            group_users = query_model.get_group_users(group)
            for user in group_users:
                user_arr.append({
                    "email": user[0],
                    "full_name": user[1]
                })

        for user in users:
            user_info = query_model.get_user_by_id(user)
            user_arr.append({
                "email": user_info[0][0],
                "full_name": user_info[0][1]
            })

        print(user_arr)
        for user in user_arr:
            msg = Message("Hello",
                          sender="1060880@hr.nl",
                          recipients=[user["email"]])

            if not anon:
                msg.body = f"""Hallo {user["full_name"]}!
Je ontvangt deze mail om dat je bent uitgenodigd om een vragenlijst in te vullen.
Volg de link om bij de vragenlijst te komen http://localhost:3000/make-survey/{survey_id[0][0]}"""
            if anon:
                msg.body = f"""Hallo {user["full_name"]}!
Je ontvangt deze mail om dat je bent uitgenodigd om een anonieme vragenlijst in te vullen.
Volg de link om bij de vragenlijst te komen http://localhost:3000/make-survey/{survey_id[0][0]}"""

            mail.send(msg)

        return {"status": "OK"}


@app.route("/api/answer", methods=["POST"])
@app.route("/api/answer/<question_id>", methods=["GET"])
def answer( question_id=None):
    if request.method == "POST":
        data = request.get_json()
        if isinstance(data[0], str):
            user_id = data[0]
            data.pop(0)
        
        for answer in data:
            question_id = answer["questionId"]
            answer = answer["answer"]

            if "user_id" in locals():
                query_model.save_answer(question_id, answer, user_id)
            else:
                query_model.save_answer(question_id, answer)
        return {"status": "OK"}
    if request.method == "GET":
        print(question_id)
        answers = query_model.get_answers(question_id)
        print(answers)
        answers_arr = []
        for answer in answers:
            answers_arr.append({
                "questionId": answer["questionId"],
                "userName": answer["userName"],
                "answer": answer["answer"]
            })
        print(answers_arr)
        return answers_arr


LISTEN_ALL = "0.0.0.0"
FLASK_IP = LISTEN_ALL
FLASK_PORT = 81
FLASK_DEBUG = True

if __name__ == "__main__":
    app.run(host=FLASK_IP, port=FLASK_PORT, debug=FLASK_DEBUG)
