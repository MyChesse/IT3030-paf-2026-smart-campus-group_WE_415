# IT3030-paf-2026-smart-campus-group_WE_415

## Google Sign-In Setup

Google OAuth must be configured with the backend callback URL, not the frontend route.

For local development, register this exact redirect URI in Google Cloud Console:

http://localhost:8081/login/oauth2/code/google

The backend then forwards successful logins to the frontend callback at http://localhost:5173/oauth2/callback with the issued token.