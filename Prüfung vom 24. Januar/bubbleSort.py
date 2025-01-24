test_list = [2,4,5,7,1,3,5,7,2,4,5,7,7,5,2,1,213,312,532,25]


def bubbleSort(list):
    for i in range(len(list), 0, -1):
        for j in range(len(list)-1):
            if (list[j] > list[j+1]):
                temp = list[j]
                list[j] = list[j+1]
                list[j+1] = temp

    return list

print(bubbleSort(test_list))
