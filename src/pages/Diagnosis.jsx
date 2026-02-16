import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertTriangle, TrendingUp, Activity, Database, DownloadCloud } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid } from 'recharts';
import { farsService } from '../services/farsService';

export function Diagnosis() {
    const { currentProject } = useProject();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [realData, setRealData] = useState(null);
    const [apiError, setApiError] = useState(null);

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    if (!site) return <div>No site selected.</div>;

    // Charts Data
    const crashTypeData = site.types
        ? Object.entries(site.types)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value], i) => ({
                name,
                value,
                color: ['#0ea5e9', '#0f766e', '#d97706', '#be123c', '#64748b'][i % 5]
            }))
        : [];

    const severityData = site.severity ? [
        { name: 'Fatal (K)', value: site.severity.k || 0, color: '#be123c' },
        { name: 'Injury (A)', value: site.severity.a || 0, color: '#d97706' },
        { name: 'Minor (B)', value: site.severity.b || 0, color: '#0ea5e9' },
    ] : [];

    const trendData = [
        { year: 2020, crashes: 12 },
        { year: 2021, crashes: 15 },
        { year: 2022, crashes: 10 },
        { year: 2023, crashes: 18 },
        { year: 2024, crashes: realData ? realData.length : (site.crashes || 0) },
    ];

    const displayCrashes = realData ? realData.length : site.crashes;

    const handleFetchFars = async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const data = await farsService.getCrashes(1, 1, 2021);
            const formatted = farsService.transformData(data);
            setRealData(formatted);
        } catch (err) {
            setApiError("Failed to connect to NHTSA API. " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate('/network-screening')} className="text-secondary hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-secondary text-sm uppercase tracking-wider">Step 2: Diagnosis</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <h2>{site.name}</h2>
                        <button
                            className="btn btn-secondary text-xs py-1 px-3 flex items-center gap-2"
                            onClick={handleFetchFars}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="animate-spin">⌛</span> : <DownloadCloud size={14} />}
                            {realData ? 'Data Synced' : 'Fetch Real Data (NHTSA)'}
                        </button>
                    </div>
                    {apiError && <div className="text-red-400 text-xs mt-1">{apiError}</div>}
                    {realData && <div className="text-green-400 text-xs mt-1 flex items-center gap-1"><Database size={10} /> Connected to FARS Database (Live)</div>}
                </div>
            </div>

            <div className="space-y-6">
                {/* Section: Safety Performance Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="panel p-6">
                        <div className="text-secondary text-xs uppercase font-semibold mb-1">Excess Frequency</div>
                        <div className="flex items-end gap-2">
                            <div className="text-4xl font-bold text-amber-600">{(site.excess || 0).toFixed(2)}</div>
                            <div className="text-sm text-secondary mb-1">crashes/yr reduction potential</div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    <div className="panel p-6">
                        <div className="text-secondary text-xs uppercase font-semibold mb-1">Total Observed Crashes</div>
                        <div className="flex items-end gap-2">
                            <div className="text-4xl font-bold text-primary">{displayCrashes || 0}</div>
                            <div className="text-sm text-secondary mb-1">over 5 years</div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-red-600 mt-3 font-medium">
                            <TrendingUp size={14} /> High Frequency Location
                        </div>
                    </div>
                </div>

                {/* Section: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Type Distribution (Bar Chart) */}
                    <div className="panel p-6 h-[400px] flex flex-col">
                        <h4 className="text-xs text-secondary uppercase mb-4 font-bold flex items-center gap-2">
                            <Activity size={14} /> Crash Type Distribution
                        </h4>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={crashTypeData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={120}
                                        tick={{ fontSize: 11, fill: '#475569' }}
                                        interval={0}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                        {crashTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Severity Split & Trend */}
                    <div className="flex flex-col gap-6">
                        <div className="panel p-6 flex-1">
                            <h4 className="text-xs text-secondary uppercase mb-4 font-bold">Severity Split</h4>
                            <div className="h-full min-h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={severityData} margin={{ top: 10, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                            {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="panel p-6 flex-1">
                            <h4 className="text-xs text-secondary uppercase mb-4 font-bold">5-Year Trend</h4>
                            <div className="h-full min-h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorCrashesDiag" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }} />
                                        <Area type="monotone" dataKey="crashes" stroke="#0ea5e9" fill="url(#colorCrashesDiag)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="btn btn-primary px-8" onClick={() => navigate('/countermeasures')}>
                        Next: Countermeasures <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}
