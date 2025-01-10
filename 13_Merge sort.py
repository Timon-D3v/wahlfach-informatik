def merge(list1, list2):
    """
    Assumes that list1 and list2 are sorted lists.
    """
    
    merged_list = []
    i = 0
    j = 0

    while True:
        if (list1[i] < list2[j]):
            merged_list.append(list1[i])
            i += 1
        else:
            merged_list.append(list2[j])
            j += 1

        if len(list1) == i:
            for index in range(j, len(list2)):
                merged_list.append(list2[index])
            return merged_list
        elif len(list2) == j:
            for index in range(i, len(list1)):
                merged_list.append(list1[index])
            return merged_list


def merge_sort(list):
    if (len(list) == 1):
        return list
    
    middle = len(list) // 2
    list1 = list[:middle]
    list2 = list[middle:]

    list1 = merge_sort(list1)
    list2 = merge_sort(list2)

    return merge(list1, list2)


print(merge_sort([4, 3, 2, 1, 0, 9, 8, 7, 6, 5]))