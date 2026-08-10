"use client";

import type { SettingType } from "./SettingsList";

import ProfilePage from "./profile/ProfilePage";
import SecurityPage from "./security/SecurityPage";
import CompanyPage from "./company/CompanyPage";
import NotificationsPage from "./notifications/NotificationsPage";

interface SettingsContentProps {
  setting: SettingType;
}

export default function SettingsContent({
  setting,
}: SettingsContentProps) {
  switch (setting) {
    case "profile":
      return <ProfilePage />;

    case "security":
      return <SecurityPage />;

    case "company":
      return <CompanyPage />;

    case "notifications":
      return <NotificationsPage />;

    default:
      return null;
  }
}