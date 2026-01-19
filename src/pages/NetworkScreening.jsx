import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SITES, SCREENING_METHODS } from '../data/mockData';
import { Table } from '../components/Table';
import { MapComponent } from '../components/MapComponent';
import { AlertCircle, BarChart2, ArrowRight, Play, Sliders, Calendar } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function NetworkScreening() {
    const navigate = useNavigate();
    const { selectSite } = useProject();
    const [selectedMethod, setSelectedMethod] = useState(SCREENING_METHODS[2].id);
    const [startYear, setStartYear] = useState(2021);
    const [endYear, setEndYear] = useState(2025);
    const [isCalculated, setIsCalculated] = useState(false);

    const sites = [...MOCK_SITES].sort((a, b) => b.rank - a.rank);

    // Distribution Data for Histogram
    const distData = sites.map(s => ({ name: s.id, value: s.excess, color: s.excess > 0 ? '#ef4444' : '#10b981' }));

    const handleRunScreening = () => {
        setTimeout(() => setIsCalculated(true), 500);
    };

    const handleAnalyzeSite = (site) => {
        selectSite(site);
        navigate('/diagnosis');
    };

    const columns = [
        { key: 'rank', label: 'Rank', render: (val) => <span className="font-mono font-bold text-amber-500">#{val}</span> },
        { key: 'name', label: 'Site Name' },
        { key: 'aadt', label: 'AADT', render: (val) => val.toLocaleString() },
        {
            key: 'excess',
            label: 'Excess Freq.',
            render: (val) => (
                <span className={val > 0 ? "text-red-400 font-medium font-mono" : "text-green-400 font-mono"}>
                    {val > 0 ? '+' : ''}{val.toFixed(2)}
                </span>
            )
        },
        {
            key: 'action',
            label: '',
            render: (_, row) => (
                <button
                    className="p-2 hover:bg-slate-700 rounded-full transition-colors text-primary"
                    onClick={(e) => { e.stopPropagation(); handleAnalyzeSite(row); }}
                    title="Analyze Site"
                >
                    <ArrowRight size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="page-header shrink-0 mb-4">
                <div>
                    <h2>Network Screening</h2>
                    <p className="text-secondary">Identify sites with potential for safety improvement.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Left Panel: Config */}
                <div className="premium-card lg:col-span-1 h-fit overflow-y-auto">
                    <h3 className="text-lg mb-4 flex items-center gap-2">
                        <Sliders size={18} /> Configuration
                    </h3>
                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Screening Method</label>
                            <select
                                className="form-select"
                                value={selectedMethod}
                                onChange={(e) => { setSelectedMethod(e.target.value); setIsCalculated(false); }}
                            >
                                {SCREENING_METHODS.map(m => (
                                    <option key={m.id} value={m.id}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="form-group">
                                <label className="form-label flex items-center gap-1"><Calendar size={12} /> Start Year</label>
                                <select className="form-select" value={startYear} onChange={e => setStartYear(e.target.value)}>
                                    {[2018, 2019, 2020, 2021, 2022].map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label flex items-center gap-1"><Calendar size={12} /> End Year</label>
                                <select className="form-select" value={endYear} onChange={e => setEndYear(e.target.value)}>
                                    {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <button
                            className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-amber-500/10"
                            onClick={handleRunScreening}
                        >
                            <Play size={20} fill="currentColor" /> Run Screening
                        </button>
                    </div>
                </div>

                {/* Right Panel: Data Viz */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                    {isCalculated ? (
                        <>
                            <div className="h-[40%] min-h-[200px] rounded-lg overflow-hidden border border-slate-700 relative shrink-0">
                                <div className="absolute top-2 left-2 z-10 bg-slate-900/90 px-2 py-1 rounded border border-slate-700 text-xs font-mono">Geospatial Distribution</div>
                                <MapComponent sites={sites} onSiteClick={handleAnalyzeSite} />
                            </div>

                            <div className="flex-1 flex gap-4 min-h-0">
                                {/* Table Widget */}
                                <div className="w-2/3 overflow-auto bg-slate-900/50 rounded-lg p-1 border border-slate-800/50">
                                    <Table columns={columns} data={sites} onRowClick={handleAnalyzeSite} />
                                </div>

                                {/* Histogram Widget - Horizontal to the right of list */}
                                <div className="w-1/3 premium-card !p-4 flex flex-col">
                                    <div className="text-xs text-secondary uppercase mb-2">Excess Frequency Dist.</div>
                                    <div className="flex-1 min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={distData} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={30} tick={{ fontSize: 10, fill: '#64748b' }} />
                                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                                <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={20}>
                                                    {distData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="glass-panel p-12 rounded-lg flex flex-col items-center justify-center text-center h-full border-2 border-dashed border-slate-700">
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 animate-pulse">
                                <BarChart2 size={40} className="text-slate-600" />
                            </div>
                            <h3 className="text-2xl text-slate-300 font-light mb-2">Ready to Analyze</h3>
                            <p className="text-slate-500 max-w-sm">Select your methodology and parameters to generate screening results.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
