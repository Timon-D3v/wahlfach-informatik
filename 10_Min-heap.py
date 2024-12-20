def getParentIndex(index):
    return (index - 1) // 2

def getLeftChildIndex(index):
	return 2 * index + 1

def getRightChildIndex(index):
	return 2 * index + 2

def swap(heap, index1, index2):
	heap[index1], heap[index2] = heap[index2], heap[index1]

def swim(heap, index):
	"""
	Move a element in the heap up one level
	"""
	while index > 0 and heap[getParentIndex(index)] > heap[index]:
		swap(heap, getParentIndex(index), index)
		index = getParentIndex(index)

def swimRecursive(heap, index):
	parentIndex = getParentIndex(index)

	if index == 0 or heap[parentIndex] < heap[index]:
		return

	swap(heap, parentIndex, index)
	swimRecursive(heap, parentIndex)

def heapAppend(heap, value):
	heap.append(value)
	index = len(heap) - 1

	while isBiggerThanParent(heap, index):
		swim(heap, index)
		index = getParentIndex(index)

def heapAppendRecursive(heap, value):
	heap.append(value)
	index = len(heap) - 1

	swimRecursive(heap, index)

def isBiggerThanParent(heap, index):
	return heap[index] < heap[getParentIndex(index)]

def isSmallerThanParent(heap, index):
	return heap[index] > heap[getParentIndex(index)]

def sink(heap, index):
	"""
	Move a element in the heap down one level
	"""
	while getLeftChildIndex(index) < len(heap):
		minIndex = getLeftChildIndex(index)
		if getRightChildIndex(index) < len(heap) and heap[getRightChildIndex(index)] < heap[minIndex]:
			minIndex = getRightChildIndex(index)

		if heap[index] < heap[minIndex]:
			break

		swap(heap, index, minIndex)
		index = minIndex
	

def sinkRecursive(heap, index):
	leftIndex = getLeftChildIndex(index)
	rightIndex = getRightChildIndex(index)

	if leftIndex >= len(heap):
		return

	minIndex = leftIndex
	if rightIndex < len(heap) and heap[rightIndex] < heap[leftIndex]:
		minIndex = rightIndex

	if heap[index] < heap[minIndex]:
		return

	swap(heap, index, minIndex)
	sinkRecursive(heap, minIndex)



heap1 = []
heap2 = []

for i in range(100, 0, -1):
	heapAppend(heap1, i)
	heapAppendRecursive(heap2, i)

print(heap1 == heap2)