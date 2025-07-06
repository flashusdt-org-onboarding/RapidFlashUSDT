#!/bin/bash

# Check if the GEMINI_API_KEY environment variable is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo "Error: GEMINI_API_KEY environment variable not set."
  echo "Please set the GEMINI_API_KEY environment variable before running this script."
  exit 1
fi

# Get the topic from the command line arguments, or use a default value
topic="${1:-The Future of USDT Payments}"

# Run the Python script
python generate_blog.py "$topic"

# Check if the command was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to generate blog post."
  exit 1
fi

echo "Blog post generated successfully."