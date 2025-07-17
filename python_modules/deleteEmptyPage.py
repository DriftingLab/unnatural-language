
#not working because of the new gen white still has sth???
import fitz  # PyMuPDF
import os
import re

file_name = "peru"
pdf_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/pg/afterEdit/{file_name}_modified.pdf"
output_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/pg/afterEdit/{file_name}_clean4vid.pdf"

doc = fitz.open(pdf_path)
pages_to_delete = []

for i, page in enumerate(doc):
    height = page.rect.height
    bottom_threshold = height - 100  # 假设页码和标题都在底部 60pt 内
    # print(height,bottom_threshold)
    
    text_blocks = page.get_text("blocks")  # 每个 block 是 (x0, y0, x1, y1, text, block_no, block_type)

    has_upper_text = False

    for block in text_blocks:
        x0, y0, x1, y1, text, *_ = block
        print(x0, y0, x1, y1, text)
        text = text.strip()
        print(text)
        if y1 > bottom_threshold:
            if re.search(r"[A-Za-z0-9]", text):  # ✅ contains letter or number
                print(i,'has sth in this page')
                has_upper_text = True
                break
            
        # if y1 < bottom_threshold and text.strip() != "":
        #     print(i,'has sth in this page')
        #     has_upper_text = True
        #     break

    if not has_upper_text:
        print(f"📄 Page {i+1} marked for deletion")
        pages_to_delete.append(i)

# 倒序删除
print(pages_to_delete)
for i in sorted(pages_to_delete, reverse=True):
    doc.delete_page(i)

doc.save(output_path)
doc.close()

print(f"✅ Cleaned PDF saved to: {output_path}")
