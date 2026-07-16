import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const jobs = [
    { name: 'Q2 Vendor Reconciliation', status: 'Running', progress: 72 },
    { name: 'Govt Invoice Validation', status: 'Queued', progress: 24 },
    { name: 'POD Matching', status: 'Completed', progress: 100 },
];

export default function ProcessingJobsPage() {
    return (
        <AppShell title="Processing Jobs" subtitle="Monitor background workflows and queue state for invoice imports.">
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Current jobs</CardTitle>
                        <CardDescription>These cards mirror the workflow you would expect in a production finance operations portal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">{job.name}</p>
                                        <p className="mt-1 text-sm text-slate-500">{job.status}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{job.progress}%</span>
                                </div>
                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                                    <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" style={{ width: `${job.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
