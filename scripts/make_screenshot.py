"""
Create a screenshot-style mockup of the new LoadingScreen so we can verify visually.
"""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = r"C:\Users\Jax\Documents\MewTinHoc"

# Background (warm gradient like the LoadingScreen)
W, H = 1200, 800
bg = Image.new("RGB", (W, H), (255, 252, 247))
draw = ImageDraw.Draw(bg)

# soft gradient
for y in range(0, H, 2):
    t = y / H
    r = int(255 - 28 * t)
    g = int(252 - 60 * t)
    b = int(247 - 138 * t)
    draw.rectangle([0, y, W, y + 2], fill=(r, g, b))

# soft radial highlights
def soft_circle(cx, cy, radius, color, alpha=70):
    for r in range(radius, 0, -1):
        a = int(alpha * (1 - r/radius))
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(color[0], color[1], color[2], a))
soft_circle(int(W*0.2), int(H*0.2), 280, (251,191,36))
soft_circle(int(W*0.85), int(H*0.8), 260, (234,88,12))

# Cat (transparent) - center
cat = Image.open(os.path.join(ROOT, "src/assets/cat-cam-loading-transparent.gif")).convert("RGBA")
ratio = 380 / cat.size[0]
new_size = (380, int(cat.size[1]*ratio))
cat = cat.resize(new_size, Image.LANCZOS)
cat_x = (W - new_size[0]) // 2
cat_y = (H - new_size[1]) // 2 - 30
bg.paste(cat, (cat_x, cat_y), cat)

# Spinner dots (orange gradient) just below cat
spinner_y = cat_y + new_size[1] + 28
for i, dx in enumerate([-16, 0, 16]):
    color = (234, 88, 12) if i != 1 else (196, 64, 12)
    draw.ellipse([(W//2)+dx-7, spinner_y-7, (W//2)+dx+7, spinner_y+7], fill=color)

# Progress bar
bar_w = 320
bar_h = 5
bar_x = (W - bar_w) // 2
bar_y = spinner_y + 30
draw.rounded_rectangle([bar_x, bar_y, bar_x+bar_w, bar_y+bar_h], radius=bar_h//2, fill=(245,222,180))
# progress accent
draw.rounded_rectangle([bar_x, bar_y, bar_x+int(bar_w*0.45), bar_y+bar_h], radius=bar_h//2, fill=(234,88,12))

# Hint text
try:
    f_hint = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 18)
    f_credit = ImageFont.truetype(r"C:\Windows\Fonts\segoeuii.ttf", 18)
except Exception:
    f_hint = f_credit = ImageFont.load_default()
hint = "Đang khởi động TinHocPro..."
bbox = draw.textbbox((0,0), hint, font=f_hint)
tw = bbox[2] - bbox[0]
draw.text(((W-tw)//2, bar_y + 22), hint, fill=(124, 45, 18), font=f_hint)

# @ThanhNhi top-left (with chip background)
chip_text = "@ThanhNhi"
cb = draw.textbbox((0,0), chip_text, font=f_credit)
cw = cb[2] - cb[0] + 32
ch = cb[3] - cb[1] + 14
draw.rounded_rectangle([20, 20, 20+cw, 20+ch], radius=ch, fill=(255, 252, 247, 220), outline=(124,45,18))
# little dot before text
dot_x = 20 + 16
dot_y = 20 + ch//2
draw.ellipse([dot_x-4, dot_y-4, dot_x+4, dot_y+4], fill=(234,88,12))
draw.text((20 + 28, 20 + 4), chip_text, fill=(124,45,18), font=f_credit)

bg.save(os.path.join(ROOT, "src/assets/_loading-screenshot.png"))
print("screenshot saved")
