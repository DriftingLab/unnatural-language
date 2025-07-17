import fitz  # PyMuPDF
import os

# === 输入输出路径 ===
file_name = "India-4264"
pdf_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/eco/{file_name}.pdf"
output_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/eco/afteredit/{file_name}_modified.pdf"

# === 打开 PDF ===
doc = fitz.open(pdf_path)
page_count = len(doc)

# === 设置页脚内容 ===
title_text = "REPUBLIC OF PERU IRRIGATION FOR CLIMATE RESILIENT AGRICULTURE PROJECT"
numofstartpage=5

for i, page in enumerate(doc):
    
    
    if i+1>=numofstartpage:
        
        width, height = page.rect.width, page.rect.height
    
        # 页码文本
        page_num_text = f"Page {i+1-numofstartpage+1} of {page_count-numofstartpage+1}"
    
        # 字体设置
        font_size = 8
        # color = (0.004, 0.2, 0.471)#pg
        color = (0.078, 0.482, 0.529) #ed
    
        # 添加标题（左下角）
        page.insert_text(
            point=(30, height - 30),  # 左下角
            text=title_text,
            fontsize=font_size,
            fontname="helv", 
            color=color
        )
    
        font_size = 10
        # 添加页码（右下角）
        page.insert_text(
            point=(width - 100, height - 30),  # 右下角
            text=page_num_text,
            fontsize=font_size,
            fontname="helv", 
            color=color
        )

# === 保存新的 PDF ===
doc.save(output_path)
doc.close()

print(f"✅ Modified PDF saved to: {output_path}")
