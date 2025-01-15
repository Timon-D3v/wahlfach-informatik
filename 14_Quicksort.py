# 1960 von Tony Hoare entwickelt
# Rekursiver "in place" Sortieralgorithmus


# Laufzeit: O(n log n) im Durchschnitt, O(n^2) im schlechtesten Fall



test_list = [3, 6, 7, 1, 5, 8, 2]

def partition(list, left, right):
    pivot = list[right]
    i = left
    j = right

    while i < j:
        while list[i] < pivot:
            i += 1

        while j > left and list[j] >= pivot:
            j -= 1
        
        if i <= j:
            list[i], list[j] = list[j], list[i]

    if i != right:
        list[i], list[right] = list[right], list[i]

    return i

def quicksort(list, left, right):
    # Basisfall: Liste mit Länge 0 oder 1 --> nichts zu sortieren
    if left >= right:
        return
    
    index = partition(list, left, right)

    quicksort(list, left, index - 1)
    quicksort(list, index + 1, right)

# Testen
my_list = [3, 7, 1, 8, 2, 5, 9, 4, 6]
quicksort(my_list, 0, len(my_list) - 1)
quicksort(test_list, 0, len(test_list) - 1)
print(my_list)

print(test_list) # [1, 2, 3, 5, 6, 7, 8]