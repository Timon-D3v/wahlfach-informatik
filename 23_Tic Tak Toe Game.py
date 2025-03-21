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

def turn(x, y):
    global player, client, player_ip

    # Get coordinates of upper left 
    # corner of the clicked field
    row = int(y)
    col = int(x)
    
    client.sendMessage(player_ip + ":" + str(row) + "," + str(col))
    
    if game_over() or board_full():
        restart()
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
def restart():
    global board, player
    
    board = [
      [None, None, None],
      [None, None, None],
      [None, None, None]
    ]
    player = "X"
    
    clear()
    setColor("black")
    lineWidth(1)
    drawGrid(0, 3, 3, 0, 3, 3)
    lineWidth(5)

makeGPanel(0, 3, 3, 0, mousePressed=turn)
restart()

# Server Stuff
def handle_event(event, message):
    print(event, message)
    # Beispielhaftes Parsing: 
    # '192.168.1.10:2,1' --> erst den Teil hinter ':' holen --> '2,1'
    if ":" in message:
        coords = message.split(": ")[1]  # Teil hinter dem Doppelpunkt
    else:
        coords = message  # Falls kein ":" vorhanden (Backup-Fall)
    if "," in coords:
        rowString, colString = coords.split(",")
        row = int(rowString)
        col = int(colString)
        turn(row, col)
        print(row, col)
    else:
        # Falls kein Komma vorhanden ist, kann man eine Fehlermeldung ausgeben
        print("Unerwartetes Nachrichtenformat:", coords)

# Connect to server
server_ip = "116.203.99.55" # Anpassen
port = 43223                # Anpassen
client = TCPClient(server_ip, port, stateChanged=handle_event)
client.connect()

player_ip = input("Gib die IP des Spielpartners ein: ")



