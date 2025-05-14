import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



# You can group a Dataframe based on a Series name with .groupby()
grouped_dataframe = dataframe.groupby("release_year")

# Now you can perform any actions you want on the new dataframe
# E.g. you can visualize it based on the grouped factor
grouped_dataframe["title"].count().plot.line()

# Show the plot
plt.show()