import os
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from google.generativeai import GenerativeModel, configure
import yaml

# Load config from config.yml
with open("config.yml", "r") as f:
    config = yaml.safe_load(f)

URL = config["site_url"]
TOPICS = config["topics"]
OUTPUT_DIR = config.get("output_dir", "blogs")

# Authenticate Gemini
configure(api_key=os.getenv("GEMINI_API_KEY"))
model = GenerativeModel("gemini-pro")

# Crawl FlashUSDT site
response = requests.get(URL, timeout=10)
response.raise_for_status()
soup = BeautifulSoup(response.text, "html.parser")
page_text = ' '.join(p.get_text(separator=" ", strip=True) for p in soup.find_all('p'))
page_text = re.sub(r"\\s+", " ", page_text)[:5000]

# Generate blog for each topic
os.makedirs(OUTPUT_DIR, exist_ok=True)
timestamp = datetime.utcnow().strftime("%Y-%m-%d")

for topic in TOPICS:
    prompt = (
        f"Based on the following FlashUSDT site content:\n\n{page_text}\n\n"
        f"Write a professional, SEO-optimized Markdown blog (~800 words) on '{topic}'. "
        "Use headings, bullet points, call to action, and include key terms like USDT, payment automation, API, and security."
    )
    result = model.generate_content(prompt)
    slug = topic.lower().replace(" ", "-").replace("/", "-")
    filename = f"{OUTPUT_DIR}/{timestamp}-{slug}.md"

    with open(filename, "w") as f:
        f.write(result.text)
    print(f"✅ Blog generated: {filename}")
