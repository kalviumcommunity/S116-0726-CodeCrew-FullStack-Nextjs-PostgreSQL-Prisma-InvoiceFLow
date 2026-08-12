import { auth } from "@/lib/auth";

export async function getSession() {
    return auth();
}

export async function getCurrentUser() {
    const session = await getSession();
    return session?.user;
}
