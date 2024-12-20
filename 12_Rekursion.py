def sum_iterative(number):
    sum = 0

    for i in range(1, number + 1):
        sum += i

    return sum

def sum_recursive(number):
    if number == 1:
        return 1

    return number + sum_recursive(number - 1)


# print(sum_iterative(5))
# print(sum_recursive(5))


def fibonacci_iterative(n):
    if n == 0:
        return 0
    if n == 1:
        return 1

    a = 0
    b = 1

    for i in range(2, n + 1):
        c = a + b
        a = b
        b = c

    return b


def fibonacci_recursive(n):
    if n == 0:
        return 0
    if n == 1:
        return 1

    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)


# print(fibonacci_iterative(5))
# print(fibonacci_recursive(5))
# print(fibonacci_iterative(10))
# print(fibonacci_recursive(10))
# print(fibonacci_iterative(15))
# print(fibonacci_recursive(15))
# print(fibonacci_iterative(35))
# print(fibonacci_recursive(35))

def fibonacci_memoization(n, memo):
    if n <= 1:
        return n
    
    if n in memo:
        return memo[n]

    memo[n] = fibonacci_memoization(n - 1, memo) + fibonacci_memoization(n - 2, memo)

    return memo[n]


# print(fibonacci_memoization(35, [None] * 36))




def collaz_iterative(n):
    count = 0

    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1

        count += 1

    return count


def collaz_recursive(n):
    if n == 1:
        return 0

    if n % 2 == 0:
        return 1 + collaz_recursive(n // 2)
    else:
        return 1 + collaz_recursive(3 * n + 1)
    

# print(collaz_iterative(5))
# print(collaz_recursive(5))
# print(collaz_iterative(7))
# print(collaz_recursive(7))
# print(collaz_iterative(27))
# print(collaz_recursive(27))



def is_palindrome(word):
    if len(word) <= 1:
        return True

    return word[0] == word[-1] and is_palindrome(word[1:-1])



# test_words = ["ANNA", "OTTO", "PYTHON", "RADAR", "TEST"]
# for word in test_words:
#     if is_palindrome(word):
#         print(word, "ist ein Palindrom")
#     else:
#         print(word, "ist kein Palindrom")




def hanoi(n, source, auxiliary, target):
    if n == 1:
        # Basisfall: Wenn nur eine Scheibe bewegt werden soll
        print(f"Move disk 1 from {source} to {target}")
        return 1  # Eine Bewegung gemacht
    
    # Schritt 1: Bewege die obersten n-1 Scheiben von 'source' nach 'auxiliary' mithilfe von 'target'
    moves = hanoi(n - 1, source, target, auxiliary)
    
    # Schritt 2: Bewege die verbleibende (größte) Scheibe direkt von 'source' nach 'target'
    print(f"Move disk {n} from {source} to {target}")
    moves += 1  # Eine zusätzliche Bewegung
    
    # Schritt 3: Bewege die n-1 Scheiben von 'auxiliary' nach 'target' mithilfe von 'source'
    moves += hanoi(n - 1, auxiliary, source, target)
    
    return moves  # Gibt die Gesamtzahl der Bewegungen zurück

# Testen
n = int(input("Enter the number of disks: "))
total_moves = hanoi(n, 'A', 'B', 'C')
print(f"Total moves: {total_moves}")
