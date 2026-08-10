"use client";

import { useState } from "react";

import SettingsList, {
  type SettingType,
} from "@/components/settings/SettingsList";

import SettingsContent from "@/components/settings/SettingsContent";

export default function SettingsPage() {
  const [selectedSetting, setSelectedSetting] =
    useState<SettingType>("profile");

  return (
    <main className="h-[calc(100vh-105px)] overflow-hidden">
      <div className="mx-auto flex h-full max-w-[1520px] flex-col">

        {/* PAGE HEADER */}
        <div className="shrink-0 pb-4">
          <h1 className="text-[21px] font-semibold tracking-[-0.025em] text-slate-900">
            Settings
          </h1>

          <p className="mt-0.5 text-[12px] text-slate-500">
            Manage your account and workspace preferences.
          </p>
        </div>

        {/* SETTINGS WORKSPACE */}
        <div className="grid min-h-0 flex-1 grid-cols-[270px_minmax(0,1fr)] gap-5">

          {/* LEFT NAV */}
          <aside className="min-h-0 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
            <SettingsList
              selectedSetting={selectedSetting}
              onSelect={setSelectedSetting}
            />
          </aside>

          {/* RIGHT CONTENT */}
          <section className="min-h-0 overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.035)]">

            <div className="h-full overflow-y-auto">
              <SettingsContent
                setting={selectedSetting}
              />
            </div>

          </section>

        </div>
      </div>
    </main>
  );
}