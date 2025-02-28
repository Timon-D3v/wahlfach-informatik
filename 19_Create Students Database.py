from sqlite3 import *

# Create a connection to the database
# If the database does not exist, it will be created
with connect("school.db") as connection:

    # Create a cursor to perform operations
    cursor = connection.cursor()

    # Create a table
    cursor.execute("""CREATE TABLE IF NOT EXISTS students (
  	    first_name VARCHAR(512),
  	    last_name VARCHAR(512),
  	    year_of_entry INT,
  	    date_of_birth DATE,
  	    provisional BOOLEAN
    );""")

    print("Table created successfully")
