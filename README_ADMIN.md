# Creating Admin User

There are several ways to create an admin user:

## Method 1: Convex Dashboard (Recommended)

1. Open your Convex dashboard
2. Go to the **Functions** tab
3. Find `auth.seed.createAdminUser`
4. Click **Run** and provide:
   ```json
   {
     "email": "admin@martai.com",
     "password": "admin123",
     "name": "Admin User"
   }
   ```

## Method 2: HTTP Endpoint (Development Only)

Once Convex is deployed, you can POST to the HTTP endpoint:

```bash
curl -X POST https://your-convex-url.convex.site/seed-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@martai.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

**Note:** This endpoint is disabled in production unless `ENABLE_SEED=true` is set.

## Method 3: TypeScript Script

```bash
# Set environment variables
export NEXT_PUBLIC_CONVEX_URL="your-convex-url"
export ADMIN_EMAIL="admin@martai.com"
export ADMIN_PASSWORD="admin123"
export ADMIN_NAME="Admin User"

# Run the script
npx tsx scripts/seedAdmin.ts
```

## Default Admin Credentials

- **Email:** admin@martai.com
- **Password:** admin123
- **Role:** admin

⚠️ **Important:** Change the default password after first login!

## User Roles

- `admin` - Full access to all features
- `user` - Standard user access (default)
- `viewer` - Read-only access

## Updating User Role

You can update a user's role via the Convex dashboard:

1. Go to **Functions** → `auth.users.updateUser`
2. Provide:
   ```json
   {
     "userId": "user-id-here",
     "role": "admin"
   }
   ```

