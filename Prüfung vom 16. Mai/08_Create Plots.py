import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())




# You can visualize a Dataframe/Series by calling the .plot method on it 
# followed by the type of plot you like (e.g. pie or scatter)
#
# With .value_counts() you can create a Series that can easily be visualized with a plot
movie_or_show_series = dataframe["type"].value_counts()

# Create the plot
movie_or_show_series.plot.pie()


# To show the plot, call the .show() method on the matplotlib object
plt.show()


# Other plot type examples:
# Bar:
movie_or_show_series.plot.bar()

plt.show()
