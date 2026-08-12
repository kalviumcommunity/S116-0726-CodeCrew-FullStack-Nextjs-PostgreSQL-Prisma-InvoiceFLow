# Authentication API Testing Guide

## Testing with cURL, Postman, or REST Client

### 1. Signup (Register New User)

#### cURL
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

#### JavaScript Fetch
```javascript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123'
  })
});

const data = await response.json();
console.log(data);
```

#### REST Client (VS Code)
```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

#### Response (201)
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clm1a2b3c4d5e6f7g8h9i0j1k",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 2. Test Signup Validation

#### Missing Field
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

Response (400):
```json
{
  "error": "Validation failed",
  "details": {
    "password": ["String must contain at least 6 character(s)"],
    "confirmPassword": ["Required"]
  }
}
```

#### Mismatched Passwords
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "different456"
  }'
```

Response (400):
```json
{
  "error": "Validation failed",
  "details": {
    "confirmPassword": ["Passwords don't match"]
  }
}
```

#### Duplicate Email
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

Response (409):
```json
{
  "error": "Email already in use"
}
```

#### Invalid Email
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "notanemail",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

Response (400):
```json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email"]
  }
}
```

### 3. Login (Signin)

#### Client-Side with signIn Hook
```javascript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  email: "john@example.com",
  password: "securePassword123",
  redirect: false,
});

if (result?.ok) {
  console.log("Signed in successfully");
} else {
  console.log("Invalid credentials");
}
```

#### Test with Wrong Password
```javascript
const result = await signIn("credentials", {
  email: "john@example.com",
  password: "wrongPassword",
  redirect: false,
});

console.log(result?.ok); // false
console.log(result?.error); // "CredentialsSignin"
```

#### Test with Non-existent Email
```javascript
const result = await signIn("credentials", {
  email: "nonexistent@example.com",
  password: "anyPassword",
  redirect: false,
});

console.log(result?.ok); // false
```

### 4. Session Access

#### Get Session in Client Component
```typescript
"use client";

import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not signed in</p>;

  return (
    <div>
      <p>Signed in as: {session?.user?.email}</p>
      <p>User ID: {session?.user?.id}</p>
    </div>
  );
}
```

#### Get Session in Server Component
```typescript
import { getCurrentUser } from "@/lib/session";

export default async function Component() {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Not signed in</p>;
  }

  return (
    <div>
      <p>Signed in as: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  );
}
```

### 5. Check Session in API Route

```typescript
// app/api/protected/route.ts
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return Response.json({
    message: `Hello ${user.name}`,
    user,
  });
}
```

#### Test Protected API
```bash
# Signed in (should work)
curl http://localhost:3000/api/protected \
  -H "Cookie: next-auth.session-token=..."

# Response:
# {"message":"Hello John Doe","user":{"email":"john@example.com","id":"..."}}

# Not signed in (should fail)
curl http://localhost:3000/api/protected

# Response:
# {"error":"Unauthorized"}
```

### 6. Logout

#### Client-Side
```typescript
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut()}>
      Logout
    </button>
  );
}
```

#### Server Action
```typescript
import { signOut } from "@/lib/auth";

export async function handleLogout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}
```

## Testing Scenarios

### Scenario 1: Complete Signup & Login Flow

1. **Signup**
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Alice Smith",
       "email": "alice@example.com",
       "password": "Alice@123456",
       "confirmPassword": "Alice@123456"
     }'
   ```

2. **Visit /dashboard** (should be logged in automatically)
   ```
   http://localhost:3000/dashboard
   ```

3. **Logout** (click logout button)

4. **Visit /login**
   ```
   http://localhost:3000/login
   ```

5. **Login with created credentials**
   - Email: alice@example.com
   - Password: Alice@123456

### Scenario 2: Protected Routes

1. **Without login, try accessing /dashboard**
   ```
   http://localhost:3000/dashboard
   → Should redirect to /login
   ```

2. **Login successfully**

3. **Try accessing /login while logged in**
   ```
   http://localhost:3000/login
   → Should redirect to /dashboard
   ```

### Scenario 3: Session Persistence

1. **Sign in**

2. **Refresh page**
   - Session should persist
   - User should still be logged in

3. **Close browser and reopen**
   - JWT token in cookie should restore session
   - User should still be logged in

## Database Query Examples

### View All Users
```sql
SELECT id, name, email, "createdAt" FROM "User";
```

### Check User Login
```sql
SELECT id, email, password FROM "User" WHERE email = 'john@example.com';
```

### Count Users
```sql
SELECT COUNT(*) as total_users FROM "User";
```

### Delete Test User
```sql
DELETE FROM "User" WHERE email = 'test@example.com';
```

## Common Issues & Solutions

### Issue: 405 Method Not Allowed
**Cause:** Using wrong HTTP method
**Solution:** Use POST for /api/auth/signup

### Issue: 400 Validation Error
**Cause:** Missing required fields or validation failure
**Solution:** Check error details in response and fix input

### Issue: 409 Email Already in Use
**Cause:** Email exists in database
**Solution:** Use different email address

### Issue: Session not persisting
**Cause:** AuthProvider missing or incorrect cookie settings
**Solution:** Verify AuthProvider wraps app in layout.tsx

### Issue: 401 Unauthorized on protected API
**Cause:** User not authenticated
**Solution:** Sign in first or add valid session token
