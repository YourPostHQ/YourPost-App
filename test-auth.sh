#!/bin/bash

echo "Testing YourPost Webmail Authentication Flow"
echo "==========================================="

# Test 1: Check if webmail is running
echo -e "\n1. Checking if webmail is accessible..."
curl -s http://localhost:3001 > /dev/null && echo "✓ Webmail is running on port 3001" || echo "✗ Webmail is not running"

# Test 2: Check login page
echo -e "\n2. Checking login page..."
curl -s http://localhost:3001/login | grep -q "Sign In to your mailbox" && echo "✓ Login page loads correctly" || echo "✗ Login page not found"

# Test 3: Test API authentication
echo -e "\n3. Testing API authentication..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:9000/api/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourpost.io","password":"admin123"}')

if echo "$AUTH_RESPONSE" | grep -q "token"; then
    echo "✓ API authentication works"
    echo "   Response: $AUTH_RESPONSE"
else
    echo "✗ API authentication failed"
    echo "   Response: $AUTH_RESPONSE"
fi

# Test 4: Test user creation (should already exist)
echo -e "\n4. Testing user listing..."
USERS_RESPONSE=$(curl -s http://localhost:9000/api/v1/users)
if echo "$USERS_RESPONSE" | grep -q "admin@yourpost.io"; then
    echo "✓ User exists in database"
else
    echo "✗ User not found"
    echo "   Response: $USERS_RESPONSE"
fi

# Test 5: Test folders endpoint
echo -e "\n5. Testing folders endpoint..."
FOLDERS_RESPONSE=$(curl -s "http://localhost:9000/api/v1/mailboxes/admin@yourpost.io/folders")
if echo "$FOLDERS_RESPONSE" | grep -q "INBOX"; then
    echo "✓ Folders endpoint works"
else
    echo "✗ Folders endpoint failed"
    echo "   Response: $FOLDERS_RESPONSE"
fi

echo -e "\n==========================================="
echo "Test complete!"
