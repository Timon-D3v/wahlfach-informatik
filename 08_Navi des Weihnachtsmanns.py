import tkinter as tk;
from math import sqrt;



kids = ["Alice", "Bob", "Charlie", "David", "Eve"];
coordinates = [[13, 64], [8, 91], [35, 21], [47, 64], [70, 17]]
full_array = []

class Kid:
    def __init__(self, name, x, y):
        self.name = name
        self.x = x
        self.y = y

    def __str__(self):
        return f"{self.name} [{str(self.x)} {str(self.y)}]"

for i in range(len(kids)):
    full_array.append(Kid(kids[i], coordinates[i][0], coordinates[i][1]))



for element in full_array:
    if (element.name == "Alice"):
        # Alice ist bei ihrem Vater
        element.x = 28
        element.y = 31
    elif (element.name == "Bob"):
        # y-Cooridnate von Bob stimmt nicht ganz
        element.y = 92
    elif(element.name == "Charlie"):
        # Charlie denkt, dass es den Weihnachtsmann nicht gibt
        full_array.remove(element)

# Oscar ist der neue Nachbar von Alice
full_array.append(Kid("Oscar", 48, 30))

def distance(kid1, kid2):
    return sqrt((kid1.x - kid2.x) ** 2 + (kid1.y - kid2.y) ** 2)


north_pole = [90, 40] # Wohnort des Weihnachtsmanns
class Santa:
    x = north_pole[0]
    y = north_pole[1]

santa = Santa()

for kid in full_array:
    _distance = distance(santa, kid)
    print("The distance to", kid.name, "is", _distance)


window = tk.Tk()
window.title("Santa's Navigation")
window.geometry("500x500")
canvas = tk.Canvas(window, bg="white", width=500, height=500)
canvas.pack()
canvas_scale = 5

def getCanvasCoordinates(x, y):
    return canvas_scale * x, canvas_scale * y

def drawKid(kid, radius=2):
    x, y = getCanvasCoordinates(kid.x, kid.y)
    canvas.create_oval(x - radius * canvas_scale, y - radius * canvas_scale, x + radius * canvas_scale, y + radius * canvas_scale, fill="darkgreen", outline="darkgreen")

def drawSanta(width=4):
    x, y = getCanvasCoordinates(santa.x, santa.y)
    canvas.create_rectangle(x - width / 2 * canvas_scale, y - width / 2 * canvas_scale, x + width / 2 * canvas_scale, y + width / 2 * canvas_scale, fill="red", outline="red")

for kid in full_array:
    drawKid(kid)

drawSanta()

def drawLine(from_x, from_y, to_x, to_y):
    canvas.create_line(getCanvasCoordinates(from_x, from_y), getCanvasCoordinates(to_x, to_y), fill="gold", width=2)

def nearestNeighbor(_from):
    distance_array = []
    for kid in full_array:
        distance_array.append(distance(_from, kid))

    print(distance_array)
    min_distance = min(distance_array)
    index = distance_array.index(min_distance)

    return full_array[index]

def drawRoute(current):
    if (len(full_array) == 0):
        return

    kid = nearestNeighbor(current)

    drawLine(current.x, current.y, kid.x, kid.y)
    full_array.remove(kid)

    drawRoute(kid)

drawRoute(santa)

window.mainloop()