# generate_blog.py
# Requires: pip install google-genai python-dotenv

import os
import argparse
from datetime import datetime
from slugify import slugify
from google import genai
from google.genai import types
from dotenv import load_dotenv
from flask import Flask, jsonify

load_dotenv()

app = Flask(__name__)

def generate(topic: str):
    # ✅ Initialize client
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    model = "gemini-2.0-pro-005"

    # ✅ Timestamp + file setup
    date_str = datetime.now().strftime("%Y-%m-%d")
    slug = slugify(str(topic))
    filename = f"blogs/{date_str}-{slug}.mdx"
    os.makedirs("blogs", exist_ok=True)

    # ✅ Gemini prompt contents
    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=topic)]),
    ]

    # ✅ System instructions
    system_prompt = """
You are an expert crypto content writer and developer advocate for **FlashUSDT**, a secure, lightning-fast USDT payment automation platform.

Your task is to write highly professional, SEO-optimized, Markdown+JSX (`.mdx`) blog articles to be published at:
Each article should have a title, meta description, keywords, and internal links.

🌐 https://flashusdtsender.xyz  
📦 https://github.com/flashusdt-org-onboarding/RapidFlashUSDT  
📄 https://flashusdtsender.xyz/docs  
🔧 https://flashusdtsender.xyz/api  
💬 https://t.me/RapidFlashUSDT

Each blog must:
1. Use `.mdx` format with YAML frontmatter
2. Be < 1000 words
3. Use components: `<CallToAction />`, `<FeatureList />`, `<CodeBlock />`
4. End with a CTA block
5. Use real URLs, code examples, and proper structure
6. Focus on USDT, crypto payments, automation, wallet API, etc.
    """.strip()

    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=32768),
        tools=[types.Tool(url_context=types.UrlContext())],
        response_mime_type="text/plain",
        system_instruction=system_prompt,
    )

    print(f"🧠 Generating blog post for topic: {topic}\n💾 Saving to: {filename}\n")

    with open(filename, "w", encoding="utf-8") as f:
        try:
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=config,
            ):
                print(chunk.text, end="")
                f.write(chunk.text)

            print(f"\n✅ Blog generated: {filename}")

        except Exception as e:
            print(f"❌ Error generating blog post: {e}")

def main():
    parser = argparse.ArgumentParser(description="Generate MDX blog using Gemini 2.0 Pro for FlashUSDT.")
    parser.add_argument("topic", type=str, nargs='?', default="FlashUSDT", help="Blog topic title, e.g. 'Building Wallet APIs with FlashUSDT'")
    args = parser.parse_args()
    generate(args.topic)

@app.route('/list_blogs')
def list_blogs():
    try:
        blogs = [f for f in os.listdir('blogs') if f.endswith('.mdx')]
        return jsonify(blogs)
    except Exception as e:
        print(f"❌ Error listing blogs: {e}")
        return jsonify({"error": str(e)}), 500

def create_app():
    return app

if __name__ == "__main__":
    # Check if a topic is provided as a command-line argument
    if len(os.sys.argv) > 1:
        main()
    else:
        app = create_app()
        app.run(debug=True)
