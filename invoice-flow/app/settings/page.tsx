import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    return (
        <AppShell title="Settings" subtitle="Adjust workspace defaults and notification preferences.">
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Workspace preferences</CardTitle>
                        <CardDescription>These settings are presented as a polished front-end experience for the product flow.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">Email notifications</p>
                            <p className="mt-1 text-sm text-slate-500">Receive updates when invoice jobs finish or fail.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="font-semibold text-slate-900">Auto-archive completed uploads</p>
                            <p className="mt-1 text-sm text-slate-500">Keep recent uploads organised after successful processing.</p>
                        </div>
                        <Button className="bg-violet-600 hover:bg-violet-700">Save Preferences</Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
