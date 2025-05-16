#!/bin/bash

# Base URL of the backend API
BASE_URL="http://localhost:9090/api/v1"

# Test user registration (optional, skip if user already exists)
echo "Testing user registration..."
curl -X POST "$BASE_URL/user/register" -H "Content-Type: application/json" -d '{
  "email": "testuser@example.com",
  "password": "TestPassword123",
  "name": "Test User"
}'
echo -e "\n"

# Test user login
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/user/login" -H "Content-Type: application/json" -d '{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}')
echo "Login response: $LOGIN_RESPONSE"
JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.jwtToken')
USER_NAME=$(echo $LOGIN_RESPONSE | jq -r '.userName')
echo "JWT Token: $JWT_TOKEN"
echo "User Name: $USER_NAME"
echo -e "\n"

# Test get current user with email parameter and token
echo "Testing get current user..."
curl -X GET "$BASE_URL/user/me?email=testuser@example.com" -H "Authorization: Bearer $JWT_TOKEN"
echo -e "\n"
