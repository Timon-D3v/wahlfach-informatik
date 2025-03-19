# This is a TigerJython File
from gturtle import *
from sqlite3 import *
from random import randint

#################
### Variablen ###
#################

turning_points = [] # Liste der (x,y)-Positionen, an denen sich die Head-Turtle wendet (z.B. [0, 100])
turns = []          # Liste mit Richtungen, in die sich die Head-Turtle wendet ("R" oder "L")

apple_found = False # Hat die Head-Turtle einen Apfel gefunden?
apple_diameter = 20 # Apfeldurchmesser
apple_count = 0     # Anzahl gefressener Äpfel
snake_width = 20    # Breite der Schlange
snake_step = 20     # Distanz, welche die Snake pro Animationsschritt zurücklegt


left  = 37          # Tastatur-Code für die Pfeil-nach-links-Taste
right = 39          # Tastatur-Code für die Pfeil-nach-rechts-Taste

database_name = "game.db"

#################################
### Datenbank Initialisierung ###
#################################

# Datenbank game.db (wenn nötig) erzeugen und verbinden
with connect(database_name) as con:
    cursor = con.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            user VARCHAR(40),
            password VARCHAR(40)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            achieved_score INTEGER,
            achieved_date DATETIME
        )
    """)
    
    print("Tables are created!")

###############
### Befehle ###
###############

def turn_head_turtle(key):
    pos = head_turtle.getPos() # Position der Head-Turtle
    code = key.keyCode         # Code der eben gedrückten Taste
    
    if code in [left, right] and pos not in turning_points:
        turning_points.append(head_turtle.getPos())
        if code == left:
            head_turtle.left(90)
            turns.append("L")
        elif code == right:
            head_turtle.right(90)
            turns.append("R")

def turn_tail_turtle():
    if len(turning_points) > 0 and turning_points[0] == tail_turtle.getPos():
        if turns[0] == "R":
            tail_turtle.right(90)
        else:
            tail_turtle.left(90)
        
        # Löschen
        del turns[0]
        del turning_points[0]

def make_new_apple():
    # Neuen Apfel zeichnen
    repeat:
        x = randint(-19, 19) * snake_step # [-380, 380]
        y = randint(-14, 14) * snake_step # [-280, 280]
        apple_turtle.setPos(x, y)
        if apple_turtle.getColorStr() != "darkgreen":
            break
    apple_turtle.dot(apple_diameter)
    
def game_over():
    print "Game over"

def add_score(score, time, user_id):
    with connect(database_name) as con:
        cursor = con.cursor()
        
        cursor.execute("""
            INSERT INTO scores (`user_id`, `achieved_score`, `achieved_date`) VALUES ({}, {}, {})
        """.format(user_id, score, time))
        
def get_all_scores():
    with connect(database_name) as con:
        cursor = con.cursor()
        
        cursor.execute("""
            SELECT * FROM scores
        """)
        
        return cursor.fetchall()
    
def get_all_scores_from(user_id):
    with connect(database_name) as con:
        cursor = con.cursor()
        
        cursor.execute("""
            SELECT * FROM scores WHERE user_id = {}
        """.format(user_id))
        
def get_top_x_scores(x):
    with connect(database_name) as con:
        cursor = con.cursor()
        
        cursor.execute("""
            SELECT * FROM scores ORDER BY achieved_score DESC LIMIT {}
        """.format(x))
        
        return cursor.fetchall()
    
def get_highscore_from(user_id):
    with connect(database_name) as con:
        cursor = con.cursor()
        
        cursor.execute("""
            SELECT * FROM scores WHERE user_id = {} ORDER BY achieved_score DESC LIMIT 1
        """.format(user_id))
        
        return cursor.fetchall()
    
def sign_up(username, password):
    with connect(database_name) as con:
        cursor = con.cursor()
        
        cursor.execute("""
            INSERT INTO users (`user`, `password`) VALUES ({}, {})
        """.format(username, password))
        
        return cursor.fetchall()

#####################
### Hauptprogramm ###
#####################

tf = TurtleFrame("Snake") # Turtle-Fenster (ohne Turtle) mit dem Titel "Snake" öffnen

# Define apple turtle
apple_turtle = Turtle(tf)
apple_turtle.hideTurtle()
apple_turtle.setPenColor("red")
make_new_apple()

# Define head turtle
head_turtle = Turtle(tf, keyPressed=turn_head_turtle)
head_turtle.hideTurtle()
head_turtle.setPenColor("darkgreen")
head_turtle.setPenWidth(snake_width)

# Define tail turtle
tail_turtle = Turtle(tf)
tail_turtle.hideTurtle()
tail_turtle.setPenColor("white")
tail_turtle.setPenWidth(snake_width)

# Position head turtle
head_turtle.forward(100)

repeat:
    # Head- und Tail-Turtle um snake_step verschieben
    head_turtle.forward(snake_step)
    if apple_found:
        # Skip
        apple_found = False
    else:
        tail_turtle.forward(snake_step)
        
    # Tail-Turtle neu ausrichten
    turn_tail_turtle()
    
    # Programm anhalten
    delay(80)
    
    # Kollision überprüfen
    head_turtle.penUp()
    head_turtle.forward(snake_step)
    color = head_turtle.getPixelColorStr()
    head_turtle.back(snake_step)
    head_turtle.penDown()
    
    if color != "white":
        if color == "red":
            apple_found = True
            # Apple found
            apple_count += 1
            print "Yumm! Score =", apple_count
            make_new_apple()
        else:
            game_over()
            break

