"use client";

import {
  User,
  Shield,
  Building2,
  Bell,
  type LucideIcon,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

export type SettingType =
  | "profile"
  | "security"
  | "company"
  | "notifications";

interface SettingsListProps {
  selectedSetting: SettingType;
  onSelect: (setting: SettingType) => void;
}

const settings: {
  id: SettingType;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "profile",
    title: "Profile",
    description: "Account details",
    icon: User,
  },
  {
    id: "security",
    title: "Security",
    description: "Password & login",
    icon: Shield,
  },
  {
    id: "company",
    title: "Company",
    description: "Business details",
    icon: Building2,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alerts & emails",
    icon: Bell,
  },
];

export default function SettingsList({
  selectedSetting,
  onSelect,
}: SettingsListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav className="space-y-1.5">
      {settings.map((item) => {
        const Icon = item.icon;
        const active =
          selectedSetting === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="
              group
              relative
              flex
              w-full
              items-center
              gap-3.5
              rounded-[16px]
              px-3.5
              py-3.5
              text-left
              outline-none
            "
          >
            {/* =================================================
                SLIDING ACTIVE PILL
            ================================================= */}

            {active && (
              <motion.div
                layoutId="settings-active-pill"
                transition={
                  shouldReduceMotion
                    ? {
                        duration: 0,
                      }
                    : {
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.7,
                      }
                }
                className="
                  absolute
                  inset-0
                  rounded-[16px]
                  bg-blue-50/90
                "
              />
            )}

            {/* =================================================
                HOVER BACKGROUND
            ================================================= */}

            {!active && (
              <motion.div
                initial={false}
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-[16px]
                  bg-slate-50
                  opacity-0
                  transition-opacity
                  duration-200
                  group-hover:opacity-100
                "
              />
            )}

            {/* =================================================
                ACTIVE BLUE INDICATOR
            ================================================= */}

            {active && (
              <motion.span
                layoutId="settings-active-indicator"
                transition={
                  shouldReduceMotion
                    ? {
                        duration: 0,
                      }
                    : {
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }
                }
                className="
                  absolute
                  left-0
                  top-1/2
                  h-8
                  w-[3px]
                  -translate-y-1/2
                  rounded-r-full
                  bg-blue-600
                "
              />
            )}

            {/* =================================================
                ICON
            ================================================= */}

            <motion.div
              layout
              transition={
                shouldReduceMotion
                  ? {
                      duration: 0,
                    }
                  : {
                      type: "spring",
                      stiffness: 450,
                      damping: 30,
                    }
              }
              className={`
                relative
                z-10
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[12px]
                transition-[background-color,color,box-shadow]
                duration-200
                ${
                  active
                    ? "bg-white text-blue-600 shadow-[0_3px_10px_rgba(37,99,235,0.10)]"
                    : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-slate-700"
                }
              `}
            >
              <motion.div
                animate={{
                  scale: active ? 1 : 0.96,
                }}
                transition={
                  shouldReduceMotion
                    ? {
                        duration: 0,
                      }
                    : {
                        type: "spring",
                        stiffness: 500,
                        damping: 28,
                      }
                }
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                />
              </motion.div>
            </motion.div>

            {/* =================================================
                TEXT
            ================================================= */}

            <div className="relative z-10 min-w-0 flex-1">
              <motion.p
                animate={{
                  color: active
                    ? "#0f172a"
                    : "#1e293b",
                }}
                transition={{
                  duration: 0.18,
                }}
                className={`
                  text-[14px]
                  leading-5
                  tracking-[-0.01em]
                  ${
                    active
                      ? "font-semibold"
                      : "font-medium"
                  }
                `}
              >
                {item.title}
              </motion.p>

              <motion.p
                animate={{
                  color: active
                    ? "rgba(37,99,235,0.70)"
                    : "#94a3b8",
                }}
                transition={{
                  duration: 0.18,
                }}
                className="
                  mt-0.5
                  text-[11px]
                  leading-4
                "
              >
                {item.description}
              </motion.p>
            </div>

            {/* =================================================
                ACTIVE DOT
            ================================================= */}

            <div className="relative z-10 flex h-4 w-4 items-center justify-center">
              {active && (
                <motion.span
                  layoutId="settings-active-dot"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          scale: 0,
                          opacity: 0,
                        }
                  }
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={
                    shouldReduceMotion
                      ? {
                          duration: 0,
                        }
                      : {
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }
                  }
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-blue-600
                  "
                />
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}