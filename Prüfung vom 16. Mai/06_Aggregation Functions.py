import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())


series = dataframe.release_year


# Aggregation Functions work for every Series:
# e.g.

#           .sum()   =>    Add all Entries in the Series together
result = series.sum()
print("Sum: ", result)


#           .count()  =>   Count all rows
result = series.count()
print("Count: ", result)


#           .max()   =>    Biggest element in the Series
result = series.max()
print("Max: ", result)


#           .min()   =>    Smallest element in the Series
result = series.min()
print("Min: ", result)


#           .mean()  =>    Calculates the average of the Series
result = series.mean()
print("Mean: ", result)


#           .std()   =>    Standard deviation of the Series (DE: Standartabweichung)
result = series.std()
print("Std: ", result)


#         .unique()  =>    An Array of of all different Entries in the Series (No duplications)
result = series.unique()
print("Unique: ", result)


#  .value_counts()   =>   All different Values and how many of them there are. (Result is a new Series)
result = series.value_counts()
print("Value_counts: ", result)