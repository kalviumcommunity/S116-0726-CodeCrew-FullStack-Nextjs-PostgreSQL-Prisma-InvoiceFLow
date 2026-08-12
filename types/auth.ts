import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

// next-auth/jwt augmentation not available in next-auth v5 beta
// The auth callbacks use `any` types as a known workaround for v5 beta
