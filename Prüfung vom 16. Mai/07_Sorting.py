import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())


series = dataframe.release_year
print(series)


# You can test an entire Series against a boolean:
result = series == 2021
print(result)



# To keep only the rows you need on a Dataframe you can put a boolean in brackets [boolean]:
# The result is another Dataframe
year_2021_dataframe = dataframe[series == 2021]
only_first_in_dataframe = dataframe[series.index == 0]

print(year_2021_dataframe)
print(only_first_in_dataframe)