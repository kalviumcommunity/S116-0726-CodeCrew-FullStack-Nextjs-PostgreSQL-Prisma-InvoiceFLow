"use client";

import { X } from "lucide-react";

import type { SettingType } from "./SettingsList";
import SettingsContent from "./SettingsContent";

interface SettingsDrawerProps {
  setting: SettingType;
  onClose: () => void;
}

export default function SettingsDrawer({
  setting,
  onClose,
}: SettingsDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[620px] flex-col border-l border-slate-200 bg-slate-50 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your preferences
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X
              size={20}
              className="text-slate-500"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <SettingsContent
            setting={setting}
          />
        </div>
      </aside>
    </>
  );
}