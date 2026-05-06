import feedparser
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime

FEED_URL = "https://hypotyposes.substack.com/feed.xml"
OUTPUT = "_data/posts.json"
MOIS_FR = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
]

def clean_summary(raw_html, max_length=200):
    # 1. Parse HTML
    soup = BeautifulSoup(raw_html, "html.parser")
    soup = soup.find("p")
    return soup.get_text(separator=" ")

def extract_image(entry):
    if "links" in entry:
        for link in entry.links:
            if link.get("type", "").startswith("image"):
                return link.get("href")
    return None

def extract_date(entry):

    pubDate = entry.published
    dt = datetime.strptime(pubDate, "%a, %d %b %Y %H:%M:%S GMT")
    jour = dt.day
    mois = MOIS_FR[dt.month - 1]
    annee = dt.year
    return f"{jour} {mois} {annee}"

def extract_subtitle(entry):
    summary = entry.summary
    if len(summary) <=50:
        return summary
    return None

def extract_summary(entry):
    summary = entry.summary
    if len(summary) > 50:
        return summary
    return clean_summary(entry["content"][0]["value"])

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Referer": "https://www.google.com/",
}

session = requests.Session()
session.headers.update(headers)

response = session.get(FEED_URL)

response.raise_for_status()

feed = feedparser.parse(response.content)

print("Entries:", len(feed.entries))

posts = []

for entry in feed.entries[:10]:
    posts.append({
        "title": entry.title,
        "subtitle": extract_subtitle(entry),
        "summary": extract_summary(entry),
        "url": entry.link,
        "image": extract_image(entry),
        "pubDate": extract_date(entry),
    })

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)