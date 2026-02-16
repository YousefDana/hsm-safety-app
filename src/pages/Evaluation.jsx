import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, RefreshCcw, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export function Evaluation() {
    const { currentProject } = useProject();
    const navigate = useNavigate();
    const [afterCrashes, setAfterCrashes] = useState(5); // Default closer to a successful outcome
    const [yearsAfter, setYearsAfter] = useState(1);

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    if (!site) return <div>No site selected.</div>;

    // Baseline: Using site.crashes directly (assuming 1-year data from screening for this prototype)
    const beforeCrashesPerYear = site.crashes || 0;

    // Evaluation
    const afterCrashesPerYear = afterCrashes / yearsAfter;
    const reduction = beforeCrashesPerYear - afterCrashesPerYear;
    const percentReduction = beforeCrashesPerYear > 0 ? (reduction / beforeCrashesPerYear) * 100 : 0;
    const isPositiveResult = reduction > 0;

    const chartData = [
        { name: 'Before (Baseline)', rate: beforeCrashesPerYear, color: '#94a3b8' },
        { name: 'After (Observed)', rate: afterCrashesPerYear, color: isPositiveResult ? '#10b981' : '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate('/prioritization')} className="text-secondary hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-secondary text-sm uppercase tracking-wider">Step 6: Evaluation</span>
                    </div>
                    <h2>Safety Effectiveness</h2>
                    <p className="text-secondary">Quantify the real-world safety impact.</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-secondary mr-2">{site.name}</span>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>
                        <RefreshCcw size={18} /> New Analysis
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="panel p-6 lg:col-span-1 h-fit">
                    <h3 className="mb-4 text-primary font-bold">Post-Construction Data</h3>
                    <div className="space-y-6">
                        <div className="form-group">
                            <label className="text-xs uppercase font-bold text-secondary mb-1 block">Observed Crashes (Total)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none font-bold text-lg text-primary"
                                value={afterCrashes}
                                onChange={(e) => setAfterCrashes(parseFloat(e.target.value))}
                            />
                            <div className="text-xs text-secondary mt-1">Total count in after period</div>
                        </div>
                        <div className="form-group">
                            <label className="text-xs uppercase font-bold text-secondary mb-1 block">After Period Duration</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none bg-white font-medium"
                                value={yearsAfter}
                                onChange={(e) => setYearsAfter(parseFloat(e.target.value))}
                            >
                                <option value="1">1 Year</option>
                                <option value="2">2 Years</option>
                                <option value="3">3 Years</option>
                                <option value="5">5 Years</option>
                            </select>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded mt-4">
                            <div className="text-xs uppercase font-bold text-secondary mb-1">Baseline (Before)</div>
                            <div className="text-xl font-bold text-slate-700">{beforeCrashesPerYear.toFixed(1)} <span className="text-sm font-normal text-secondary">crashes/yr</span></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="panel p-6">
                        <h3 className="flex items-center gap-2 mb-6 text-primary font-bold">
                            <Activity className="text-amber-500" size={20} /> Performance Analysis
                        </h3>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" label={{ value: 'Crashes / Year', angle: -90, position: 'insideLeft', fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={60}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                    <ReferenceLine y={beforeCrashesPerYear} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Baseline', fill: '#94a3b8', fontSize: 10 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="panel p-6 rounded-lg text-center relative overflow-hidden bg-white border border-slate-200">
                            <div className="relative z-10">
                                <div className="text-secondary text-xs uppercase tracking-wider mb-2 font-bold">Reduction Factor</div>
                                <div className={`text-4xl font-bold ${isPositiveResult ? "text-green-600" : "text-red-500"}`}>
                                    {(reduction).toFixed(1)}
                                </div>
                                <div className="text-xs text-secondary mt-1">crashes prevented / yr</div>
                            </div>
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${isPositiveResult ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>

                        <div className="panel p-6 rounded-lg text-center relative overflow-hidden bg-white border border-slate-200">
                            <div className="relative z-10">
                                <div className="text-secondary text-xs uppercase tracking-wider mb-2 font-bold">Percent Change</div>
                                <div className={`text-4xl font-bold ${isPositiveResult ? "text-green-600" : "text-red-500"}`}>
                                    {isPositiveResult ? '↓' : '↑'} {Math.abs(percentReduction).toFixed(1)}%
                                </div>
                                <div className="text-xs text-secondary mt-1">relative to baseline</div>
                            </div>
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${isPositiveResult ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
