import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())




column = dataframe.release_year


# Every column of a Dataframe is a Series


series = column
print(series)
print(type(series))