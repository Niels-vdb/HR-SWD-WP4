import sqlite3
from sqlite3 import Error

from bcrypt_init import bcrypt
from query_model import QuerylModel
from faker import Faker
import datetime

fake = Faker()
query_model = QuerylModel(r"databases/database.db", bcrypt)


def create_connection(database):
    # Creates connection to database
    # If no connection is made, database will be created
    conn = None
    try:
        conn = sqlite3.connect(database)
        print(
            f'connection is made with sqlite database version {sqlite3.version}')
    except Error as e:
        print(e)

    return conn


def create_table(conn, create_table_sql):
    # Creates tables in database
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def table_defenitions(database):
    # Defines table columns
    create_user_table = """CREATE TABLE IF NOT EXISTS users(
                            id integer PRIMARY KEY UNIQUE NOT NULL,
                            email integer UNIQUE NOT NULL,
                            first_name text NOT NULL,
                            last_name text NOT NULL,
                            password text NOT NULL,
                            admin boolean NOT NULL
                        )"""

    create_group_table = """CREATE TABLE IF NOT EXISTS groups(
                            id integer PRIMARY KEY UNIQUE NOT NULL,
                            group_name text NOT NULL
                        )"""

    create_user_group_table = """CREATE TABLE IF NOT EXISTS user_groups(
                                user_id integer NOT NULL,
                                group_id integer NOT NULL,
                                FOREIGN KEY (user_id) REFERENCES users (id)
                                    ON DELETE CASCADE,
                                FOREIGN KEY (group_id) REFERENCES groups (id)
                                    ON DELETE SET NULL
                            )"""

    # Question types will be 0 for open questions and 1 for mc questions
    create_question_table = """CREATE TABLE IF NOT EXISTS questions(
                                id integer PRIMARY KEY UNIQUE NOT NULL,
                                question text NOT NULL,
                                type integer NOT NULL,
                                created_by integer NOT NULL,
                                FOREIGN KEY (created_by) REFERENCES users (id)
                                    ON DELETE CASCADE
                            )"""

    create_mulitiple_choice_table = """CREATE TABLE IF NOT EXISTS multiple_choice(
                                question_id integer NOT NULL,
                                option text NOT NULL,
                                FOREIGN KEY (question_id) REFERENCES questions (id)
                                    ON DELETE CASCADE
                            )"""

    create_survey_table = """CREATE TABLE IF NOT EXISTS surveys(
                                id integer PRIMARY KEY UNIQUE NOT NULL,
                                title text NOT NULL,
                                discription text,
                                anonymously boolean NOT NULL,
                                creation_date timestamp NOT NULL,
                                created_by integer NOT NULL,
                                FOREIGN KEY (created_by) REFERENCES users (id)
                                    ON DELETE SET NULL
                            )"""

    create_survey_question_table = """CREATE TABLE IF NOT EXISTS survey_questions(
                                    id integer PRIMARY KEY UNIQUE NOT NULL,
                                    survey_id integer NOT NULL,
                                    question text NOT NULL,
                                    position integer NOT NULL, 
                                    FOREIGN KEY (survey_id) REFERENCES surveys (id)
                                        ON DELETE SET NULL
                                )"""

    create_answer_table = """CREATE TABLE IF NOT EXISTS answers(
                            survey_question_id integer NOT NULL,
                            user_id integer,
                            answer text,
                            FOREIGN KEY (survey_question_id) REFERENCES survey_questions (id)
                                ON DELETE SET NULL,
                            FOREIGN KEY (user_id) REFERENCES users (id)
                                ON DELETE SET NULL
                        )"""
    
    create_mc_survey_question_table = """CREATE TABLE IF NOT EXISTS mc_survey_questions(
                                        id integer PRIMARY KEY UNIQUE NOT NULL,
                                        survey_question_id integer NOT NULL,
                                        option text,
                                        FOREIGN KEY (survey_question_id) REFERENCES survey_questions (id)
                                            ON DELETE SET NULL
                                    )"""

    # create a database connection
    conn = create_connection(database)

    # create tables
    if conn is not None:
        create_table(conn, create_user_table)
        create_table(conn, create_group_table)
        create_table(conn, create_user_group_table)
        create_table(conn, create_question_table)
        create_table(conn, create_survey_table)
        create_table(conn, create_mulitiple_choice_table)
        create_table(conn, create_answer_table)
        create_table(conn, create_survey_question_table)
        create_table(conn, create_mc_survey_question_table)
        print('Tables are created')
    else:
        print("Error! cannot create the database connection.")


def insert_into_database():
    try:
        # Fills users table with 1 admin user and 9 normal user accounts
        for i in range(10):
            name = fake.name()
            f_name = name.split()[0]
            l_name = name.split()[1]
            password = bcrypt.generate_password_hash('werkplaats4').decode('utf-8')
            email = f'{f_name}.{l_name}@email.com'.lower()
            admin = False
            if i == 0:
                admin = True
                email = 'admin@email.com'
            query = f'''INSERT INTO users (first_name, last_name, email, password, admin)
                    VALUES ("{f_name}", "{l_name}", "{email}", "{password}", {admin})'''
            query_model.insert_query(query)

        # Fills database with dummy groups
        groups = ['Everyone', 'The bosses', 'Frontend', 'Backend']
        for group in groups:
            query = f"""INSERT INTO groups (group_name)
                        VALUES ('{group}')"""
            query_model.insert_query(query)

        # Puts users in groups
        # Everyone group
        for i in range(1, 11):
            query = f"""INSERT INTO user_groups (group_id, user_id)
                        VALUES (1, {i})"""
            query_model.insert_query(query)
        # bosses group
        for i in range(1, 3):
            query = f"""INSERT INTO user_groups (group_id, user_id)
                        VALUES (2, {i})"""
            query_model.insert_query(query)
        # frontend group
        for i in range(3, 6):
            query = f"""INSERT INTO user_groups (group_id, user_id)
                        VALUES (3, {i})"""
            query_model.insert_query(query)
        # backend group
        for i in range(6, 11):
            query = f"""INSERT INTO user_groups (group_id, user_id)
                        VALUES (4, {i})"""
            query_model.insert_query(query)

        # Fills database with dummy open questions
        question_array = [
            'Hoe gaat het ermee?',
            'Hoe gaat het met je moeder?',
            'Wat voor schoenen draag je?',
            'Wat vind je van de baas?',
            'Wat vind je van het idee om een drie daags weekend te hebben?',
            'Wat heb je in de vakantie gedaan?',
            'Wat is de naam van mijn hond?',
            'Wat eet je vanavond?',
            'Waarom is het zo moeilijk om vragen te verzinnen?',
            'Wat zijn de andere manieren om dit te doen?',
            'Beschrijf wat je favoriete maaltijd is',
            'Wat vind je van het openbaar vervoer in Nederland?',
            'Nog een optie om het af te maken',
            'Wat is je bijgebleven van het afgelopen jaar?'
        ]
        for question in question_array:
            query = f"""INSERT INTO questions (question, type, created_by)
                        VALUES ('{question}', 0, 1)"""
            query_model.insert_query(query)

        # Fills database with dummy multiple choice questions
        mulitple_choice_questions_2 = [
            'Zou je meer betaalde vakantie dagen willen hebben?',
            'Gebruik je de ontspannings tuin?',
            'Is de werkdruk te hoog?',
            'Is een salarisverhoging van 4% te weinig?',
        ]
        mulitple_choice_questions_3 = [
            'Ga je nog naar concerten dit jaar?',
            'Dit is een multiple choice vraag',
            'Is het mogelijk om meerdere keuzes aan antwoorden te hebben?',
            'Een vraag met drie opties',
        ]
        mulitple_choice_questions_4 = [
            'Heeft het nog gesneeuwd dit jaar?',
            'Hoeveel antwoorden is genoeg antwoorden?',
            'Welk spel ga je spelen?',
            'Een vraag met vier opties'
        ]
        insert_mc_into_db(mulitple_choice_questions_2, 2)
        insert_mc_into_db(mulitple_choice_questions_3, 3)
        insert_mc_into_db(mulitple_choice_questions_4, 4)


        # Fill survey tables with two surveys
        # Surveys get the user 1 foreign key
        query = f"""INSERT INTO surveys (title, discription, anonymously, creation_date, created_by)
                    VALUES ('Survey 1', 'Dit is de eerste survey, deze is anoniem', 
                            True, '{datetime.datetime.now()}', 1)"""
        query_model.insert_query(query)

        query = f"""INSERT INTO surveys (title, discription, anonymously, creation_date, created_by)
                    VALUES ('Survey 2', 'Dit is de tweede survey, deze is niet anoniem', 
                            False, '{datetime.datetime.now()}', 1)"""
        query_model.insert_query(query)

        # Adds 10 questions to survey 1
        for i in range(11):
            question = query_model.single_cell_query(f'SELECT question FROM questions WHERE id = {i}')
            for q in question:
                # print(q[0])
                query = f"""INSERT INTO survey_questions (survey_id, question, position)
                            VALUES (1, '{q[0]}', {i})"""
                query_model.insert_query(query)
        
        # Adds 10 questions to survey 2
        for i in range(10, 21):
            question = query_model.single_cell_query(f'SELECT question FROM questions WHERE id = {i}')
            for q in question:
                query = f"""INSERT INTO survey_questions (survey_id, question, position)
                            VALUES (2, '{q[0]}', {i-9})"""
                query_model.insert_query(query)
        
        # Fills anwer table with dummy data
        for i in range(1, 10):
            query = f"""INSERT INTO answers (survey_question_id, user_id, answer)
                        VALUES ({i}, 2, 'some generic answer')"""
            query_model.insert_query(query)
        for i in range(10, 14):
            query = f"""INSERT INTO answers (survey_question_id, user_id, answer)
                        VALUES ({i}, 3, 'some other answer')"""
            query_model.insert_query(query)
        for i in range(14, 21):
            query = f"""INSERT INTO answers (survey_question_id, user_id, answer)
                        VALUES ({i}, 2, 'this is an answer')"""
            query_model.insert_query(query)


    except Error as e:
        print(e)
    finally:
        print('Tables are filled with dummy data')

def insert_mc_into_db(array, options:int):
    for question in array:
        query = f"""INSERT INTO questions (question, type, created_by)
                    VALUES ('{question}', 1, 1)"""
        query_model.insert_query(query)
        # Takes last enetered question and puts it in multiple choice table
        row_id = query_model.select_query("SELECT max(id) FROM questions")
        match options:
            case 2:
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'ja')"""
                query_model.insert_query(query)
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'nee')"""
                query_model.insert_query(query)
            case 3: 
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'ja')"""
                query_model.insert_query(query)
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'nee')"""
                query_model.insert_query(query)   
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'misschien')"""
                query_model.insert_query(query)
            case 4:
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'ja')"""
                query_model.insert_query(query)
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'nee')"""
                query_model.insert_query(query)   
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'misschien')"""
                query_model.insert_query(query)    
                query = f"""INSERT INTO multiple_choice (question_id, option)
                                VALUES ({row_id[0][0]}, 'altijd')"""
                query_model.insert_query(query)

if __name__ == '__main__':
    # If file is run creates and fills database with dummy data
    create_connection(r"databases/database.db")
    table_defenitions(r"databases/database.db")
    insert_into_database()
