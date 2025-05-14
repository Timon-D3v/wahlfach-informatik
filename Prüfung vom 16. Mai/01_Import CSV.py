import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
csv = pd.read_csv((current_path / "../datasets/tips.csv").resolve())

print(csv.head())
