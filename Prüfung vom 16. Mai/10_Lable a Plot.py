import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



# To lable a plot, create a plot
dataframe.plot.scatter(x="release_year", y="runtime", label="Custom Datapoints")


# Then call matplotlib functions to customize it.
plt.legend()                                # - Automatically adds a legend, for labels set in the plot function
plt.title("Custom Title")                   # - Lets you set your own custom title that you give as a argument string.
plt.xlabel("Release year of a Film")        # - Lets you set your own custom lable for the x-Axis
plt.ylabel("Length of a Film in Minutes")   # - Lets you set your own custom lable for the y-Axis


# Show the plot
plt.show()