
import os
from datetime import datetime
from google.generativeai import GenerativeModel, configure

configure(api_key=os.getenv("GEMINI_API_KEY"))

model = GenerativeModel("gemini-pro")

topics = [
    "Instant USDT Payment Automation for Exchanges",
    "Why FlashUSDT is the Future of Crypto Merchant Services",
    "Building Secure Wallet APIs with FlashUSDT",
    "How RapidFlashUSDT Powers Real-Time Transactions",
    "5 Ways to Integrate USDT in E-Commerce Platforms"
]

for topic in topics:
    response = model.generate_content(f"Write a professional blog post (in Markdown format) on: '{topic}' for the FlashUSDT platform. Include SEO-friendly headings, bullets, and code examples where applicable.")
    timestamp = datetime.utcnow().strftime('%Y-%m-%d')
    slug = topic.lower().replace(' ', '-').replace('.', '').replace('/', '-')
    filepath = f"blogs/{timestamp}-{slug}.md"

    os.makedirs("blogs", exist_ok=True)
    with open(filepath, "w") as f:
        f.write(response.text)
    print(f"✅ Blog saved: {filepath}")
