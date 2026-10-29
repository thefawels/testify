#!/usr/bin/env python3
"""Resize a square PNG into the app's favicon and PWA icons."""
from pathlib import Path
import sys
from PIL import Image
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'assets/icon-source.png'
with Image.open(source) as original:
    if original.width != original.height:
        raise SystemExit('Use a square source image, ideally 1024 x 1024 pixels.')
    rgba = original.convert('RGBA')
    background = Image.new('RGBA', rgba.size, '#242424')
    background.alpha_composite(rgba)
    image = background.convert('RGB')
    for size, name in [(32,'favicon-32.png'), (180,'apple-touch-icon.png'), (192,'icon-192.png'), (512,'icon-512.png')]:
        image.resize((size,size),Image.Resampling.LANCZOS).save(root/'docs'/name)
    image.resize((512,512),Image.Resampling.LANCZOS).save(root/'docs'/'icon-maskable-512.png')
print('Created five PNG icons in docs/. Keep the main symbol within the central safe area for maskable icons.')
