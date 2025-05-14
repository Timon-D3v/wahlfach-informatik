import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
csv = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())



print(type(123))

print(type(123.456))

print(type("String"))

print(type(csv))

print(type(pd))