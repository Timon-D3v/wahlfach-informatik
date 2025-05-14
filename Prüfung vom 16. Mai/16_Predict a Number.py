import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/noten.csv").resolve())


linear_function = smf.ols(formula="note ~ lernaufwand", data=dataframe).fit()

def f(x):
    # Returns the y Result
    return linear_function.params["lernaufwand"] * x + linear_function.params["Intercept"]


# To predict a value, create a new Series
# Set the name to the changing factor x (here lernaufwand)
to_predict_series = pd.Series([1, 2, 3, 4, 5], name="lernaufwand")


# Predict the result:
result = linear_function.predict(to_predict_series)

print(result)