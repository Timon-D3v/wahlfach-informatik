from gpanel import *
from tcpcom import TCPClient

"""
Tic-tac-toe for TigerJython

      col 0  col 1  col 2
      -------------------
row 0 |     |     |     |
      -------------------
row 1 |     |     |     |
      -------------------
row 2 |     |     |     |
      -------------------

Note that the y axis is facing down, i.e.
- The coordiantes of the upper left corner are (0, 0)
- The coordinates of the lower right corner are (3, 3)
"""

# Constants
board = [
  [None, None, None],
  [None, None, None],
  [None, None, None]
]
player = "X"
player_ip = input("Gib die IP des Spielpartners ein: ")

def draw_symbol(row, col):
    if player == "X":
        setColor("red")
        line(col, row, col+1, row+1)
        line(col+1, row, col, row+1)
    else:
        move(col+0.5, row+0.5)
        setColor("blue")
        circle(0.45)

def game_over():
    # Check 3 rows
    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] != None:
            return True
    
    # Check 3 cols
    for j in range(3):
        if board[0][j] == board[1][j] == board[2][j] != None:
            return True
    
    # Check 2 diagonals
    if board[0][0] == board[1][1] == board[2][2] != None:
        return True
    
    if board[0][2] == board[1][1] == board[2][0] != None:
        return True
    
    return False

def board_full():
    # Check if all fields are occupied
    for row in board:
        for field in row:
            if (field == None):
                return False
    
    return True

def local_turn(x, y):
    turn(x, y, "local")

def turn(x, y, user):
    global player, client, player_ip
    
    if (user == "local" and player == "O"):
        print("It is not your turn")
        return
    
    if (user == "remote" and player == "X"):
        return

    # Get coordinates of upper left 
    # corner of the clicked field
    row = int(y)
    col = int(x)
    
    if (user == "local"):
        client.sendMessage(player_ip + ":" + str(row) + "," + str(col))
    
    if game_over() or board_full():
        restart(user)
        return
    
    if board[row][col] == None:
        board[row][col] = player
        draw_symbol(row, col)
        
        if game_over():
            print(player + " wins!")
            return
        
        if board_full():
            print("Draw")
        
        if player == "X":
            player = "O"
        else:
            player = "X"
    else:
        print("This field is already occupied.")

# Main program
def restart(user = "local"):
    global board, player, player_ip, client
    
    board = [
      [None, None, None],
      [None, None, None],
      [None, None, None]
    ]
    player = "X"
    
    client.sendMessage(player_ip + ":START O")
    
    clear()
    setColor("black")
    lineWidth(1)
    drawGrid(0, 3, 3, 0, 3, 3)
    lineWidth(5)

# Server Stuff
def handle_event(event, message):
    global player

    print(event, message)
    
    if ("START" in message):
        player = message[-1]
        return

    if ("," in message):
        before, after = message.split(",")
        
        beforeInt = int(before[-1])
        afterInt = int(after[0])
        
        turn(afterInt, beforeInt, "remote")
        return

# Connect to server
server_ip = "116.203.99.55" # Anpassen
port = 43223                # Anpassen
client = TCPClient(server_ip, port, stateChanged=handle_event)
client.connect()

makeGPanel(0, 3, 3, 0, mousePressed=local_turn)
restart()