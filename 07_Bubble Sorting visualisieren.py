import tkinter as tk
import random

class BubbleSortVisualizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Bubble Sort Visualizer")
        self.canvas = tk.Canvas(root, width=500, height=500, bg="white")
        self.canvas.pack()
        self.array = [random.randint(1, 500) for _ in range(50)]
        self.rects = []
        self.draw_array()

    def draw_array(self, rect_1=0, rect_2=1):
        self.canvas.delete("all")
        bar_width = 500 / len(self.array)
        for i, val in enumerate(self.array):
            x0 = i * bar_width
            y0 = 500 - val
            x1 = (i + 1) * bar_width
            y1 = 500
            rect = self.canvas.create_rectangle(x0, y0, x1, y1, fill="blue")
            self.rects.append(rect)
            if (i == rect_1 or i == rect_2):
                self.canvas.itemconfig(rect, fill="red")

    def bubble_sort_step(self):
        for i in range(len(self.array) - 1):
            if self.array[i] > self.array[i + 1]:
                self.array[i], self.array[i + 1] = self.array[i + 1], self.array[i]
                self.draw_array(i, i + 1)
                self.root.after(10, self.bubble_sort_step)
                return
        self.root.after(10, self.bubble_sort_step)

if __name__ == "__main__":
    root = tk.Tk()
    visualizer = BubbleSortVisualizer(root)
    root.after(100, visualizer.bubble_sort_step)
    root.mainloop()