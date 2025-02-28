from sqlite3 import *

# Create a connection to the database
# If the database does not exist, it will be created
with connect("school.db") as connection:

    # Create a cursor to perform operations
    cursor = connection.cursor()

    fist_name = input("Enter first name: ")
    last_name = input("Enter last name: ")
    year_of_entry = input("Enter year of entry: ")
    date_of_birth = input("Enter date of birth: ")
    provisional = input("Enter provisional status (TRUE or FALSE): ")

    sql = f"INSERT INTO students VALUES ('{fist_name}', '{last_name}', {year_of_entry}, '{date_of_birth}', {provisional});"

    print(sql)

    cursor.executescript(sql)

    print("Data inserted successfully")

    cursor.execute("SELECT * FROM students")

    for student in cursor.fetchall():
        print(student)

# The code above is vulnerable to SQL injection attacks.
# The user can input SQL commands in the input fields and manipulate the database.
# To prevent this, we can use parameterized queries or use cursor.execute() which prevents executing multiple statements.
