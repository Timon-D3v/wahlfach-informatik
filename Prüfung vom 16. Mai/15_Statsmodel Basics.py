import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf
import pathlib as path

current_path = path.Path(__file__).parent
dataframe = pd.read_csv((current_path / "../datasets/noten.csv").resolve())


print(dataframe.head())
# => Result (y) = note
# => Changing factor (x) = lernaufwand


# If you want a linear function that is as close to all datapoints as possible, use smf.ols() 
# As formula, you want to enter "y ~ x"
#       - y is the result (Change this to match the Dataframes Series name)
#       - x is the changing factor (Change this to match the Dataframes Series name)
#       - The "~" Symbol is used instead of a equal sign
#       - You don't need to specify the gradient (m) and y-intercept (q)
# As data, you want to use a Dataframe
# Call .fit() to calculate the best possible function
linear_function = smf.ols(formula="note ~ lernaufwand", data=dataframe).fit()



# You can now get the q and m via:
print(linear_function.params)
# Intercept => q
# lernaufwand (x, Changing factor) => m


# Your final function would look like this:
#   y = m * x + q
# OR
def f(x):
    # Returns the y Result
    return linear_function.params["lernaufwand"] * x + linear_function.params["Intercept"]