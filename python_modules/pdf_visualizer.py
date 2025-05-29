import pymupdf
import pandas as pd
from python_modules.settings import *
from tqdm import tqdm

def apply_transparency(rgb, transparency):

	transparency = transparency * 0.9 + 0.1
	
	r = (1 - transparency) + rgb[0] * transparency
	g = (1 - transparency) + rgb[1] * transparency
	b = (1 - transparency) + rgb[2] * transparency
	
	return (r, g, b)

def highlight_pdf(filename, sentences_to_highlight, values, color):

	print(f"Processing {filename}")

	doc = pymupdf.open(f"tests/{filename}_original.pdf")

	location_page = []
	location_y = []

	transparency_scale = 1 / max(values)
	
	for page_num in range(len(doc)):
		page = doc[page_num]
		page.draw_rect(page.rect, color=(1, 1, 1), fill=(1, 1, 1))

	for i, sentence in enumerate(tqdm(sentences_to_highlight)):
		for page_num in range(len(doc)):
			page = doc[page_num]
			blocks = page.get_text("dict")["blocks"]
			transparency = values[i]
			actual_highlight_color = apply_transparency(color, transparency * transparency_scale)
			text_page = page.get_textpage()
			instances = list(page.search_for(sentence, textpage = text_page))
			if (len(instances) > 0):
				y_positions = []
				for inst in instances:
					text_area = page.get_textbox(inst).split("\n")[0].strip()
					if (len(text_area) > 0):
						highlight_rect = pymupdf.Rect(
							inst.x0 - 2.5,  # Expand left
							inst.y0 + 2,  # Expand top
							inst.x1 + 2.5,  # Expand right
							inst.y1 + 3.5   # Expand bottom
						)
						page.draw_rect(highlight_rect, color = actual_highlight_color, fill = actual_highlight_color, overlay = True)
						font_size = get_font_size_for_rect(blocks, inst)
						text_point = pymupdf.Point(inst.x0, inst.y1)
						page.insert_text(
							text_point,
							text_area,
							fontsize = font_size - 1,
							color=(1, 1, 1)
						)
						y_positions.append(inst.y0)
				location_page.append(page_num)
				location_y.append(min(y_positions))
				break

	df_pos = pd.DataFrame({'page':location_page,'y':location_y})
	df_pos.to_csv(f"results/{filename}.csv",index=False,sep=',')

	doc.save(f"results/{filename}.pdf")
	print(f"{filename} result PDF saved")
	doc.close()

def get_font_size_for_rect(blocks, rect):
	font_sizes = []
	for block in blocks:
		if block["type"] == 0:  # Text block
			for line in block["lines"]:
				for span in line["spans"]:
					span_rect = pymupdf.Rect(span["bbox"])
					if rect.intersects(span_rect):
						font_sizes.append(span["size"])
	if font_sizes:
		return max(set(font_sizes), key=font_sizes.count)
	else:
		return 10

if __name__ == "__main__":

	df = pd.read_csv(save_pg_path)
	
	sentences = df["seq"].tolist()
	sentences = sentences[:10]
	
	custom_highlight_pdf("indonesia", sentences)