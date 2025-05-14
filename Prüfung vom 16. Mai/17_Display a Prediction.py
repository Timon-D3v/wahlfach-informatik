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



# To display the function, we need to add the predicted values to the Dataframe
dataframe["predict"] = dataframe["lernaufwand"].apply(f)


# We need two plots to display the datapoints and the regression function
plt.scatter(dataframe["lernaufwand"], dataframe["note"], label="Noten", color="lightgreen")
plt.plot(dataframe["lernaufwand"], dataframe["predict"], label="Predicted", color="pink")


# Customize
plt.legend()
plt.title("Regression Function")
plt.xlabel("Lernaufwand")
plt.ylabel("Note")


# Show
plt.show()