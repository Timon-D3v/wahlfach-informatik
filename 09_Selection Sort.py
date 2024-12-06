import tkinter as tk
import random
import time



window = tk.Tk()
window.title("Selection Sort")
window.geometry("500x500")

canvas = tk.Canvas(window, bg="white", width=500, height=500)

array = [random.randint(1, 500) for _ in range(50)]
bar_array = []
bar_width = 500 / len(array)
sleep = 0.1



def drawArray(array):
    canvas.delete("all")
    for i, val in enumerate(array):
        x0 = i * bar_width
        y0 = 500 - val
        x1 = (i + 1) * bar_width
        y1 = 500
        bar = canvas.create_rectangle(x0, y0, x1, y1, fill="blue", outline="blue")
        bar_array.append(bar)

def highlightBar(index, color):
    canvas.itemconfig(bar_array[index], fill=color, outline=color)

def moveBar(index, x, y):
    canvas.move(bar_array[index], x, y)

def swap(i, j):
    highlightBar(i, "red")
    highlightBar(j, "red")
    canvas.update()
    time.sleep(sleep)

    movePlaces = j - i
    animate(i, j, movePlaces * bar_width, 0, movePlaces * 10)
    canvas.update()
    time.sleep(sleep)

    bar_array[i], bar_array[j] = bar_array[j], bar_array[i]
    array[i], array[j] = array[j], array[i]

    highlightBar(i, "blue")
    highlightBar(j, "blue")
    canvas.update()

def selectionSort(array):
    for i in range(len(array)):
        minIndex = i
        for j in range(i + 1, len(array)):
            highlightBar(j, "red")
            canvas.update()
            time.sleep(sleep)
            highlightBar(j, "blue")
            canvas.update()
            if array[j] < array[minIndex]:
                minIndex = j
        swap(i, minIndex)

def animate(index_1, index_2, x, y, steps=1000):
    for i in range(steps):
        moveBar(index_1, x / steps, y / steps)
        moveBar(index_2, -x / steps, -y / steps)
        canvas.update()
        time.sleep(sleep / (steps * 10))




drawArray(array)
canvas.pack()
selectionSort(array)



window.mainloop()