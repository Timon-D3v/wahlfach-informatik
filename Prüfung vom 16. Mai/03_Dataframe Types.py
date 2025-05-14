import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
csv = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())





print(csv.dtypes)


print("""

        int64  ===  int
      float64  ===  float
         bool  ===  boolean
       object  ===  everything (Most likely text)
      
"""
)
