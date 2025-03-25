import pymupdf
import pandas as pd
from settings import *

def highlight_and_edit_pdf(input_pdf, output_pdf, sentences_to_highlight, replacements=None):
	
	if replacements is None:
		replacements = {}
	
	doc = pymupdf.open(input_pdf)
	
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
				print(f"Found sentence {i} in page {page_num} at y-position {min(y_positions):.2f}")
				
				if sentence in replacements:
					for inst in instances:
						redact_annot = page.add_redact_annot(inst)
						redact_annot.set_text(replacements[sentence])
						page.apply_redactions()
	
	doc.save(output_pdf)
	doc.close()
	
	print(f"PDF processed. Saved as {output_pdf}")

if __name__ == "__main__":

	df = pd.read_csv(save_pg_path)
	
	sentences = df["seq"].tolist()
	sentences = sentences[:10]
	
	replacements = {}
	
	highlight_and_edit_pdf(pdf_path, highlighted_pdf_path, sentences, replacements)