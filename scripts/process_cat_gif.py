"""
Build the loading animation from the source GIF.

Pipeline per original frame:
  1. Crop the two fixed black side bars (cols 0-22 and 617-639 of the 640px source)
  2. Turn near-white pixels fully transparent (binary alpha: 0 or 255 only)
  3. Insert blended in-between frames so motion reads smooth instead of choppy
  4. Crop every frame to the shared content bounding box (kills the transparent
     padding that browsers intermittently paint black)
  5. Export as animated WebP (8-bit alpha, no GIF disposal artefacts)

WebP is the primary asset because GIF stores transparency as a single palette
index and uses frame disposal, which is what produced the black flash.
"""
from PIL import Image
import numpy as np
import os

ROOT = r"C:\Users\Jax\Documents\MewTinHoc"
SRC = os.path.join(ROOT, "src", "assets", "cat-cam-loading.gif")
DST_WEBP = os.path.join(ROOT, "src", "assets", "cat-cam-loading.webp")
DST_GIF = os.path.join(ROOT, "src", "assets", "cat-cam-loading-transparent.gif")

SCALE = 2              # final render size multiplier (must be int for Pillow)
WHITE_THRESHOLD = 240  # pixels with R,G,B all >= this become transparent
BLEND_BETWEEN = 1      # 1 => 45 source frames become 89 output frames
BARS_LEFT = 23         # first content column in the 640px source
BARS_RIGHT = 617       # first excluded column (exclusive) in the 640px source


def crop_black_bars(img):
    w, h = img.size
    return img.crop((BARS_LEFT, 0, BARS_RIGHT, h))


def strip_white(rgb, threshold=WHITE_THRESHOLD):
    """Near-white -> fully transparent (0,0,0,0). Everything else -> opaque."""
    arr = np.array(rgb, dtype=np.uint8)
    near_white = (arr[:, :, 0] >= threshold) & (arr[:, :, 1] >= threshold) & (arr[:, :, 2] >= threshold)
    out = np.empty((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
    out[:, :, :3] = arr
    out[:, :, 3] = np.where(near_white, 0, 255)
    return Image.fromarray(out, "RGBA")


def blend_rgba(fa, fb, alpha):
    a = np.array(fa, dtype=np.float32)
    b = np.array(fb, dtype=np.float32)
    mixed = a * (1.0 - alpha) + b * alpha
    # Composite over the shared content bbox so transparency never leaks dark RGB
    aa = a[:, :, 3:4] / 255.0
    ba = b[:, :, 3:4] / 255.0
    out_a = (aa * (1.0 - alpha) + ba * alpha)
    safe = np.maximum(out_a, 1e-6)
    out_rgb = (mixed[:, :, :3] * out_a + 255.0 * (1.0 - out_a)) / safe
    mixed[:, :, :3] = out_rgb
    mixed[:, :, 3:4] = out_a * 255.0
    return Image.fromarray(np.clip(mixed, 0, 255).astype(np.uint8), "RGBA")


def build_frames():
    src = Image.open(SRC)
    n = src.n_frames
    frames = []
    durations = []
    for i in range(n):
        src.seek(i)
        dur = src.info.get("duration", 60) or 60
        rgb = crop_black_bars(src).convert("RGB")
        rgba = strip_white(rgb).resize(
            (int((BARS_RIGHT - BARS_LEFT) * SCALE), int(480 * SCALE)), Image.LANCZOS
        )
        frames.append(rgba)
        durations.append(dur)
    return frames, durations, n


def smooth(frames, durations, blend_between=BLEND_BETWEEN):
    out_frames = []
    out_durations = []
    step = max(20, (durations[0] or 60) // (blend_between + 1))
    for i, f in enumerate(frames):
        out_frames.append(f)
        out_durations.append(step)
        if blend_between and i < len(frames) - 1:
            for k in range(1, blend_between + 1):
                out_frames.append(blend_rgba(f, frames[i + 1], k / (blend_between + 1)))
                out_durations.append(step)
    return out_frames, out_durations


def union_bbox(frames):
    minx, miny, maxx, maxy = 10**9, 10**9, -1, -1
    for f in frames:
        ys, xs = np.where(np.array(f)[:, :, 3] > 0)
        if len(xs) == 0:
            continue
        minx = min(minx, int(xs.min()))
        maxx = max(maxx, int(xs.max()))
        miny = min(miny, int(ys.min()))
        maxy = max(maxy, int(ys.max()))
    return minx, miny, maxx, maxy


def main():
    frames, durations, n = build_frames()
    print(f"Source frames: {n}  size: {frames[0].size}")

    frames, sd = smooth(frames, durations)
    print(f"Smoothed frames: {len(frames)}")

    x0, y0, x1, y1 = union_bbox(frames)
    box = (x0, y0, x1 + 1, y1 + 1)
    print(f"Content bbox: {box} -> content {box[2]-box[0]}x{box[3]-box[1]}")

    cropped = [f.crop(box) for f in frames]
    out_size = cropped[0].size

    # Normalise transparent pixels to pure white so any browser compositing quirk
    # renders them as white-on-light-bg instead of black-on-dark-bg.
    normalised = []
    for f in cropped:
        arr = np.array(f)
        arr[arr[:, :, 3] == 0] = (255, 255, 255, 0)
        normalised.append(Image.fromarray(arr, "RGBA"))

    normalised[0].save(
        DST_WEBP,
        save_all=True,
        append_images=normalised[1:],
        duration=sd,
        loop=0,
        lossless=False,
        quality=88,
        alpha_quality=100,
        method=4,
        minimize_size=True,
    )
    print(f"Saved WebP: {DST_WEBP}  {out_size}  {os.path.getsize(DST_WEBP)//1024} KB  frames={len(normalised)}")

    normalised[0].save(
        DST_GIF,
        save_all=True,
        append_images=normalised[1:],
        duration=sd,
        loop=0,
        disposal=1,
        transparency=0,
        optimize=False,
    )
    print(f"Saved GIF (fallback): {DST_GIF}  {out_size}  {os.path.getsize(DST_GIF)//1024} KB")

    normalised[0].save(os.path.join(ROOT, "src", "assets", "_check_webp.png"))


if __name__ == "__main__":
    main()