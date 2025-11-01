#!/bin/bash
# Pre-commit security check script
# Run this before every git commit to ensure no secrets are exposed

echo "🔍 Scanning for exposed secrets..."

# Check if .env is being committed
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "❌ ERROR: .env file is staged for commit!"
    echo "   Run: git reset HEAD .env"
    exit 1
fi

# Check for hardcoded API keys in staged files
SECRETS=$(git diff --cached | grep -iE '(apiKey|api_key|authDomain|messagingSenderId|appId).*[:=].*["\047][A-Za-z0-9]{20,}')
if [ ! -z "$SECRETS" ]; then
    echo "❌ ERROR: Potential secrets found in staged files:"
    echo "$SECRETS"
    echo ""
    echo "   Please use environment variables instead of hardcoding credentials."
    exit 1
fi

# Check for Firebase config patterns
FIREBASE_PATTERN=$(git diff --cached | grep -E 'AIzaSy[A-Za-z0-9_-]{33}')
if [ ! -z "$FIREBASE_PATTERN" ]; then
    echo "❌ ERROR: Firebase API key detected in staged files!"
    echo "   Use process.env.EXPO_PUBLIC_FIREBASE_API_KEY instead"
    exit 1
fi

echo "✅ No secrets detected. Safe to commit!"
exit 0
