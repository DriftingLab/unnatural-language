from python_modules.pdf_visualizer import custom_highlight_pdf
import pandas as pd

nation = "indonesia"

df = pd.read_csv(f"./tests/{nation}_pg.csv", dtype={'pro-growth': float})
sentences = df["seq"].tolist()
# sentences = sentences[:10]
values = df["pro-growth"].tolist()

custom_highlight_pdf(nation, sentences, values)