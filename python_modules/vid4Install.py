import fitz  # PyMuPDF
from moviepy.editor import ImageSequenceClip
import os

# === 输入输出路径 ===
file_name = "chile"
pdf_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/pg/afterEdit/{file_name}_modified.pdf"
output_video_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/pg/afterEdit/vid/{file_name}_vid.mp4"

# pdf_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/eco/afterEdit/{file_name}_modified.pdf"
# output_video_path = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/eco/afterEdit/video/{file_name}_vid.mp4"

codec="mpeg4"

# === 临时图片输出文件夹 ===
img_folder = f"/Users/melodyu/Desktop/code.nosync/unnatural-language/results/pg/afterEdit/tmpimg"
os.makedirs(img_folder, exist_ok=True)

# === PDF转图片 ===
doc = fitz.open(pdf_path)
image_paths = []

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)  # 控制清晰度，150够清晰
    img_path = os.path.join(img_folder, f"page_{i+1}.png")
    pix.save(img_path)
    image_paths.append(img_path)

doc.close()

# === 图片转视频 ===
seconds_per_page = 30
clip = ImageSequenceClip(image_paths, durations=[seconds_per_page] * len(image_paths))
clip.write_videofile(output_video_path, fps=1,codec="mpeg4")

print(f"✅ Video saved to: {output_video_path}")
