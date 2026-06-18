"""Download logistics images into ./images/"""
import os
import urllib.request

BASE = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(BASE, exist_ok=True)

FILES = {
    "hero.jpg": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=85&auto=format&fit=crop",
    "gallery-1.jpg": "https://images.unsplash.com/photo-1494412574645-9cae953004c0?w=800&q=80&auto=format&fit=crop",
    "gallery-2.jpg": "https://images.unsplash.com/photo-1605745341119-22a45fe92123?w=800&q=80&auto=format&fit=crop",
    "gallery-3.jpg": "https://images.unsplash.com/photo-1587293852724-70d8d2f1f440?w=800&q=80&auto=format&fit=crop",
    "gallery-4.jpg": "https://images.unsplash.com/photo-1601584112917-e72e12ffdb2b?w=800&q=80&auto=format&fit=crop",
    "gallery-5.jpg": "https://images.unsplash.com/photo-1578575437136-3edf78f3ffb2?w=800&q=80&auto=format&fit=crop",
    "gallery-6.jpg": "https://images.unsplash.com/photo-1566576721346-4c3bdba0ad9b?w=800&q=80&auto=format&fit=crop",
    "about.jpg": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&auto=format&fit=crop",
    "jobs.jpg": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&q=85&auto=format&fit=crop",
    "history-main.jpg": "https://images.unsplash.com/photo-1436491865339-9a4a968be44b?w=1000&q=85&auto=format&fit=crop",
    "history-sub.jpg": "https://images.unsplash.com/photo-1566576721346-4c3bdba0ad9b?w=600&q=85&auto=format&fit=crop",
    "contact.jpg": "https://images.unsplash.com/photo-1578575437136-3edf78f3ffb2?w=1400&q=80&auto=format&fit=crop",
}

for name, url in FILES.items():
    path = os.path.join(BASE, name)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        with open(path, "wb") as f:
            f.write(data)
        print(f"OK {name} {len(data)} bytes")
    except Exception as e:
        print(f"FAIL {name}: {e}")
