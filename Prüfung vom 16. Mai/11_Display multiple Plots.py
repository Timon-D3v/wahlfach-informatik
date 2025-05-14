import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



# To add a distinction between datapoints, you need to add a new Series with the category type to the dataframe
dataframe["extra_distinction_category"] = dataframe["type"].astype("category")


# Then create the plot with the category argument c with a string, referring to the category Series name
# (Add a color map to make the plot prettier)
dataframe.plot.scatter(x="release_year", y="runtime", c="extra_distinction_category", label="Custom Datapoints", colormap="rainbow")



# Customize the plot
plt.legend()
plt.title("Custom Title")
plt.xlabel("Release year of a Film")
plt.ylabel("Length of a Film in Minutes")


# Show the plot
plt.show()