import pandas as pd
import pathlib as path

current_path = path.Path(__file__).parent
csv = pd.read_csv((current_path / "../datasets/netflix.csv").resolve())




dataframe = csv
print(dataframe)



release_year_column = dataframe["release_year"]       # Like a js object
print(release_year_column)


# OR


release_year_column = dataframe.release_year
print(release_year_column)



# Does not work:
#       error_column = dataframe.has space
#       # Has a space
# OR
#       error_column = dataframe.copy
#       # Copy is already defined

# Fix

error_column = dataframe["has space"]
# 
error_column = dataframe["copy"]