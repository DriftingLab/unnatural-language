from python_modules.pdf_visualizer import custom_highlight_pdf
import pandas as pd

df = pd.read_csv("./results/indonesia_pg.csv", dtype={'pro-growth': float})
sentences = df["seq"].tolist()
# sentences = sentences[:10]
values = df["pro-growth"].tolist()

custom_highlight_pdf("indonesia", sentences, values)