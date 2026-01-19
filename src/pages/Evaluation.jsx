import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, RefreshCcw, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export function Evaluation() {
    const { currentProject } = useProject();
    const navigate = useNavigate();
    const [afterCrashes, setAfterCrashes] = useState(12);
    const [yearsAfter, setYearsAfter] = useState(3);

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    if (!site) return <div>No site selected.</div>;

    const beforeCrashesPerYear = site.crashes / 3;
    const afterCrashesPerYear = afterCrashes / yearsAfter;
    const reduction = beforeCrashesPerYear - afterCrashesPerYear;
    const percentReduction = (reduction / beforeCrashesPerYear) * 100;
    const isPositiveResult = reduction > 0;

    const chartData = [
        { name: 'Before (Observed)', rate: beforeCrashesPerYear, color: '#94a3b8' },
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

                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    <RefreshCcw size={18} /> Restart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="premium-card lg:col-span-1 h-fit">
                    <h3 className="mb-4">Input Data</h3>
                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Total After Crashes</label>
                            <input
                                type="number"
                                className="form-input text-2xl font-bold"
                                value={afterCrashes}
                                onChange={(e) => setAfterCrashes(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">After Period Duration</label>
                            <select
                                className="form-select"
                                value={yearsAfter}
                                onChange={(e) => setYearsAfter(parseFloat(e.target.value))}
                            >
                                <option value="1">1 Year</option>
                                <option value="2">2 Years</option>
                                <option value="3">3 Years</option>
                                <option value="5">5 Years</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card">
                        <h3 className="flex items-center gap-2 mb-6">
                            <Activity className="text-amber-500" /> Performance Analysis
                        </h3>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" label={{ value: 'Crashes / Year', angle: -90, position: 'insideLeft', fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={60}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                    <ReferenceLine y={beforeCrashesPerYear} stroke="#94a3b8" strokeDasharray="3 3" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-6 rounded-lg text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-secondary text-sm uppercase tracking-wider mb-2">Reduction Factor</div>
                                <div className={`text-4xl font-bold ${isPositiveResult ? "text-green-400" : "text-red-400"}`}>
                                    {(reduction).toFixed(1)}
                                </div>
                                <div className="text-xs text-secondary">crashes prevented / yr</div>
                            </div>
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${isPositiveResult ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>

                        <div className="glass-panel p-6 rounded-lg text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-secondary text-sm uppercase tracking-wider mb-2">Percent Change</div>
                                <div className={`text-4xl font-bold ${isPositiveResult ? "text-green-400" : "text-red-400"}`}>
                                    {isPositiveResult ? '↓' : '↑'} {Math.abs(percentReduction).toFixed(1)}%
                                </div>
                                <div className="text-xs text-secondary">relative to baseline</div>
                            </div>
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 ${isPositiveResult ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
