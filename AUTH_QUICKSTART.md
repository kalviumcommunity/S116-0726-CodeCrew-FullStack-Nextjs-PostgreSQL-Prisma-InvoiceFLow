# Authentication Quick Start Guide

## Installation Complete ✅

The authentication system is fully implemented and ready to use.

## Testing the Auth System

### 1. Start the Development Server
```bash
npm run dev
```

The app will run at `http://localhost:3000`

### 2. Test Signup
- Navigate to `http://localhost:3000/signup`
- Fill in the form:
  - Name: e.g., "John Doe"
  - Email: e.g., "john@example.com"
  - Password: Minimum 6 characters
  - Confirm Password: Must match
- Click "Create Account"
- You'll be automatically signed in and redirected to `/dashboard`

### 3. Test Login
- Sign out first (logout button in navbar/user menu)
- Navigate to `http://localhost:3000/login`
- Enter the email and password you just created
- Click "Sign in"
- You should be redirected to `/dashboard`

### 4. Test Protected Routes
- Try accessing `/dashboard`, `/invoices`, `/history`, `/upload`, `/settings`
- If not signed in, you'll be redirected to `/login`
- If signed in, you'll see the page

### 5. Test Session Persistence
- Sign in and refresh the page
- Your session should persist
- Check browser DevTools > Application > Cookies for `next-auth` tokens

## Credentials for Testing

After running the application and creating your first user, you can log in with those credentials:

**Test User:**
- Email: `your-created-email@example.com`
- Password: `your-password`

## File Locations

Key authentication files:

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Next-Auth configuration |
| `lib/session.ts` | Session retrieval utilities |
| `app/api/auth/[...nextauth]/route.ts` | Auth API handler |
| `app/api/auth/signup/route.ts` | User registration endpoint |
| `components/auth/LoginForm.tsx` | Login UI component |
| `components/auth/SignupForm.tsx` | Signup UI component |
| `middleware.ts` | Route protection |
| `types/auth.ts` | TypeScript type definitions |

## Environment Setup

Your `.env.local` file is already configured with:
- `DATABASE_URL` - PostgreSQL connection (Neon)
- `NEXTAUTH_SECRET` - Session encryption key
- `NEXTAUTH_URL` - Application URL

**For production, change `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

Then update it in your `.env` file.

## What's Implemented

✅ User registration with validation
✅ Password hashing with bcryptjs
✅ User login with Credentials provider
✅ JWT-based sessions
✅ Route protection middleware
✅ Protected dashboard/app routes
✅ Logout functionality
✅ Error handling and validation
✅ TypeScript support
✅ Responsive UI components

## Common Tasks

### Add Authentication Check to API Route

```typescript
// app/api/example/route.ts
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getSession();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Proceed with authenticated user
  return Response.json({ message: `Hello ${user.name}` });
}
```

### Protect a Component

```typescript
// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <main>Welcome, {user.name}</main>;
}
```

### Check Auth in Client Component

```typescript
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;

  return <div>Authenticated as {session?.user?.email}</div>;
}
```

## Troubleshooting

### Issue: Signup fails with "Email already in use"
**Solution:** Use a different email address or clear the database

### Issue: Always redirected to login
**Solution:** Check that AuthProvider is wrapping your app in `app/layout.tsx`

### Issue: Middleware not redirecting
**Solution:** Make sure `middleware.ts` exists at the root and `npm run build` succeeds

### Issue: "Cannot find module '@types/bcryptjs'"
**Solution:** Run `npm install --save-dev @types/bcryptjs`

## Database

User data is stored in PostgreSQL (Neon):

**Table:** `User`
- `id` - CUID primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password (bcryptjs)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

To view users in Neon console:
1. Go to https://console.neon.tech
2. Navigate to your project
3. Open SQL editor
4. Query: `SELECT id, name, email, createdAt FROM "User";`

## Next Steps

1. **Link to User Data** - Associate invoices, uploads, and settings with users
2. **Add User Profile** - Create a profile page to update user information
3. **Email Verification** - Add email verification on signup
4. **Password Reset** - Implement forgot password flow
5. **OAuth** - Add Google/GitHub authentication

## Support

For detailed documentation, see [AUTH_SETUP.md](./AUTH_SETUP.md)
