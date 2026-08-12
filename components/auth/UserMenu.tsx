import { getCurrentUser } from "@/lib/session";
import { signOut } from "@/lib/auth";
import Link from "next/link";

export async function UserMenu() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex gap-2">
                <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    Sign in
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className="text-sm">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-slate-500">{user.email}</p>
            </div>
            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                }}
            >
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                    Logout
                </button>
            </form>
        </div>
    );
}
