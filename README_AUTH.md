# MartAI REST Authentication

## Overview

REST-based authentication system using JWT tokens, bcrypt password hashing, and Convex for user/session storage.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables in `.env.local`:**
   ```env
   JWT_SECRET=your-secret-key-min-32-characters-long
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   OPENAI_API_KEY=your_openai_key
   ```

3. **Initialize Convex:**
   ```bash
   npx convex dev
   # Copy the NEXT_PUBLIC_CONVEX_URL from output
   ```

## API Endpoints

### POST `/api/auth/signup`
Create new user account
- Body: `{ email, password, name? }`
- Returns: `{ token, user: { id, email, name } }`

### POST `/api/auth/login`
Authenticate user
- Body: `{ email, password }`
- Returns: `{ token, user: { id, email, name } }`

### POST `/api/auth/logout`
Invalidate session
- Headers: `Authorization: Bearer <token>`
- Returns: `{ success: true }`

### GET `/api/auth/me`
Get current user
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user: { id, email, name } }`

## Frontend Pages

- `/auth/login` - Sign in page
- `/auth/signup` - Sign up page

## Usage

```typescript
import { useAuth } from '@/lib/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Login
  await login(email, password);
  
  // Logout
  await logout();
}
```

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Sessions stored in Convex
- Password validation (≥8 chars)
- Email validation
- Token verification on all protected routes

## Next Steps

1. Add protected route wrapper to pages
2. Update onboarding to use authenticated user
3. Implement project management per user
4. Add "Connect Data" page after onboarding

