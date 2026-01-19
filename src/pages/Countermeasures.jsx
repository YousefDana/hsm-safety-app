import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search, PlusCircle, CheckCircle, ExternalLink, Info, PieChart as PieIcon } from 'lucide-react';
import { MOCK_CMFS } from '../data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function Countermeasures() {
    const { currentProject, updateProject } = useProject();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    const selectedCMFs = currentProject.selectedCMFs?.[siteId] || [];

    const handleToggleCMF = (cmf) => {
        const currentForSite = currentProject.selectedCMFs?.[siteId] || [];
        let newSelection;
        if (currentForSite.includes(cmf.id)) {
            newSelection = currentForSite.filter(id => id !== cmf.id);
        } else {
            newSelection = [...currentForSite, cmf.id];
        }
        updateProject({ selectedCMFs: { ...currentProject.selectedCMFs, [siteId]: newSelection } });
    };

    const filteredCMFs = MOCK_CMFS.filter(cmf =>
        cmf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmf.crashType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCost = selectedCMFs.reduce((acc, id) => acc + MOCK_CMFS.find(c => c.id === id).cost, 0);

    // Data for sidebar chart
    const costData = selectedCMFs.map(id => {
        const c = MOCK_CMFS.find(c => c.id === id);
        return { name: c.name, value: c.cost };
    });
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

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/economic-appraisal')}
                    disabled={selectedCMFs.length === 0}
                >
                    Appraisal <ArrowRight size={18} />
                </button>
            </div>

            <div className="flex gap-6 relative items-start">
                {/* Main List */}
                <div className="flex-1 space-y-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg flex gap-4 sticky top-20 z-10 backdrop-blur-md border border-white/5 shadow-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-secondary" size={20} />
                            <input
                                type="text"
                                className="form-input pl-10"
                                placeholder="Type to search (e.g. 'signal', 'lighting')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredCMFs.map(cmf => {
                            const isSelected = selectedCMFs.includes(cmf.id);
                            return (
                                <div
                                    key={cmf.id}
                                    className={`premium-card flex flex-col md:flex-row gap-4 items-center justify-between group transition-all duration-300 cursor-pointer ${isSelected ? 'border-amber-500/50 bg-slate-800 translate-x-1 outline outline-1 outline-amber-500/30' : 'hover:bg-slate-800/50'}`}
                                    onClick={() => handleToggleCMF(cmf)}
                                >
                                    <div className="flex-1">
                                        <h4 className="flex items-center gap-2 text-lg">
                                            {cmf.name}
                                        </h4>
                                        <div className="flex gap-2 mb-3 mt-1">
                                            <span className="text-xs font-mono bg-slate-700/50 border border-slate-600 px-2 py-0.5 rounded text-secondary uppercase tracking-wide">{cmf.crashType}</span>
                                            <span className="text-xs font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-500">CMF: {cmf.cmf}</span>
                                        </div>
                                        <div className="flex gap-6 text-sm text-secondary">
                                            <div className="flex items-center gap-1">Price: <span className="text-white font-medium">${cmf.cost.toLocaleString()}</span></div>
                                            <div className="flex items-center gap-1">Life: <span className="text-white font-medium">{cmf.life} yrs</span></div>
                                        </div>
                                        <a
                                            href={`http://www.cmfclearinghouse.org/search.cfm?q=${encodeURIComponent(cmf.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-amber-500 mt-2 hover:underline opacity-50 hover:opacity-100 transition-opacity w-fit"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={10} /> Clearinghouse Details
                                        </a>
                                    </div>
                                    <div className="border-l border-white/5 pl-6 h-full flex items-center justify-center">
                                        <button
                                            className={`btn ${isSelected ? 'btn-primary shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'btn-secondary'} rounded-full w-12 h-12 p-0 shrink-0 flex items-center justify-center transition-all`}
                                        >
                                            {isSelected ? <CheckCircle size={24} /> : <PlusCircle size={24} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sticky Sidebar */}
                <div className="w-80 shrink-0 sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
                    <div className="premium-card bg-slate-800/90 border-amber-500/20 flex flex-col h-full shadow-2xl">
                        <h3 className="mb-4 text-lg border-b border-white/10 pb-4 flex items-center gap-2">
                            <PieIcon size={18} className="text-amber-500" /> Portfolio
                        </h3>

                        {/* Mini Cost Chart */}
                        {selectedCMFs.length > 0 && (
                            <div className="h-40 shrink-0 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={costData} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                                            {costData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '12px' }} formatter={(val) => `$${val.toLocaleString()}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="text-center text-xs text-secondary mt-[-10px]">Cost Distribution</div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                            {selectedCMFs.length === 0 ? (
                                <div className="text-center text-secondary py-12 flex flex-col items-center">
                                    <Info className="mb-3 opacity-20" size={48} />
                                    <p>Select countermeasures from the list to build your portfolio.</p>
                                </div>
                            ) : (
                                selectedCMFs.map((id, idx) => {
                                    const cmf = MOCK_CMFS.find(c => c.id === id);
                                    return (
                                        <div key={id} className="bg-slate-900/50 p-3 rounded text-sm relative border-l-2 pl-3" style={{ borderLeftColor: COLORS[idx % COLORS.length] }}>
                                            <div className="font-medium mb-1 truncate">{cmf.name}</div>
                                            <div className="flex justify-between text-xs text-secondary">
                                                <span>CMF: {cmf.cmf}</span>
                                                <span>${cmf.cost.toLocaleString()}</span>
                                            </div>
                                            <button
                                                className="absolute top-1 right-1 text-slate-600 hover:text-red-400 p-1"
                                                onClick={() => handleToggleCMF(cmf)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="bg-slate-900 rounded p-4 mt-4 shrink-0 border border-slate-700">
                            <div className="text-secondary text-xs mb-1 uppercase tracking-wider">Total Investment</div>
                            <div className="text-2xl font-bold text-white">
                                ${totalCost.toLocaleString()}
                            </div>
                            <div className="text-xs text-amber-500 mt-1">
                                {selectedCMFs.length} item{selectedCMFs.length !== 1 && 's'} selected
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
