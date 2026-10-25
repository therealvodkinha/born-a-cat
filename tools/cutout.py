"""Cut a cat out of a generated picture, then frame it for the game
(see CAT_PICTURES in art.js). Needs Python 3 with Pillow and numpy.

  python3 tools/cutout.py gemini IN.jpg OUT.png [x,y ...]
                                                   Gemini paints a fake checkerboard behind
                                                   the cat: it is cleared from the edges in,
                                                   and from the points given (gaps inside the cat)
  python3 tools/cutout.py green IN.jpg OUT.png [x,y ...]
                                                   a flat green background (green screen),
                                                   cleared the same way
  python3 tools/cutout.py chatgpt IN.png OUT.png   ChatGPT gives real transparency, but
                                                   half see-through: it is made solid
  python3 tools/cutout.py match IN.png REF.png OUT.png
                                                   makes IN as light or dark as REF (another
                                                   picture of the same cat)
  python3 tools/cutout.py frame IN.png img/cats/OUT.webp sit|sleep|walk [OTHER.png ...]
                                                   with OTHER pictures (the other walking
                                                   picture), both are cut the same, so they
                                                   line up when shown in turn
"""
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter


def gemini(src, dst, *holes):
    rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.int16)
    mx, mn = rgb.max(2), rgb.min(2)
    cut(rgb, dst, ((mx - mn) < 22) & (mn > 185), holes)


def green(src, dst, *holes):
    rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.int16)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    cut(rgb, dst, (g - np.maximum(r, b) > 40) & (g > 90), holes, despill=True)


# Clears the background ("bg_like" pixels reached from the edges or from the
# points given), then cleans the edge of the cat.
def cut(rgb, dst, bg_like, holes, despill=False):
    h, w, _ = rgb.shape
    seen = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg_like[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if bg_like[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    # background seen through a gap inside the cat (between a leg and the
    # tail): its points are given by hand, as "x,y"
    for hole in holes:
        x, y = map(int, hole.split(","))
        if bg_like[y, x] and not seen[y, x]:
            seen[y, x] = True
            q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and bg_like[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    mask = Image.fromarray(np.where(seen, 0, 255).astype(np.uint8))
    mask = mask.filter(ImageFilter.MinFilter(3))
    # the edge still has the light background mixed in: give the edge the
    # colours of the fur just inside it
    inner = mask.filter(ImageFilter.MinFilter(9))
    m = np.asarray(inner).astype(np.float32) / 255
    col = rgb.astype(np.float32)
    def blur(a, r=5, passes=2):  # box blur twice, close enough to a gaussian
        for _ in range(passes):
            for axis in (0, 1):
                p = np.pad(a, [(r + 1, r) if ax == axis else (0, 0) for ax in (0, 1)], mode="edge")
                c = np.cumsum(p, axis)
                a = (np.take(c, range(2 * r + 1, c.shape[axis]), axis) - np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis)) / (2 * r + 1)
        return a
    weight = blur(m)
    est = np.stack([blur(col[..., c] * m) for c in range(3)], 2) / np.maximum(weight, 1e-3)[..., None]
    band = (m == 0) & (weight > 0.02)
    col[band] = est[band]
    if despill:  # green left in the hairs outside the fur: made grey
        out_of_fur = m < 1
        rb = np.maximum(col[..., 0], col[..., 2])
        col[..., 1] = np.where(out_of_fur, np.minimum(col[..., 1], rb + 6), col[..., 1])
    alpha = np.asarray(mask.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
    alpha[band] *= 0.9
    out = np.dstack([np.clip(col, 0, 255), alpha]).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(dst)


def chatgpt(src, dst):
    im = Image.open(src).convert("RGBA")
    lut = [0 if a < 24 else 255 if a >= 200 else int((a - 24) * 255 / 176) for a in range(256)]
    im.putalpha(im.getchannel("A").point(lut))
    im.save(dst)


def match(src, ref, dst):
    lum = lambda a: 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    a = np.asarray(Image.open(src).convert("RGBA")).astype(np.float32)
    r = np.asarray(Image.open(ref).convert("RGBA")).astype(np.float32)
    steps = np.linspace(0, 1, 257)
    have = np.quantile(lum(a)[a[..., 3] > 200], steps)
    want = np.quantile(lum(r)[r[..., 3] > 200], steps)
    light = lum(a)
    ratio = np.interp(light, have, want) / np.maximum(light, 1)
    a[..., :3] = np.clip(a[..., :3] * ratio[..., None], 0, 255)
    Image.fromarray(a.astype(np.uint8), "RGBA").save(dst)


# Every sitting picture: a 640 square, the cat 538 px tall, its paws at
# y = 576 (90 %, where the drawing's paws are), centred.
# Asleep: the same, but the ball of fur is 470 px wide.
# Walking: cut tight, 640 px wide, a few px of air around.
def frame(src, dst, kind, *others):
    boxes = [Image.open(f).getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox() for f in (src, *others)]
    box = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))
    im = Image.open(src).convert("RGBA").crop(box)
    if kind == "walk":
        scale = 620 / im.width
        im = im.resize((620, round(im.height * scale)), Image.LANCZOS)
        canvas = Image.new("RGBA", (640, im.height + 16), (0, 0, 0, 0))
        canvas.alpha_composite(im, (10, 8))
    else:
        scale = 470 / im.width if kind == "sleep" else 538 / im.height
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        canvas = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
        canvas.alpha_composite(im, ((640 - im.width) // 2, 576 - im.height))
    canvas.save(dst, "WEBP", quality=86, method=6)


if __name__ == "__main__":
    cmd, *args = sys.argv[1:]
    {"gemini": gemini, "green": green, "chatgpt": chatgpt, "match": match, "frame": frame}[cmd](*args)
