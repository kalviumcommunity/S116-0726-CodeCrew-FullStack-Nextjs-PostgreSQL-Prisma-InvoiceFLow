'use client';

import { FormEvent, useMemo, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ProfileFormData = {
  fullName: string;
  email: string;
  role: string;
  department: string;
};

const initialProfile: ProfileFormData = {
  fullName: 'Rahul Sharma',
  email: 'rahul@invoiceflow.com',
  role: 'Accountant',
  department: 'Finance',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileFormData>(initialProfile);
  const [draft, setDraft] = useState<ProfileFormData>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('');

  const initials = useMemo(() => {
    return profile.fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [profile.fullName]);

  const handleEdit = () => {
    setDraft(profile);
    setError('');
    setMessage('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setError('');
    setMessage('');
    setIsEditing(false);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!draft.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!draft.email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!draft.role.trim() || !draft.department.trim()) {
      setError('Role and department are required.');
      return;
    }

    setIsSaving(true);
    setMessage('');

    window.setTimeout(() => {
      setProfile(draft);
      setIsSaving(false);
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    }, 900);
  };

  const handleLogout = () => {
    setLogoutMessage('Logout UI triggered. No backend action was performed.');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_45%),linear-gradient(135deg,_#020617,_#0f172a)] text-slate-100">
      <div className="border-b border-[#1e314d]">
        <Navbar />
      </div>

      <div className="flex min-h-[calc(100vh-73px)] flex-col lg:flex-row">
        <div className="border-r border-[#1e314d]">
          <Sidebar />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[#1e314d] bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-xl font-semibold text-slate-950">
                  {initials}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">{profile.fullName}</h1>
                  <p className="text-sm text-slate-400">{profile.role}</p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    Active account
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="border-[#1e314d] bg-slate-950/70 text-slate-100 hover:border-cyan-500/50 hover:bg-slate-800" onClick={handleEdit}>
                  Edit Profile
                </Button>
                <Button variant="ghost" className="text-slate-300 hover:bg-slate-800 hover:text-white" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <Card className="border-[#1e314d] bg-slate-900/85 shadow-2xl shadow-slate-950/35">
                <CardHeader>
                  <CardTitle className="text-white">Profile Overview</CardTitle>
                  <CardDescription className="text-slate-400">Manage your account details for invoice processing workflows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-[#1e314d] bg-slate-950/70 p-4">
                      <p className="text-sm font-medium text-slate-400">Full Name</p>
                      <p className="mt-1 text-base font-semibold text-white">{profile.fullName}</p>
                    </div>
                    <div className="rounded-xl border border-[#1e314d] bg-slate-950/70 p-4">
                      <p className="text-sm font-medium text-slate-400">Email Address</p>
                      <p className="mt-1 text-base font-semibold text-white">{profile.email}</p>
                    </div>
                    <div className="rounded-xl border border-[#1e314d] bg-slate-950/70 p-4">
                      <p className="text-sm font-medium text-slate-400">Role</p>
                      <p className="mt-1 text-base font-semibold text-white">{profile.role}</p>
                    </div>
                    <div className="rounded-xl border border-[#1e314d] bg-slate-950/70 p-4">
                      <p className="text-sm font-medium text-slate-400">Department</p>
                      <p className="mt-1 text-base font-semibold text-white">{profile.department}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#1e314d] bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-white">Edit Profile</h2>
                        <p className="text-sm text-slate-400">Update your personal and work details.</p>
                      </div>
                      {!isEditing ? (
                        <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400" onClick={handleEdit}>
                          Edit Profile
                        </Button>
                      ) : null}
                    </div>

                    {isEditing ? (
                      <form className="mt-4 space-y-4" onSubmit={handleSave}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="space-y-2 text-sm font-medium text-slate-300">
                            <span>Full Name</span>
                            <input
                              className="w-full rounded-lg border border-[#1e314d] bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition hover:border-cyan-500/50 focus:border-cyan-400"
                              value={draft.fullName}
                              onChange={(event) => setDraft({ ...draft, fullName: event.target.value })}
                            />
                          </label>

                          <label className="space-y-2 text-sm font-medium text-slate-300">
                            <span>Email Address</span>
                            <input
                              className="w-full rounded-lg border border-[#1e314d] bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition hover:border-cyan-500/50 focus:border-cyan-400"
                              value={draft.email}
                              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                            />
                          </label>

                          <label className="space-y-2 text-sm font-medium text-slate-300">
                            <span>Role</span>
                            <input
                              className="w-full rounded-lg border border-[#1e314d] bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition hover:border-cyan-500/50 focus:border-cyan-400"
                              value={draft.role}
                              onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                            />
                          </label>

                          <label className="space-y-2 text-sm font-medium text-slate-300">
                            <span>Department</span>
                            <input
                              className="w-full rounded-lg border border-[#1e314d] bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition hover:border-cyan-500/50 focus:border-cyan-400"
                              value={draft.department}
                              onChange={(event) => setDraft({ ...draft, department: event.target.value })}
                            />
                          </label>
                        </div>

                        {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
                        {message ? <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p> : null}

                        <div className="flex flex-wrap gap-3">
                          <Button type="submit" disabled={isSaving} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving} className="border-[#1e314d] bg-slate-950/70 text-slate-100 hover:border-cyan-500/50 hover:bg-slate-800">
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-[#1e314d] bg-slate-900/85 shadow-2xl shadow-slate-950/35">
                  <CardHeader>
                    <CardTitle className="text-white">Security</CardTitle>
                    <CardDescription className="text-slate-400">Manage your account access settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-400">Change your password or review your security preferences.</p>
                    <Button variant="outline" className="w-full justify-center border-[#1e314d] bg-slate-950/70 text-slate-100 hover:border-cyan-500/50 hover:bg-slate-800">
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-[#1e314d] bg-slate-900/85 shadow-2xl shadow-slate-950/35">
                  <CardHeader>
                    <CardTitle className="text-white">Account Actions</CardTitle>
                    <CardDescription className="text-slate-400">Front-end-only actions for the profile experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="ghost" className="w-full justify-center text-slate-300 hover:bg-slate-800 hover:text-white" onClick={handleLogout}>
                      Logout
                    </Button>
                    {logoutMessage ? <p className="text-sm text-slate-400">{logoutMessage}</p> : null}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
