import os
import re
import requests
import yaml
from bs4 import BeautifulSoup
from datetime import datetime
from google.generativeai import GenerativeModel, configure

# ✅ Load configuration
try:
    with open("config.yml", "r") as f:
        config = yaml.safe_load(f)
except FileNotFoundError:
    print("❌ Error: config.yml not found. Please create it.")
    exit(1)
except yaml.YAMLError as e:
    print(f"❌ Error parsing config.yml: {e}")
    exit(1)

URL = config.get("site_url")
TOPICS = config.get("topics", [])
OUTPUT_DIR = config.get("output_dir", "blogs")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ✅ Validate essential configuration
if not URL or not TOPICS:
    print("❌ Error: 'site_url' and 'topics' must be defined in config.yml.")
    exit(1)

if not GEMINI_API_KEY:
    print("❌ Error: GEMINI_API_KEY environment variable not set.")
    exit(1)

# ✅ Configure Gemini using the correct model ID
try:
    configure(api_key=GEMINI_API_KEY)
    model = GenerativeModel("models/gemini-pro")  # ← fixed 404
except Exception as e:
    print(f"❌ Failed to configure Gemini: {e}")
    exit(1)

# ✅ Scrape content from the FlashUSDT landing page
print(f"Fetching content from {URL}...")
try:
    response = requests.get(URL, timeout=15)
    response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
    soup = BeautifulSoup(response.text, "html.parser")
    # A more robust way to gather text from meaningful tags
    page_text = ' '.join(tag.get_text(separator=" ", strip=True) for tag in soup.find_all(['h1', 'h2', 'h3', 'p', 'li', 'span']))
    page_text = re.sub(r"\s+", " ", page_text).strip()[:5000] # Limit context size
    if not page_text:
        print("⚠️ Warning: Could not find any text content on the page. Blog quality may be affected.")
except requests.exceptions.RequestException as e:
    print(f"❌ Failed to fetch URL: {e}")
    exit(1)
except Exception as e:
    print(f"❌ Failed to parse URL content: {e}")
    exit(1)

# ✅ Generate blog posts for each topic
os.makedirs(OUTPUT_DIR, exist_ok=True)
timestamp = datetime.utcnow().strftime("%Y-%m-%d")

print(f"\nGenerating {len(TOPICS)} blog posts...")
for topic in TOPICS:
    print(f"  - Working on topic: '{topic}'")
    prompt = (
        f"Using the following content scraped from a website as context:\n\n---\n{page_text}\n---\n\n"
        f"Write a professional, high-quality, SEO-optimized blog post of approximately 800 words on the topic: '{topic}'.\n\n"
        f"The blog post must:\n"
        f"- Be written in clear, engaging, and professional English.\n"
        f"- Be formatted in Markdown, using headings (##), subheadings (###), and bullet points (-) for readability.\n"
        f"- Naturally incorporate relevant keywords such as: USDT, crypto payments, automation, API, wallet integration, security, digital finance.\n"
        f"- Start with a compelling introduction and end with a strong conclusion.\n"
        f"- Include a final call-to-action that encourages readers to visit the official site (do not include a placeholder URL, just mention the service name)."
    )

    try:
        # Generate content with safety settings to avoid blocked prompts for business topics
        generation_config = {"temperature": 0.7}
        safety_settings = {
            "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
            "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
            "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
            "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
        }
        
        result = model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        # Clean up the response text from potential markdown artifacts
        blog_content = result.text.strip()
        if blog_content.lower().startswith("markdown"):
            blog_content = blog_content[len("markdown"):].strip()

        slug = topic.lower().replace(" ", "-").replace("/", "-").replace("'", "")
        filename = f"{OUTPUT_DIR}/{timestamp}-{slug}.md"

        with open(filename, "w", encoding="utf-8") as f:
            f.write(blog_content)

        print(f"    ✅ Blog saved successfully: {filename}")

    except Exception as e:
        print(f"    ❌ Failed to generate or save blog for '{topic}': {e}")
        # Continue to the next topic instead of exiting
        continue

print("\n✨ Blog generation process complete.")
