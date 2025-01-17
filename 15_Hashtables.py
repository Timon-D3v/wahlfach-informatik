m = 101

numbers = ["07912345678", "0765556677", "0787776655", "0773332211", "0791112233", "0795554433"]
names = ["Mom", "Dad", "Lev", "Chris", "Zoe", "Bob"]

def hash(value):
    return value % m

def hashMultiplicative(value):
    return m * (((1/7) * value) % 1)


print("Hashing:")
for number in numbers:
    print(hash(int(number)))

print("Hashing (Multiplicative):")
for number in numbers:
    print(hashMultiplicative(int(number)))


# Kollisionsauflösung mit getrennter Verkettung
hashTable = [[] for i in range(m)]

def insert(index, value):
    hashValue = hash(index)
    hashTable[hashValue].append([index, value])

def search(value):
    # Searches a name with the given number
    hashValue = hash(value)
    array = hashTable[hashValue]

    if array == None:
        return None

    for element in array:
        if element[0] == value:
            return element[1]
        
    return None

def delete(value):
    # Deletes a name with the given number
    hashValue = hash(value)
    array = hashTable[hashValue]

    for element in array:
        if element[0] == value:
            array.remove(element)


# Kollisionsauflösung mit offener Adressierung

oHashTable = [[] for i in range(m)]

def oInsert(index, value):
    hashValue = hash(index)

    while len(oHashTable[hashValue]) != 0:
        hashValue += 1

    oHashTable[hashValue] = [index, value]

def oSearch(value):
    # Searches a name with the given number
    hashValue = hash(value)

    if len(oHashTable[hashValue]) == 0:
        return None

    while oHashTable[hashValue][0] != value:
        hashValue += 1

    return oHashTable[hashValue][1]


def oDelete(value):
    # Delete a name with a given number
    hashValue = hash(value)
    
    if len(oHashTable[hashValue]) == 0:
        for i in range(hashValue + 1, len(oHashTable)):
            if len(oHashTable[i]) != 0 and oHashTable[i][0] == value:
                oHashTable[i] = []
        return

    while oHashTable[hashValue][0] != value:
        hashValue += 1

    oHashTable[hashValue] = []



# Testing

print("\n\n\n\nKollisionsauflösung mit getrennter Verkettung")

for i in range(len(numbers)):
    insert(int(numbers[i]), names[i])
    print(search(int(numbers[i])))

print(hashTable)

for i in range(len(numbers)):
    delete(int(numbers[i]))
    print(search(int(numbers[i])))

print(hashTable)


print("\n\n\n\nKollisionsauflösung mit offener Adressierung")

for i in range(len(numbers)):
    oInsert(int(numbers[i]), names[i])
    print(oSearch(int(numbers[i])))

print(oHashTable)

for i in range(len(numbers)):
    oDelete(int(numbers[i]))
    print(oSearch(int(numbers[i])))

print(oHashTable)