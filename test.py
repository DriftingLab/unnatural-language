from python_modules.pdf_visualizer import custom_highlight_pdf
import pandas as pd

nation = "brazil"

pg_color = (0.004, 0.2, 0.471) #pg
ed_color = (0, 0.29, 0.361) #ed

df = pd.read_csv(f"./tests/{nation}_pg.csv", dtype={'pro-growth': float})
sentences = df["seq"].tolist()
values = df["pro-growth"].tolist()

custom_highlight_pdf(nation, sentences, values, pg_color)