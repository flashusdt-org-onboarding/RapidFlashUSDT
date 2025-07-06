#!/bin/bash

# Check if the GEMINI_API_KEY environment variable is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Error: GEMINI_API_KEY environment variable not set."
  echo "Please set the GEMINI_API_KEY environment variable before running this script."
  exit 1
fi

# Get the topic from the command line arguments, or use a default value
topic="${1:-The Future of USDT Payments}"

# List of topics
topics=(
  "The Future of USDT Payments"
  "USDT Payment Automation for E-commerce"
  "Secure Crypto Payments with FlashUSDT"
  "Building Wallet APIs with FlashUSDT"
  "USDT Payment Gateway Integration"
)

# Loop through the topics and generate blog posts
for topic in "${topics[@]}"; do
  echo "Generating blog post for topic: $topic"
  python generate_blog.py "$topic"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to generate blog post for topic: $topic"
  fi
done
# Check if the command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to generate blog post."
  exit 1
fi

echo "Blog post generated successfully."