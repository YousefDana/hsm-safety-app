import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search, PlusCircle, CheckCircle, ExternalLink, Info, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MOCK_CMFS = [
    { id: 'cmf_001', name: 'Install Traffic Signal', cmf: 0.72, cost: 250000, life: 20, crashType: 'Angle' },
    { id: 'cmf_002', name: 'Improve Signal Timing', cmf: 0.85, cost: 15000, life: 5, crashType: 'Rear End' },
    { id: 'cmf_003', name: 'Install Protected Left Turn Phase', cmf: 0.81, cost: 35000, life: 10, crashType: 'Angle' },
    { id: 'cmf_004', name: 'Install Street Lighting', cmf: 0.60, cost: 45000, life: 15, crashType: 'Nighttime' },
    { id: 'cmf_005', name: 'Install Centerline Rumble Strips', cmf: 0.85, cost: 12000, life: 7, crashType: 'Head On' },
    { id: 'cmf_006', name: 'Install Pedestrian Refuge Island', cmf: 0.68, cost: 35000, life: 20, crashType: 'Pedestrian' },
    { id: 'cmf_007', name: 'High Visibility Crosswalks', cmf: 0.70, cost: 8000, life: 5, crashType: 'Pedestrian' },
    { id: 'cmf_008', name: 'Advance Warning Signs', cmf: 0.95, cost: 2000, life: 7, crashType: 'All' },
    { id: 'cmf_009', name: 'Pavement Friction Treatment', cmf: 0.50, cost: 85000, life: 10, crashType: 'Wet Road' },
    { id: 'cmf_010', name: 'Road Diet (4 to 3 lanes)', cmf: 0.71, cost: 150000, life: 20, crashType: 'All' },
];

export function Countermeasures() {
    const { currentProject, addCountermeasure, updateProject } = useProject();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    // Use sitesData storage
    const selectedCMFs = site?.countermeasures || [];

    const handleToggleCMF = (cmf) => {
        const exists = selectedCMFs.find(c => c.id === cmf.id);
        let newCountermeasures;

        if (exists) {
            newCountermeasures = selectedCMFs.filter(c => c.id !== cmf.id);
        } else {
            newCountermeasures = [...selectedCMFs, cmf];
        }

        // Update context using direct updateProject for array replacement since addCountermeasure is additive
        updateProject({
            sitesData: {
                ...currentProject.sitesData,
                [siteId]: { ...site, countermeasures: newCountermeasures }
            }
        });
    };

    const filteredCMFs = MOCK_CMFS.filter(cmf =>
        cmf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmf.crashType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCost = selectedCMFs.reduce((acc, cm) => acc + cm.cost, 0);

    // Get Top Crash Type for "Recommended" Label
    const topCrashType = site?.types ? Object.entries(site.types).sort((a, b) => b[1] - a[1])[0]?.[0] : null;

    // Data for sidebar chart
    const costData = selectedCMFs.map(cm => ({ name: cm.name, value: cm.cost }));
    const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

    if (!site) return <div>No site selected.</div>;

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate('/diagnosis')} className="text-secondary hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-secondary text-sm uppercase tracking-wider">Step 3: Countermeasures</span>
                    </div>
                    <h2>Countermeasure Selection</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-sm text-secondary">Targeting Issue</div>
                        <div className="font-bold text-amber-500">{topCrashType || 'General Safety'}</div>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/economic-appraisal')}
                        disabled={selectedCMFs.length === 0}
                    >
                        Appraisal <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="flex gap-6 relative items-start">
                {/* Main List */}
                <div className="flex-1 space-y-6">
                    <div className="panel p-4 sticky top-4 z-10 !mb-0 flex gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-sky-500 transition-colors"
                                placeholder="Search countermeasures (e.g. 'signal', 'lighting')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-secondary">
                            Showing {filteredCMFs.length} results
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCMFs.map(cmf => {
                            const isSelected = selectedCMFs.some(c => c.id === cmf.id);
                            // Relax matching for recommendations
                            const isRecommended = topCrashType && (
                                cmf.crashType.toLowerCase().includes(topCrashType.toLowerCase()) ||
                                cmf.crashType === 'All'
                            );

                            return (
                                <div
                                    key={cmf.id}
                                    className={`panel p-0 flex flex-col overflow-hidden group transition-all duration-300 cursor-pointer h-full relative ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:shadow-md'}`}
                                    onClick={() => handleToggleCMF(cmf)}
                                >
                                    {isRecommended && (
                                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl uppercase tracking-wide z-10">
                                            Recommended
                                        </div>
                                    )}

                                    <div className="p-4 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-bold text-primary leading-tight line-clamp-2 min-h-[2.5em]">{cmf.name}</h4>
                                        </div>

                                        <div className="mb-4">
                                            <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-secondary uppercase inline-block">{cmf.crashType}</span>
                                        </div>

                                        <div className="space-y-2 text-xs text-secondary mt-auto">
                                            <div className="flex justify-between border-b border-slate-100 pb-1">
                                                <span>CMF</span>
                                                <span className="font-bold text-primary bg-slate-100 px-1 rounded">{cmf.cmf}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-slate-100 pb-1">
                                                <span>Cost</span>
                                                <span className="font-bold text-primary">${cmf.cost.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Life</span>
                                                <span className="font-bold text-primary">{cmf.life} yr</span>
                                            </div>
                                        </div>

                                        <div className={`mt-4 pt-3 border-t border-slate-100 flex items-center justify-between`}>
                                            <a
                                                href={`http://www.cmfclearinghouse.org/search.cfm?q=${encodeURIComponent(cmf.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-slate-400 hover:text-sky-600 flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ExternalLink size={10} /> Info
                                            </a>
                                            <div className={`transition-colors text-xs font-bold flex items-center gap-1 ${isSelected ? 'text-primary' : 'text-slate-300'}`}>
                                                {isSelected ? <><CheckCircle size={14} /> Selected</> : <><PlusCircle size={14} /> Add</>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sticky Sidebar */}
                <div className="w-80 shrink-0 sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
                    <div className="panel p-0 flex flex-col h-full shadow-lg border-t-4 border-t-primary">
                        <div className="panel-header">
                            <h3 className="flex items-center gap-2 m-0 text-sm">
                                <PieIcon size={16} className="text-primary" /> Selected Portfolio
                            </h3>
                        </div>

                        {/* Mini Cost Chart */}
                        {selectedCMFs.length > 0 && (
                            <div className="h-40 shrink-0 my-4 px-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={costData} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                                            {costData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', fontSize: '12px' }} formatter={(val) => `$${val.toLocaleString()}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="text-center text-xs text-secondary mt-[-10px]">Cost Distribution</div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-3 p-4 border-t border-slate-100">
                            {selectedCMFs.length === 0 ? (
                                <div className="text-center text-secondary py-12 flex flex-col items-center">
                                    <Info className="mb-3 text-slate-300" size={32} />
                                    <p className="text-sm">Select countermeasures from the list to build your portfolio.</p>
                                </div>
                            ) : (
                                selectedCMFs.map((cm, idx) => (
                                    <div key={cm.id} className="bg-slate-50 p-3 rounded text-sm relative border-l-4 shadow-sm" style={{ borderLeftColor: COLORS[idx % COLORS.length] }}>
                                        <div className="font-bold text-primary mb-1 truncate">{cm.name}</div>
                                        <div className="flex justify-between text-xs text-secondary">
                                            <span>CMF: {cm.cmf}</span>
                                            <span>${cm.cost.toLocaleString()}</span>
                                        </div>
                                        <button
                                            className="absolute top-1 right-1 text-slate-400 hover:text-red-500 p-1"
                                            onClick={() => handleToggleCMF(cm)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="bg-slate-50 p-4 border-t border-slate-200">
                            <div className="text-secondary text-xs mb-1 uppercase tracking-wider font-semibold">Total Investment</div>
                            <div className="text-2xl font-bold text-primary">
                                ${totalCost.toLocaleString()}
                            </div>
                            <div className="text-xs text-secondary mt-1">
                                {selectedCMFs.length} item{selectedCMFs.length !== 1 && 's'} selected
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
