import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



# When visualizing a Dataframe you need to specify which columns to use
# You can do this with specifying the x- and y-Axis
# The x and y argument needs to match a Dataframe Series Lable
print(dataframe.head())

# Now set the x to the release_year Series and y to the runtime Series
#       => Displays the length in minutes of a film respective to the release year
dataframe.plot.scatter(x="release_year", y="runtime")


# Show the plot
plt.show()