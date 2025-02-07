cipherText1 = ["1000011", "1000001", "1000101", "1010011", "1000001", "1010010"]

plainText1 = ""

for character in cipherText1:
    plainText1 += chr(int(character, 2))

print(plainText1)  # "CAESAR"



# 2

cipherText2 = "VPNRZNOZIVIBMZDAZI"
mostCommonLetter2 = ["", 0]

for letter in cipherText2:
    count = cipherText2.count(letter)

    if (count > mostCommonLetter2[1]):
        mostCommonLetter2 = [letter, count]

print(mostCommonLetter2[0])


# 3


characters3 = ['0', '2', 'A', 'C', 'E', 'E', 'I', 'I', 'K', 'M', 'N', 'N', 'N', 'R', 'S', 'U', 'U']
positions3 = [4, 3, 8, 14, 13, 16, 1, 6, 15, 5, 2, 7, 17, 11, 10, 9, 12]
tupletArray3 = list(zip(positions3, characters3))
tupletArray3.sort()

for tuplet in tupletArray3:
    print(tuplet[1], end="")  # "IN20MINAUSRUECKEN"