#!/bin/bash
# MartAI Deployment Script
# Usage: ./scripts/deploy.sh "Commit message"

set -e

COMMIT_MESSAGE="$1"

if [ -z "$COMMIT_MESSAGE" ]; then
    echo "❌ Error: Commit message is required"
    echo "Usage: ./scripts/deploy.sh \"Your commit message\""
    exit 1
fi

echo "🚀 MartAI Deployment Script"
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Clean build artifacts first
echo "🧹 Cleaning build artifacts..."
npm run clean || echo "⚠️  Clean had issues, continuing anyway..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check git status
echo "📋 Checking git status..."
STATUS=$(git status --short)

if [ -z "$STATUS" ]; then
    echo "ℹ️  No changes to commit."
    exit 0
fi

echo "Changes to commit:"
echo "$STATUS"
echo ""

# Add all changes
echo "➕ Staging changes..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

echo "✅ Committed: $COMMIT_MESSAGE"
echo ""

# Push to main
echo "🚀 Pushing to main..."
git push origin main

echo ""
echo "✅ Successfully deployed to main!"
echo ""

# Show latest commit
LATEST_COMMIT=$(git log -1 --oneline)
echo "Latest commit: $LATEST_COMMIT"

