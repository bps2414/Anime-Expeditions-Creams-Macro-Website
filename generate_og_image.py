import os
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions (Standard Open Graph 1200x630)
W, H = 1200, 630
img = Image.new('RGB', (W, H), color='#0c0e14')
draw = ImageDraw.Draw(img)

# Draw subtle outer border grid
draw.rectangle([20, 20, W-20, H-20], outline='#25293c', width=2)
draw.rectangle([40, 40, W-40, H-40], fill='#131622', outline='#1c2030', width=1)

# Fonts
try:
    # Try loading default font or truetype
    font_large = ImageFont.truetype("arial.ttf", 64)
    font_title = ImageFont.truetype("arialbd.ttf", 46)
    font_sub = ImageFont.truetype("arial.ttf", 26)
    font_badge = ImageFont.truetype("arialbd.ttf", 18)
    font_footer = ImageFont.truetype("arial.ttf", 20)
except Exception:
    font_large = font_title = font_sub = font_badge = font_footer = ImageFont.load_default()

# Header Top Tag
draw.rectangle([70, 70, 340, 105], fill='#182638', outline='#38bdf8', width=1)
draw.text((85, 78), "ROBLOX AUTOMATION", fill='#38bdf8', font=font_badge)

# Main Title
draw.text((70, 135), "Cream's Macro", fill='#6b8aff', font=font_large)
draw.text((70, 215), "Anime Expeditions Auto-Farm", fill='#ffffff', font=font_title)

# Description text
draw.text((70, 285), "Free, open-source vision-based macro engine for Roblox.", fill='#8e93a6', font=font_sub)
draw.text((70, 325), "Native window docking, task queueing, Discord webhooks & auto-recovery.", fill='#8e93a6', font=font_sub)

# Feature Badges Pill Row
badges = [
    ("100% Vision-Based (No Inject)", '#34d399'),
    ("Auto Story / Raid / Expedition", '#6b8aff'),
    ("Discord OCR Reports", '#38bdf8'),
    ("Windows 10/11 & macOS", '#a78bfa')
]

x_pos = 70
y_pos = 410
for text, color in badges:
    # calculate approx text width
    bbox = font_badge.getbbox(text)
    tw = bbox[2] - bbox[0]
    draw.rectangle([x_pos, y_pos, x_pos + tw + 30, y_pos + 42], fill='#191c2b', outline=color, width=1)
    draw.text((x_pos + 15, y_pos + 10), text, fill=color, font=font_badge)
    x_pos += tw + 45
    if x_pos > 1050:
        x_pos = 70
        y_pos += 55

# Footer line
draw.line([(70, 540), (W-70, 540)], fill='#25293c', width=1)
draw.text((70, 560), "Official Website: creamsmacro.vercel.app  •  GitHub: Cweamy/Anime-Expeditions-Creams-Macro", fill='#52566b', font=font_footer)

# Save OG Image
output_path = os.path.join(os.path.dirname(__file__), 'og-image.png')
img.save(output_path, 'PNG')
print(f"OG Image generated successfully at: {output_path}")
