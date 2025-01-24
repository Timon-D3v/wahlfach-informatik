# Heaps

"""
                                Unsortierte Liste Sortierte Liste
i-tes Element auslesen          O(1)              O(1)
Das kleinste Element suchen     O(n)              O(1)
Ein beliebiges Element suchen   O(n)              O(log n)
Element am Ende einfügen        O(1)              O(n)
Element an beliebiger Position
einfügen                        O(n)              O(n)
Element am Ende löschen         O(1)              O(1)
Element am Anfang löschen       O(n)              O(n)
"""

def getRoot(heap):
    if (len(heap)>0):
        return heap[0]
    
    return None

def getParentIndex(index):
    parentIndex = (index - 1) // 2

    if (parentIndex < 1):
        return 0

    return parentIndex

def getLeftChildIndex(index):
    childIndex = 2 * index + 1

    return childIndex


def getRightChildIndex(index):
    childIndex = 2 * index + 2

    return childIndex

def getParentNode(heap, index):
    parentIndex = (index - 1) // 2

    if (parentIndex < 1):
        return getRoot(heap)

    return heap[parentIndex]

def getLeftChild(heap, index):
    childIndex = 2 * index + 1

    if (childIndex >= len(heap)):
        return None

    return heap[childIndex]


def getRightChild(heap, index):
    childIndex = 2 * index + 2

    if (childIndex >= len(heap)):
        return None

    return heap[childIndex]

def swap(heap, index1, index2):
    if (index1 >= len(heap) or index2 >= len(heap)):
        return

    heap[index1], heap[index2] = heap[index2], heap[index1]

def deleteRoot(heap):
    swap(0, len(heap) - 1)

    return heap.pop()

def swim(heap, index):
    parent = getParentNode(heap, index)

    if (index <= 0):
        return
    elif (parent > heap[index]):
        swap(heap, getParentIndex(index), index)
        swim(heap, getParentIndex(index))

def sink(heap, index):
    left = getLeftChild(heap, index)
    right = getRightChild(heap, index)

    if (left == None and right == None):
        return
    elif (right == None or right > left):
        if (left < heap[index]):
            swap(heap, getLeftChildIndex(index), index)
            sink(heap, getLeftChildIndex(index))
    elif (right < heap[index]):
            swap(heap, getRightChildIndex(index), index)
            sink(heap, getRightChildIndex(index))


def add(heap, value):
    heap.append(value)
    swim(heap, len(heap)-1)

test_list = [2,4,5,7,1,3,5,7,2,4,5,7,7,5,2,1,213,312,532,25]
heap = []

for element in test_list:
    add(heap, element)

print(heap)

print(getRoot(heap))
for i in range(0, len(heap)):
    print("Index Number:", i)
    print("Value", heap[i])
    print(getParentNode(heap, i))
    print(getLeftChild(heap, i))
    print(getRightChild(heap, i))


print("Deleted Root", heap)
