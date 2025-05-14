import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



# To overlap Plots, just create two plots before calling plt.show()
# It is important ot create the two plots with matplotlib and not with .plot

plt.scatter(x=dataframe["release_year"], y=dataframe["runtime"], label="Plot 1", color="red")

plt.scatter(x=dataframe["release_year"], y=dataframe["imdb_votes"], label="Plot 2", color="green")



# Customize the plot
plt.legend()
plt.title("Custom Title")
plt.xlabel("x-Axis")
plt.ylabel("y-Axis")


# Show the plot
plt.show()