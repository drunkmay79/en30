# -*- coding: utf-8 -*-
"""Сборка English 30. Запуск: python build.py
Результат:
  index.html      — локальный запуск (ярлык на рабочем столе)
  artifact.html   — страница без каркаса для claude.ai artifact
  dist/           — то, что публикуется на GitHub Pages (PWA): index.html, sw.js,
                    manifest.webmanifest и содержимое public/ (иконки, robots.txt, .nojekyll)
"""
import io, os, shutil, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
PUBLIC = os.path.join(ROOT, 'public')
DIST = os.path.join(ROOT, 'dist')
BASE = '/english30/'   # подпапка сайта на GitHub Pages: start_url и scope манифеста
JS = ['data/grammar1.js', 'data/grammar2.js', 'data/grammar3.js',
      'data/vocab1.js', 'data/vocab2.js', 'data/chunks.js',
      'core.js', 'exercises.js', 'app.js']


def rd(p):
    with io.open(p, 'r', encoding='utf-8', newline='') as f:
        return f.read().replace('\r\n', '\n')


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write(s)


ver = time.strftime('%Y-%m-%d %H:%M')
css = rd(os.path.join(SRC, 'styles.css'))
parts = []
for f in JS:
    parts.append('/* ===== %s ===== */\n%s' % (f, rd(os.path.join(SRC, f))))
js = '\n;\n'.join(parts)
for bad in ('</script', '</style'):
    if bad in js or bad in css:
        print('ОШИБКА: %s внутри исходников' % bad)
        sys.exit(1)

def fill(shell):
    return shell.replace('/*__CSS__*/', css).replace('/*__JS__*/', js).replace('__VER__', ver)

html = fill(rd(os.path.join(SRC, 'shell.html')))
wr(os.path.join(ROOT, 'index.html'), html)
wr(os.path.join(ROOT, 'artifact.html'), fill(rd(os.path.join(SRC, 'shell_artifact.html'))))

# dist для GitHub Pages
if os.path.isdir(DIST):
    shutil.rmtree(DIST)
os.makedirs(DIST)
wr(os.path.join(DIST, 'index.html'), html)
wr(os.path.join(DIST, 'sw.js'), rd(os.path.join(SRC, 'sw.js')).replace('__VER__', ver))
wr(os.path.join(DIST, 'manifest.webmanifest'), rd(os.path.join(SRC, 'manifest.webmanifest')).replace('__BASE__', BASE))
if os.path.isdir(PUBLIC):
    for name in os.listdir(PUBLIC):
        src = os.path.join(PUBLIC, name)
        dst = os.path.join(DIST, name)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)

size = len(html.encode('utf-8'))
print('index.html: %d байт, версия %s' % (size, ver))
print('dist/: ' + ', '.join(sorted(os.listdir(DIST))))
