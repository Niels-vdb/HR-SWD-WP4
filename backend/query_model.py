import json
import sqlite3
import datetime


class QuerylModel:
    def __init__(self, database_file, bcrypt):
        self.database_file = database_file
        self.bcrypt = bcrypt

    # Functions to excecute queries
    def select_query(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(sql_query)
        result = cursor.fetchall()
        conn.close()

        return result

    def insert_query(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        conn.execute("PRAGMA foreign_keys = ON")
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(sql_query)
        conn.commit()

        return cursor.lastrowid

    def single_cell_query(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.execute(sql_query)
        result = cursor.fetchall()
        conn.close()

        return result

    def get_row_id(self, table_name):
        query = f"SELECT max(id) FROM '{table_name}'"
        return self.select_query(query)

    def login_handler(self, email):
        query = f"""SELECT * FROM users
                    WHERE email IS '{email}'"""
        return self.select_query(query)

    # Queries for questions
    def insert_new_open_question(self, question, user=1):
        query = f"""INSERT INTO questions (question, type, created_by)
                VALUES ('{question}', 0, {user})"""
        return self.insert_query(query)

    def insert_new_mc_question(self, question, options, user=1):
        query = f"""INSERT INTO questions (question, type, created_by)
                VALUES ('{question}', 1, {user})"""
        self.insert_query(query)
        row_id = self.get_row_id('questions')
        print(options)
        for option in options:
            # Need to find something better than option[0]
            if isinstance(option, list):
                mc_query = f"""INSERT INTO multiple_choice (question_id, option)
                            VALUES ({row_id[0][0]}, '{option[0]}')"""
                print("list "+mc_query)
                # self.insert_query(mc_query)
            else:
                mc_query = f"""INSERT INTO multiple_choice (question_id, option)
                            VALUES ({row_id[0][0]}, '{option}')"""
                # self.insert_query(mc_query)
                print("string "+mc_query)
        return {"status": "OK"}
    
    def delete_question(self, question_id):
        query = f"""DELETE FROM questions
                    WHERE id = {question_id}"""
        return self.insert_query(query)
    
    def patch_question(self, question_id, question):
        query = f"""UPDATE questions
                    SET question = '{question}'
                    WHERE id = {question_id}"""
        return self.insert_query(query)

    def filter_questions(self, value):
        query = f"""SELECT * FROM questions
                    WHERE question
                    LIKE '%{value}%'"""
        return self.select_query(query)

    def questions_by_user(self, user_id):
        query = f"""SELECT * FROM questions
                    WHERE created_by = {user_id}"""
        return self.select_query(query)

    # Queries for users
    def insert_new_user(self, fname, lname, email, admin):
        password = self.bcrypt.generate_password_hash(
            'werkplaats4').decode('utf-8')
        query = f"""INSERT INTO users (first_name, last_name, email, password, admin)
                    VALUES('{fname}', '{lname}', '{email}', '{password}', {admin})"""
        return self.insert_query(query)

    def get_all_users(self):
        query = "SELECT * FROM users"
        return self.select_query(query)

    def delete_user(self, user_id):
        query = f"""DELETE FROM users
                WHERE id = {user_id}"""
        return self.insert_query(query)

    def get_user_by_email(self, user_email):
        query = f"""SELECT id FROM users 
                    WHERE email = '{user_email}'"""
        return self.select_query(query)

    def get_user_by_id(self, user_id):
        query = f"""SELECT email, first_name || ' ' || last_name AS full_name 
                    FROM users 
                    WHERE id = '{user_id}'"""
        return self.select_query(query)

    def filter_users(self, value):
        query = f"""SELECT * FROM users
                    WHERE first_name
                    LIKE '%{value}%'
                    OR last_name
                    LIKE '%{value}%'
                    """
        return self.select_query(query)

    # Queries for groups
    def get_groups(self):
        query = "SELECT * FROM groups"
        return self.select_query(query)

    def get_group_users(self, group_id):
        query = f"""SELECT email, users.first_name || ' ' || users.last_name AS full_name
                    FROM user_groups
                    JOIN users
                    ON users.id = user_groups.user_id
                    WHERE group_id = {group_id}"""
        return self.select_query(query)

    def save_group(self, group_name, group_users):
        query = f"""INSERT INTO groups (group_name)
                    VALUES ('{group_name}')"""
        self.insert_query(query)

        row_id = self.get_row_id('groups')
        for user in group_users:
            user_id = self.get_user_by_email(user["email"])
            query = f"""INSERT INTO user_groups(user_id, group_id)
                        VALUES ({user_id[0][0]}, {row_id[0][0]})"""
            self.insert_query(query)
        return {"status": "OK"}

    def get_survey_by_id(self, survey_id):
        query = f"""SELECT surveys.title AS title,
                            surveys.discription AS description,
                            surveys.anonymously AS anon,
                            survey_questions.id AS question_id,
                            survey_questions.question AS question,
                            survey_questions.position AS position
                FROM surveys 
                JOIN survey_questions
                ON surveys.id = survey_questions.survey_id
                WHERE surveys.id = {survey_id}"""
        return self.select_query(query)
    
    def get_surevy_mc_options(self, question_id):
        query = f"""SELECT option, id
                    FROM mc_survey_questions 
                    WHERE survey_question_id = {question_id}"""
        return self.select_query(query)

    # Survey queries
    def post_survey(self, title, discription, anon, questions, user_id=1):
        query = f"""INSERT INTO surveys (title, discription, anonymously, 
                                        creation_date, created_by)
                    VALUES ('{title}', '{discription}', {anon}, 
                            '{datetime.datetime.now()}', 1)"""
        self.insert_query(query)

        survey_id = self.get_row_id('surveys')

        count = 1
        for question in questions:
            dictQuestion = json.loads(question)
            if "question" in dictQuestion[0]:
                query = f"""INSERT INTO survey_questions (survey_id, question, position)
                            VALUES ({survey_id[0][0]}, '{dictQuestion[0]["question"]}', {count})"""
                count += 1
                self.insert_query(query)
                if "options" in dictQuestion[0]:
                    row_id = self.get_row_id('survey_questions')
                    for option in dictQuestion[0]["options"]:
                        if isinstance(option, list):
                            query = f"""INSERT INTO mc_survey_questions (survey_question_id, option)
                                        VALUES ({row_id[0][0]}, '{option[0]}')"""
                            self.insert_query(query)
                        else:
                            query = f"""INSERT INTO mc_survey_questions (survey_question_id, option)
                                        VALUES ({row_id[0][0]}, '{option}')"""
                            self.insert_query(query)

            if "question" in dictQuestion:
                query = f"""INSERT INTO survey_questions (survey_id, question, position)
                            VALUES ({survey_id[0][0]}, '{dictQuestion["question"]}', {count})"""
                
                count += 1
                self.insert_query(query)
                if "options" in dictQuestion:
                    row_id = self.get_row_id('survey_questions')
                    for option in dictQuestion["options"]:
                        query = f"""INSERT INTO mc_survey_questions (survey_question_id, option)
                                    VALUES ({row_id[0][0]}, '{option}')"""
                        self.insert_query(query)
            

        return {"status": "saved survey"}
    
    def get_all_surveys(self):
        query = "SELECT * FROM surveys"
        return self.select_query(query)


    # Answer queries
    def save_answer(self, survey_id, answer, user_id=None):
        if user_id == None:
            query = f"""INSERT INTO answers (survey_question_id, answer)
                        VALUES ({survey_id}, '{answer}')"""
        else:
            query = f"""INSERT INTO answers (survey_question_id, answer, user_id)
                        VALUES ({survey_id}, '{answer}', {user_id})"""
        return self.insert_query(query)
    
    def get_answers(self,question_id):
        query = f"""SELECT answers.survey_question_id AS "questionId",
                        users.first_name || " " || users.last_name AS "userName",
                        answers.answer AS "answer"
                    FROM answers
					LEFT JOIN users
					ON answers.user_id = users.id
                    WHERE answers.survey_question_id = {question_id}"""
        print(query)
        return self.select_query(query)