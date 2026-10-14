"""Check local URLs in the static portfolio. External URLs are deliberately out of scope."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import sys

ROOT=Path(__file__).resolve().parents[2]
class Links(HTMLParser):
    def __init__(self):
        super().__init__();self.local=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        value=(attrs.get('href') if tag in {'a','link'} else attrs.get('src') if tag in {'img','script'} else None)
        if value:self.local.append((tag,value))

failures=[]
pages=list(ROOT.glob('*.html'))+list((ROOT/'juniper-command-center/web').glob('*.html'))
for page in pages:
    scan=Links();scan.feed(page.read_text(encoding='utf-8'))
    for tag,href in scan.local:
        link=urlsplit(href)
        if link.scheme or link.netloc or href.startswith('//') or href.startswith('#'):continue
        target=unquote(link.path)
        if not target:continue
        candidate=(page.parent/target).resolve()
        if not candidate.is_relative_to(ROOT.resolve()):
            failures.append((str(page.relative_to(ROOT)),href,'escapes repository'))
            continue
        if candidate.is_dir():candidate=candidate/'index.html'
        if not candidate.exists():
            failures.append((str(page.relative_to(ROOT)),href,'missing'))
for page,url,problem in failures:print('BROKEN',page,url,problem)
print(f'Checked {len(pages)} HTML pages; missing internal asset links: {len(failures)}')
if failures:sys.exit(1)
