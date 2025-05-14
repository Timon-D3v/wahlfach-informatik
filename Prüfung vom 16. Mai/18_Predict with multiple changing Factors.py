import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/50_Startups.csv").resolve())


# Use a + to add multiple changing factors
multidimensional_function = smf.ols(formula="profit ~ rd + marketing + admin", data=dataframe).fit()

to_predict_dataframe = pd.DataFrame({
    "rd": [1000000],
    "marketing": [1000000],
    "admin": [1000000]
})

# Predict a whole Dataframe instead of a Series
result = multidimensional_function.predict(to_predict_dataframe)

print(result)