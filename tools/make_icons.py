# -*- coding: utf-8 -*-
"""Генерация иконок PWA в public/icons. Запуск: python tools/make_icons.py
Рисуем в 1024px и уменьшаем, чтобы края были гладкими."""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'icons')
os.makedirs(OUT, exist_ok=True)

BLUE = (47, 107, 255)
BLUE_DARK = (31, 79, 209)
WHITE = (255, 255, 255)
PALE = (214, 227, 255)
GOLD = (255, 214, 77)
S = 1024  # рабочее разрешение

FONTS = [r'C:\Windows\Fonts\segoeuib.ttf', r'C:\Windows\Fonts\arialbd.ttf',
         '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
         '/System/Library/Fonts/Supplemental/Arial Bold.ttf']


def font(size):
    for p in FONTS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def paint(size, maskable):
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # фон: для maskable — во весь холст (система сама обрежет форму),
    # для обычной — скруглённый квадрат с прозрачными углами
    if maskable:
        d.rectangle([0, 0, S, S], fill=BLUE)
    else:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=BLUE)
    # мягкий блик сверху слева, чтобы иконка не была плоской
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-S * 0.3, -S * 0.5, S * 0.9, S * 0.6], fill=(255, 255, 255, 28))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)
    # содержимое держим в центральных 80 % (безопасная зона maskable)
    f_big = font(int(S * 0.46))
    f_small = font(int(S * 0.12))
    big, small = '30', 'ENGLISH'
    b1 = d.textbbox((0, 0), big, font=f_big)
    b2 = d.textbbox((0, 0), small, font=f_small)
    w1, h1 = b1[2] - b1[0], b1[3] - b1[1]
    w2, h2 = b2[2] - b2[0], b2[3] - b2[1]
    gap = int(S * 0.025)
    bar_h = int(S * 0.03)
    total = h2 + gap + h1 + gap + bar_h
    y = (S - total) // 2
    d.text(((S - w2) // 2 - b2[0], y - b2[1]), small, font=f_small, fill=PALE)
    y += h2 + gap
    d.text(((S - w1) // 2 - b1[0], y - b1[1]), big, font=f_big, fill=WHITE)
    y += h1 + gap
    d.rounded_rectangle([S * 0.37, y, S * 0.63, y + bar_h], radius=bar_h // 2, fill=GOLD)
    return img.resize((size, size), Image.LANCZOS)


paint(192, False).save(os.path.join(OUT, 'icon-192.png'))
paint(512, False).save(os.path.join(OUT, 'icon-512.png'))
paint(512, True).save(os.path.join(OUT, 'icon-512-maskable.png'))
paint(180, True).convert('RGB').save(os.path.join(OUT, 'apple-touch-icon-180.png'))
paint(32, False).save(os.path.join(OUT, 'favicon-32.png'))
print('иконки записаны в', OUT, ':', sorted(os.listdir(OUT)))
