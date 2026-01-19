import React from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingUp, Activity, Database, DownloadCloud } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, AreaChart, Area, CartesianGrid } from 'recharts';
import { farsService } from '../services/farsService';
import { useState } from 'react';

export function Diagnosis() {
    const { currentProject } = useProject();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [realData, setRealData] = useState(null);
    const [apiError, setApiError] = useState(null);

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    if (!site) return <div>No site selected.</div>;

    const crashTypeData = [
        { name: 'Rear End', value: 60, color: '#3b82f6' },
        { name: 'Angle', value: 25, color: '#ef4444' },
        { name: 'Sideswipe', value: 15, color: '#f59e0b' },
    ];

    const severityData = [
        { name: 'Fatal (K)', value: 1, color: '#ef4444' },
        { name: 'Injury (A)', value: 4, color: '#f97316' },
        { name: 'Injury (B)', value: 9, color: '#f59e0b' },
        { name: 'PDO (O)', value: 15, color: '#94a3b8' },
    ];

    // Mock Trend Data for Sparkline (Default)
    const trendData = [
        { year: 2020, crashes: 12 },
        { year: 2021, crashes: 15 },
        { year: 2022, crashes: 10 },
        { year: 2023, crashes: 18 },
        { year: 2024, crashes: realData ? realData.length : site.crashes },
    ];

    const handleFetchFars = async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            // Using Alabama (1), Autauga (1) as a demo sample since mock sites lack real FIPS
            const data = await farsService.getCrashes(1, 1, 2021);
            const formatted = farsService.transformData(data);
            console.log("FARS Data:", formatted);
            setRealData(formatted);
        } catch (err) {
            setApiError("Failed to connect to NHTSA API. " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const displayCrashes = realData ? realData.length : site.crashes;

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Col: Stats & Trends */}
                <div className="space-y-6">
                    <div className="premium-card">
                        <h3 className="mb-4 flex items-center gap-2">
                            <Activity className="text-amber-500" size={20} />
                            Safety Performance
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="text-secondary text-xs uppercase">Excess Frequency</div>
                                <div className="text-3xl font-bold text-amber-500 mt-1">{site.excess.toFixed(2)}</div>
                                <div className="w-full bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full" style={{ width: '75%' }}></div>
                                </div>
                                <div className="text-xs text-secondary mt-1 text-right">High Probability of Reduction</div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="text-secondary text-xs uppercase">Total Crashes ({realData ? '2021 Real' : '2025'})</div>
                                <div className="text-3xl font-bold text-white mt-1">{displayCrashes}</div>
                                <div className="flex items-center gap-1 text-xs text-red-400 mt-2">
                                    <TrendingUp size={12} /> +15% vs 2023
                                </div>
                            </div>
                        </div>

                        {/* Sparkline Trend */}
                        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                            <h4 className="text-sm text-secondary mb-2">5-Year Crash Trend</h4>
                            <div className="h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorCrashes" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            cursor={{ stroke: '#94a3b8' }}
                                        />
                                        <Area type="monotone" dataKey="crashes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCrashes)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="premium-card p-4">
                            <h4 className="text-xs text-secondary uppercase mb-2">Type Distribution</h4>
                            <div className="h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={crashTypeData}
                                            innerRadius={25}
                                            outerRadius={40}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {crashTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="premium-card p-4">
                            <h4 className="text-xs text-secondary uppercase mb-2">Severity Split</h4>
                            <div className="h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={severityData}>
                                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                            {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Bar>
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', fontSize: '12px' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Diagram & Notes */}
                <div className="premium-card flex flex-col h-full">
                    <h3 className="mb-4">Pattern Analysis</h3>
                    <div className="flex-1 min-h-[300px] bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden group">
                        {/* Abstract road art */}
                        {/* Abstract road art */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--color-bg-secondary)_100%)]"></div>

                        {/* Simulated Crash Clusters */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-slate-700 rounded-full opacity-20"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-slate-700 rounded-full opacity-20"></div>

                        {/* Heatmap-like blobs */}
                        <div className="absolute top-[40%] left-[60%] w-24 h-24 bg-red-500/20 blur-xl rounded-full"></div>
                        <div className="absolute top-[55%] left-[45%] w-20 h-20 bg-amber-500/20 blur-xl rounded-full"></div>

                        <div className="z-10 text-center">
                            <AlertTriangle className="mx-auto mb-2 text-amber-500 opacity-50" size={32} />
                            <p className="text-sm text-secondary">Spatial analysis layer active</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="form-label text-xs uppercase">Observed Systemic Issues</label>
                        <textarea className="form-input h-24 text-sm" placeholder="Document patterns (e.g. wet-weather rear ends on approach)..."></textarea>
                    </div>

                    <button className="btn btn-primary w-full mt-4" onClick={() => navigate('/countermeasures')}>
                        Correct Issues <ArrowLeft size={16} className="rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}
