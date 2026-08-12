# InvoiceFlow Authentication System

## Overview

A complete authentication system has been implemented for InvoiceFlow using Next-Auth v4 with Credentials provider, PostgreSQL/Prisma for user storage, and bcryptjs for password hashing.

## Features

✅ **User Registration & Login** - Email and password-based authentication
✅ **Password Security** - bcryptjs hashing with salt rounds
✅ **Protected Routes** - Middleware-based route protection
✅ **Session Management** - JWT-based session strategy
✅ **Type Safety** - Full TypeScript support
✅ **Error Handling** - Comprehensive validation and error messages
✅ **Form Validation** - Zod schema validation

## File Structure

```
lib/
├── auth.ts              # Auth.js configuration
├── session.ts           # Session utilities
└── prisma.ts           # Prisma client (existing)

app/
└── api/auth/
    ├── [...]nextauth]/route.ts  # NextAuth handler
    ├── signup/route.ts           # Signup endpoint
    └── logout/route.ts           # Logout endpoint

components/auth/
├── AuthProvider.tsx      # Session provider wrapper
├── LoginForm.tsx         # Login page component
├── SignupForm.tsx        # Signup page component
└── UserMenu.tsx          # User menu component

types/
└── auth.ts              # Auth type definitions

middleware.ts           # Route protection middleware
```

## Environment Variables

Required variables in `.env.local`:

```env
DATABASE_URL=postgresql://...  # Neon PostgreSQL connection
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

**Important:** Generate a strong `NEXTAUTH_SECRET` for production:
```bash
openssl rand -base64 32
```

## API Endpoints

### POST `/api/auth/signup`

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Validation:**
- Name: Required, non-empty string
- Email: Valid email format, unique in database
- Password: Minimum 6 characters
- Confirm password must match password

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "cuid123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `409` - Email already in use
- `500` - Server error

### POST `/api/auth/signin`

Sign in with credentials (handled by Next-Auth).

**Via SignIn Hook:**
```typescript
import { signIn } from "next-auth/react";

await signIn("credentials", {
  email: "john@example.com",
  password: "securePassword123",
  redirect: false,
});
```

### POST `/api/auth/logout`

Sign out the current user.

```typescript
import { signOut } from "@/lib/auth";

await signOut({ redirectTo: "/login" });
```

## Protected Routes

The following routes are protected and require authentication:

- `/dashboard`
- `/history`
- `/upload`
- `/invoices`
- `/settings`

Unauthenticated users are automatically redirected to `/login`.

Authenticated users trying to access `/login` or `/signup` are redirected to `/dashboard`.

## Usage Examples

### Get Current User (Server Component)

```typescript
import { getCurrentUser } from "@/lib/session";

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return <div>Welcome, {user.name}</div>;
}
```

### Sign In (Client Component)

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn("credentials", {
      email: "user@example.com",
      password: "password",
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      console.error("Sign in failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Sign Up (Client Component)

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Create user via API
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    if (!response.ok) {
      console.error("Signup failed");
      return;
    }

    // 2. Automatically sign them in
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // 3. Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Access Session in Client Component

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not signed in</div>;

  return <div>Welcome, {session.user.email}</div>;
}
```

## Database Schema

### User Model

```prisma
model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  password  String     # bcryptjs hashed password
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

## Security Considerations

1. **Password Hashing**: Passwords are hashed with bcryptjs (10 rounds) before storage
2. **JWT Secret**: Must be a strong, random string in production
3. **HTTPS**: Always use HTTPS in production
4. **Email Uniqueness**: Emails are enforced as unique at the database level
5. **Validation**: All inputs are validated with Zod schemas
6. **No Password Reset**: Not implemented (as per requirements)

## Troubleshooting

### "Cannot destructure property 'handlers'"
This error occurs if using incompatible next-auth version. Ensure `next-auth@^4.24.0` is installed.

### "Session is undefined"
Make sure to wrap your app with `<AuthProvider>` in the root layout.

### "Middleware not working"
Check that `middleware.ts` exists at the root of your project and includes the correct route patterns.

## Next Steps

To integrate authentication with existing features:

1. Update API routes to check user authentication
2. Link invoices/uploads to authenticated users
3. Add user-specific filtering to queries
4. Implement audit logging for user actions

## Related Files

- [Login Page](../app/(auth)/login/page.tsx)
- [Signup Page](../app/(auth)/signup/page.tsx)
- [Auth Configuration](./lib/auth.ts)
- [Middleware](./middleware.ts)
- [Prisma Schema](./prisma/schema.prisma)
