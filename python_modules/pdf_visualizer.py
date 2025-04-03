import pymupdf
import pandas as pd
from python_modules.settings import *

def highlight_pdf(filename, sentences_to_highlight):
                           
	doc = pymupdf.open(f"tests/{filename}.pdf")

	location_page = []
	location_y = []
	
	for page_num in range(len(doc)):
		page = doc[page_num]
		
		for i, sentence in enumerate(sentences_to_highlight):
			
			instances = list(page.search_for(sentence))
			
			if (len(instances) > 0):
				y_positions = []
				for inst in instances:
					y_positions.append(inst.y0)
					highlight = page.add_highlight_annot(inst)
					highlight.update()
				location_page.append(page_num)
				location_y.append(min(y_positions))

	df_pos = pd.DataFrame({'page':location_page,'y':location_y})
	df_pos.to_csv(f"results/{filename}.csv",index=False,sep=',')
	
	doc.save(f"results/{filename}.pdf")
	doc.close()

if __name__ == "__main__":

	df = pd.read_csv(save_pg_path)
	
	sentences = df["seq"].tolist()
	sentences = sentences[:10]
	
	highlight_and_edit_pdf(pdf_path, highlighted_pdf_path, sentences)