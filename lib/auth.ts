/**
 * auth.ts — Full NextAuth configuration for server-side/Node.js API routes.
 *
 * Imports Prisma, bcrypt, and zod for full credentials-based authentication.
 * This file is NEVER imported by middleware.ts (which uses auth.config.ts instead).
 * Used by: /api/auth/[...nextauth]/route.ts and server-side API routes.
 */
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";

const loginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address.")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
    password: z.string().min(1),
});

const fullAuthConfig: NextAuthConfig = {
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const validatedCredentials = loginSchema.safeParse(credentials);

                if (!validatedCredentials.success) {
                    throw new Error("Invalid credentials");
                }

                const email = validatedCredentials.data.email.trim().toLowerCase();
                const password = validatedCredentials.data.password;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("Invalid credentials");
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(fullAuthConfig);
