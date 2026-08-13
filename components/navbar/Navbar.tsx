"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";

import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  Settings,
  Boxes,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;

  const initials = (() => {
    if (!userName) return "U";
    const parts = userName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  })();

  const router = useRouter();
  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef =
    useRef<HTMLDivElement>(null);

  /* =====================================================
     CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-slate-100
        bg-white/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[72px]
          max-w-[1440px]
          items-center
          px-6
        "
      >
        {/* =================================================
            LEFT — LOGO
        ================================================= */}

        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              transition={{
                duration: 0.15,
              }}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-[12px]
                bg-[#0F172A]
                text-white
              "
            >
              <Boxes
                size={20}
                strokeWidth={1.8}
              />
            </motion.div>

            <span
              className="
                text-[18px]
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              InvoiceFlow
            </span>
          </Link>
        </div>

        {/* =================================================
            CENTER — NAVIGATION
        ================================================= */}

        <div className="flex justify-center">
          <nav
            className="
              flex
              h-11
              items-center
              rounded-full
              bg-[#F5F7FA]
              p-1
            "
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="
                    relative
                    flex
                    h-9
                    items-center
                    gap-2
                    rounded-full
                    px-5
                    text-[13px]
                    font-medium
                    outline-none
                  "
                >
                  {/* ACTIVE SLIDING PILL */}

                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.7,
                      }}
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-[#111827]
                        shadow-sm
                      "
                    />
                  )}

                  {/* ICON */}

                  <motion.span
                    animate={{
                      color: active
                        ? "#FFFFFF"
                        : "#475569",
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.8}
                    />
                  </motion.span>

                  {/* TEXT */}

                  <motion.span
                    animate={{
                      color: active
                        ? "#FFFFFF"
                        : "#475569",
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="
                      relative
                      z-10
                      whitespace-nowrap
                    "
                  >
                    {item.title}
                  </motion.span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div
          className="
            relative
            flex
            flex-1
            items-center
            justify-end
            gap-3
          "
        >
          {/* =================================================
              SETTINGS
          ================================================= */}

          <div
            className="
              flex
              h-10
              items-center
              rounded-full
              border
              border-slate-200
              bg-[#F5F7FA]
              px-1.5
              shadow-sm
            "
          >
            <Link
              href="/settings"
              className="
                relative
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
              "
            >
              {pathname === "/settings" && (
                <motion.div
                  layoutId="settings-active"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-[#111827]
                  "
                />
              )}

              <motion.span
                animate={{
                  color:
                    pathname === "/settings"
                      ? "#FFFFFF"
                      : "#334155",
                }}
                transition={{
                  duration: 0.18,
                }}
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                "
              >
                <Settings
                  size={17}
                  strokeWidth={1.8}
                />
              </motion.span>
            </Link>
          </div>

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >
            <motion.button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (current) => !current
                )
              }
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              transition={{
                duration: 0.12,
              }}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#0F172A]
                text-[13px]
                font-semibold
                text-white
                shadow-sm
                outline-none
                ring-offset-2
                transition-shadow
                ${profileOpen
                  ? "ring-2 ring-slate-200"
                  : ""
                }
              `}
            >
              {userImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={userImage}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </motion.button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.16,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute
                    right-0
                    top-[50px]
                    z-50
                    w-[190px]
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-slate-200
                    bg-white
                    p-1.5
                    shadow-[0_14px_40px_rgba(15,23,42,0.12)]
                  "
                >
                  {/* Profile */}

                  <Link
                    href="/settings"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[11px]
                      px-3
                      py-2.5
                      text-left
                      text-[13px]
                      font-medium
                      text-slate-700
                      transition-colors
                      hover:bg-slate-50
                    "
                  >
                    <User
                      size={16}
                      strokeWidth={1.8}
                      className="text-slate-500"
                    />

                    <span>Profile</span>
                  </Link>

                  {/* Divider */}

                  <div className="my-1 border-t border-slate-100" />

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={async () => {
                      setProfileOpen(false);
                      await signOut({ redirect: false });
                      router.push("/login");
                      router.refresh();
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[11px]
                      px-3
                      py-2.5
                      text-left
                      text-[13px]
                      font-medium
                      text-red-600
                      transition-colors
                      hover:bg-red-50
                    "
                  >
                    <LogOut
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>Log out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}