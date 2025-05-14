import pandas as pd
import matplotlib.pyplot as plt
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



# If you only want a loose oversight of you data, you can use a histogram
# You need to specify bins= to set it it the number of parts you want to have
dataframe.plot.hist(x="release_year", y="runtime", label="Custom Datapoints", colormap="rainbow", bins=5)



# Customize the plot
plt.legend()
plt.title("Custom Title")
plt.xlabel("Size")
plt.ylabel("Groups")


# Show the plot
plt.show()