from python_modules.pdf_visualizer import highlight_pdf
# from python_modules.font_test import highlight_pdf
import pandas as pd

# nation ='ARGENTINE','ALBANIA', "morocco" Brazil-3019','China-Yangtze-River','india-008','India-2565','India-3632','India-4264',‘Poland',"brazil's rural water and sanitation",
# "chile","brazil's_water_security","chile","china's yellow river basin", "peru" 
nation =["chile",
          "china's yellow river basin", 'peru']

# ['ARGENTINE','ALBANIA',"morocco" ,'Brazil-3019','China-Yangtze-River','india-008','India-2565','India-3632','India-4264',
#          'Poland',"brazil's rural water and sanitation","brazil's_water_security","chile",
#          "china's yellow river basin", 'peru']

# p_oripdf=f"csv&oripdf/5_7_oripdf/{nation}.pdf"
# p_save=f"results/eco_july/{nation}_eco.pdf"
# p_csv=f"./csv&oripdf/eco/{nation}_eco_e140.csv"

pg_color = (0.004, 0.2, 0.471) #pg
ed_color = (0, 0.29, 0.361) #ed

# df = pd.read_csv(p_csv, dtype={'ecological domination': float})
# sentences = df["seq"].tolist()
# values = df["ecological domination"].tolist()


for n in nation:
    p_oripdf=f"csv&oripdf/5_7_oripdf/{n}.pdf" #/5_7_oripdf
    p_save=f"results/pg_july/{n}_pg.pdf"
    p_csv=f"./csv&oripdf/pg/{n}_pg_e140.csv"
    
    df = pd.read_csv(p_csv, dtype={'pro-growth': float}) #ecological domination /pro-growth
    sentences = df["seq"].tolist()
    values = df["pro-growth"].tolist() #ecological domination/pro-growth


    highlight_pdf(p_oripdf, p_save, n, sentences, values, pg_color)