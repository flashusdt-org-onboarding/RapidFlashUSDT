import os
import re
import requests
import yaml
from bs4 import BeautifulSoup
from datetime import datetime
from google.generativeai import GenerativeModel, configure

# ✅ Load configuration
with open("config.yml", "r") as f:
    config = yaml.safe_load(f)

URL = config["site_url"]
TOPICS = config["topics"]
OUTPUT_DIR = config.get("output_dir", "blogs")

# ✅ Configure Gemini using the correct model ID
configure(api_key=os.getenv("GEMINI_API_KEY"))
model = GenerativeModel("models/gemini-pro")  # ← fixed 404

# ✅ Scrape content from the FlashUSDT landing page
try:
    response = requests.get(URL, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    page_text = ' '.join(p.get_text(separator=" ", strip=True) for p in soup.find_all('p'))
    page_text = re.sub(r"\\s+", " ", page_text)[:5000]
except Exception as e:
    print(f"❌ Failed to fetch or parse URL: {e}")
    exit(1)

# ✅ Generate blog posts for each topic
os.makedirs(OUTPUT_DIR, exist_ok=True)
timestamp = datetime.utcnow().strftime("%Y-%m-%d")

for topic in TOPICS:
    prompt = (
        f"Using the following content from FlashUSDT's official site:\n\n{page_text}\n\n"
        f"Write a professional, SEO-optimized blog post (~800 words) on:\n"
        f"'{topic}'\n\n"
        f"Use:\n"
        f"- Markdown format\n- Headings and bullet points\n"
        f"- A final call-to-action linking back to FlashUSDT\n"
        f"- Keywords like: USDT, crypto payments, automation, API, wallet integration"
    )

    try:
        result = model.generate_content(prompt)
        slug = topic.lower().replace(" ", "-").replace("/", "-")
        filename = f"{OUTPUT_DIR}/{timestamp}-{slug}.md"

        with open(filename, "w") as f:
            f.write(result.text)

        print(f"✅ Blog saved: {filename}")

    except Exception as e:
        print(f"❌ Failed to generate blog for '{topic}': {e}")
