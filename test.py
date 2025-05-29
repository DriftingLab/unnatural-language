from python_modules.pdf_visualizer import highlight_pdf
import pandas as pd

nation = "argentine"

pg_color = (0.004, 0.2, 0.471) #pg
ed_color = (0, 0.29, 0.361) #ed

df = pd.read_csv(f"./tests/{nation}_ed.csv", dtype={'ecological domination': float})
sentences = df["seq"].tolist()
values = df["ecological domination"].tolist()

highlight_pdf(nation, sentences, values, ed_color)