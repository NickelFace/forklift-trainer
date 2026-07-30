#!/usr/bin/env python3
"""Собирает офлайн-версию тренажёра одним файлом: index.html + data.json -> dist/forklift-trainer.html

Данные вставляются в <script id="data" type="application/json">, index.html при наличии этого
блока не делает fetch. Файл открывается двойным кликом, без локального сервера.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
data = json.loads((ROOT / 'data.json').read_text(encoding='utf-8'))

payload = json.dumps(data, ensure_ascii=False).replace('</script>', '<\\/script>')
block = f'<script id="data" type="application/json">{payload}</script>\n'

anchor = '<script>\nlet DATA, QUIZ, MC;'
assert anchor in html, 'не найдено место для вставки данных в index.html'
out = html.replace(anchor, block + anchor, 1)

dist = ROOT / 'dist'
dist.mkdir(exist_ok=True)
target = dist / 'forklift-trainer.html'
target.write_text(out, encoding='utf-8')

print(f'{target.relative_to(ROOT)} — {len(out.encode()) / 1024:.0f} KB, '
      f'{len(data["quiz"])} открытых вопросов, {len(data["mc"])} тестовых')
