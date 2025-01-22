personal_details = {
    "name": "Max",
    "age": 18,
    "siblings": [
        "Bob",
        "Alice"
    ]
}

print(personal_details)
print(personal_details["name"])

personal_details["name"] = "Maximilian"

print(personal_details["name"])




# Aufgabe 1

access_codes = {
    "bat": 3,
    "snake": 7,
    "owl": 5,
    "wolf": 1,
    "rat": 9
}

"""
Den Schlüssel cat mit dem Wert 4 hinzufügen
Das Schlüssel-Wert-Paar für den Schlüssel snake löschen
Den Wert zum Schlüssel wolf um 1 grösser machen
Mit einer for-Schleife jedes Tier und seinen Zahlenwert in die Ausgabe schreiben
"""

access_codes["cat"] = 4
del access_codes["snake"]
access_codes["wolf"] += 1

for key, value in access_codes.items():
    print("Key:", key)
    print("Value:", value)



# Aufgabe 2

labyrinth_map = {
    'left': {
        'left': {
            'right': "exit"
        },
        'right': {}
    },
    'right': {
        'right': {
            'left': {},
            'right': {}
        }
    }
}

sackgasse = {}
ausgang = "exit"


# a)

def is_valid_path(path, map):
    if (len(path) == 0):
        return True
    elif (map.get(path[0]) == None):
        return False
    elif (map.get(path[0]) == ausgang):
        return True
    elif (map.get(path[0]) == sackgasse):
        return True
    else:
        return is_valid_path(path[1:], map[path[0]])
    
print(is_valid_path([], labyrinth_map))		                           # True
print(is_valid_path(["left"], labyrinth_map))                   	   # True
print(is_valid_path(["right", "left"], labyrinth_map))			       # False
print(is_valid_path(["right", "right", "left"], labyrinth_map))        # True
print(is_valid_path(["left", "left", "right", "left"], labyrinth_map)) # True


# b)

def navigate_labyrinth(path):
    if (not is_valid_path(path, labyrinth_map)):
        return "Kein gültiger Weg."
    
    current_options = labyrinth_map
    
    for i in range(len(path)):
        if (current_options == ausgang):
            return "Gratulation! Sie haben den Ausgang gefunden."
        current_options = current_options[path[i]]

    if (current_options == ausgang):
        return "Gratulation! Sie haben den Ausgang gefunden."
    elif (current_options == sackgasse):
        return "Sackgasse. Kein Durchkommen."
    else:
        return f"Sie können in folgende Richtungen weiterlaufen: {current_options.keys()}"
    

print(navigate_labyrinth([]))
print(navigate_labyrinth(["left"]))
print(navigate_labyrinth(["right", "left"]))
print(navigate_labyrinth(["right", "right", "left"]))
print(navigate_labyrinth(["left", "left", "right", "left"]))


# c)

def is_at_end(path, maze):
    position = maze

    for i in range(len(path)):
        position = position[path[i]]

    return position == ausgang

def solve_labyrinth(path, maze):
    goNext = "right"
    tempPath = path.copy()
    tempPath.append(goNext)

    if (is_valid_path(tempPath, maze)):
        tempPath = solve_labyrinth(tempPath, maze)

        if (is_at_end(tempPath, maze)):
            return tempPath
        
    goNext = "left"
    tempPath = path.copy()
    tempPath.append(goNext)

    if (is_valid_path(tempPath, maze)):
        tempPath = solve_labyrinth(tempPath, maze)

        if (is_at_end(tempPath, maze)):
            return tempPath