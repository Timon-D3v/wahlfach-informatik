def merge(list1, list2):
    combined = []

    while len(list1) > 0 and len(list2) > 0:
        if (list1[0] > list2[0]):
            combined.append(list2[0])
            list2.pop(0)
        else:
            combined.append(list1[0])
            list1.pop(0)

    # List 1 or 2 is empty

    for element in list1:
        combined.append(element)

    for element in list2:
        combined.append(element)

    print("Combined", combined)

    return combined
            

def mergeSort(array):
    if (len(array) <= 1):
        return array

    list1 = array[:len(array) // 2]
    list2 = array[len(array) // 2:]

    print(list1, list2)

    sorted1 = mergeSort(list1)
    sorted2 = mergeSort(list2)

    return merge(sorted1, sorted2)


test_list = [2,4,5,7,1,3,5,7,2,4,5,7,7,5,2,1,213,312,532,25]
print(len(test_list))

print(mergeSort(test_list))
    
