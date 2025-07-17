import pymupdf
import pandas as pd
from python_modules.settings import *
from tqdm import tqdm

def apply_transparency(rgb, transparency):

    transparency = transparency * 0.85 + 0.15

    r = (1 - transparency) + rgb[0] * transparency
    g = (1 - transparency) + rgb[1] * transparency
    b = (1 - transparency) + rgb[2] * transparency

    return (r, g, b)

def highlight_pdf(p_oripdf, p_save, filename, sentences_to_highlight, values, color):

    print(f"Processing {filename}")

    doc = pymupdf.open(p_oripdf)

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
                        font_size,font_name  = get_font_size_for_rect(blocks, inst)
                        text_point = pymupdf.Point(inst.x0, inst.y1)
                        page.insert_text(
                            text_point,
                            text_area,
                            fontsize = font_size - 1,
                            fontname='helv',
                            color=(1, 1, 1)
                        )
                        y_positions.append(inst.y0)

                if y_positions:  # 只有非空时才 append
                    location_page.append(page_num)
                    location_y.append(min(y_positions))
                break

#     df_pos = pd.DataFrame({'page':location_page,'y':location_y})
#     df_pos.to_csv(f"results/{filename}.csv",index=False,sep=',')

    # eco
    doc.save(p_save)
    #pg
    # doc.save(f"results/pg_july/{filename}_pg.pdf")

    print(f"{filename} result PDF saved")
    doc.close()

def get_font_size_for_rect(blocks, rect):
# old - font size has some problems
#     font_sizes = []
#     for block in blocks:
#         if block["type"] == 0:  # Text block
#             for line in block["lines"]:
#                 for span in line["spans"]:
#                     span_rect = pymupdf.Rect(span["bbox"])
#                     if rect.intersects(span_rect):
#                         font_sizes.append(span["size"])
#     if font_sizes:
#         return max(set(font_sizes), key=font_sizes.count)
#     else:
#         return 10

     best_span = None
     max_overlap = 0
     for block in blocks:
         if "lines" in block:
             for line in block["lines"]:
                 for span in line["spans"]:
                     # 计算 span bbox 与 inst 的重叠面积
                     span_rect = pymupdf.Rect(span["bbox"])
                     overlap_rect = rect & span_rect  # 两个 Rect 的交集面积
                     overlap_area = 0
                     if overlap_rect is not None:
                         overlap_area = overlap_rect.get_area()
                     if overlap_area > max_overlap:
                         max_overlap = overlap_area
                         best_span = span
     if best_span:
         # print('best span size',best_span)
         font_size=best_span["size"]
         font_name = best_span["font"]
         return font_size, font_name
     else:
         font_name = "helv"
         font_size=12
         return font_size, font_name

if __name__ == "__main__":

    file_name = "indonesia"
    save_pg_path = f"./results/{file_name}_pg.csv"


    df = pd.read_csv(save_pg_path)

    sentences = df["seq"].tolist()
    sentences = sentences[:10]


    highlight_pdf("indonesia", sentences,values,color)

