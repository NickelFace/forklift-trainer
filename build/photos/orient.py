import subprocess, sys, os, glob, tempfile
src, dst, skip = sys.argv[1], sys.argv[2], int(sys.argv[3])
os.makedirs(dst, exist_ok=True)
for f in glob.glob(f'{dst}/p-*.jpg'): os.remove(f)
files = sorted(os.listdir(src))[skip:]
def score(png):
    out = subprocess.run(['tesseract', png, '-', '--psm', '6', 'tsv'], capture_output=True, text=True).stdout
    s = 0
    for line in out.splitlines()[1:]:
        c = line.split('\t')
        if len(c) >= 12 and c[11].strip():
            try: conf = float(c[10])
            except: continue
            w = c[11].strip()
            if conf > 60 and len(w) > 2 and any(ch.isalpha() for ch in w): s += conf
    return s
for i, f in enumerate(files, 1):
    flat = tempfile.mktemp(suffix='.png')
    subprocess.run(['convert', f'{src}/{f}', '-colorspace', 'gray', '(', '+clone', '-blur', '0x40', ')', '-compose', 'Divide_Dst', '-composite', '-normalize', '-level', '8%,96%', '-resize', '1300x1300>', flat], check=True)
    best, bestrot = -1, 0
    for rot in (0, 90, 180, 270):
        t = tempfile.mktemp(suffix='.png')
        subprocess.run(['convert', flat, '-rotate', str(rot), '-resize', '60%', t], check=True)
        sc = score(t); os.remove(t)
        if sc > best: best, bestrot = sc, rot
    name = f'{dst}/p-{i:02d}.jpg'
    subprocess.run(['convert', flat, '-rotate', str(bestrot), '-quality', '84', name], check=True)
    os.remove(flat)
    print(f'{name} <- {f} rot={bestrot} score={best:.0f}', flush=True)
