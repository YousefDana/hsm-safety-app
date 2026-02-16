import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ListOrdered, DollarSign, Map as MapIcon } from 'lucide-react';
import { Table } from '../components/Table';
import { MapComponent } from '../components/MapComponent';
import { useProject } from '../context/ProjectContext';

// Basic Mock lat/lngs for other projects for the map
const OTHER_PROJECT_LOCS = {
    'p_002': { lat: 40.7160, lng: -74.0045 },
    'p_003': { lat: 40.7120, lng: -74.0020 },
    'p_004': { lat: 40.7180, lng: -74.0090 },
    'p_005': { lat: 40.7110, lng: -74.0050 },
    'p_006': { lat: 40.7140, lng: -74.0070 },
};

export function Prioritization() {
    const navigate = useNavigate();
    const { currentProject } = useProject();
    const [budget, setBudget] = useState(2500000);

    // Get all sites that have appraisal data
    const analyzedSites = Object.values(currentProject.sitesData || {})
        .filter(site => site.appraisal)
        .map(site => ({
            id: site.id,
            name: site.name,
            cost: site.appraisal.cost || 0,
            bcr: site.appraisal.bcaRatio || 0,
            npv: site.appraisal.npv || 0,
            lat: site.lat,
            lng: site.lng
        }));

    // Generate some contextual mock projects around the first real site (or Chicago center)
    const centerLat = analyzedSites[0]?.lat || 41.8781;
    const centerLng = analyzedSites[0]?.lng || -87.6298;

    const otherProjects = [
        { id: 'p_002', name: 'Western Ave Signal Upgrade', cost: 450000, bcr: 3.8, npv: 1200000, lat: centerLat + 0.01, lng: centerLng + 0.01 },
        { id: 'p_003', name: 'Loop Pedestrian Safety', cost: 120000, bcr: 5.1, npv: 450000, lat: centerLat - 0.01, lng: centerLng - 0.005 },
        { id: 'p_004', name: 'LSD Curve Realignment', cost: 1800000, bcr: 1.5, npv: 200000, lat: centerLat + 0.02, lng: centerLng - 0.01 },
        { id: 'p_005', name: 'School Zone Traffic Calming', cost: 85000, bcr: 2.9, npv: 110000, lat: centerLat - 0.005, lng: centerLng + 0.01 },
        { id: 'p_006', name: 'Bridge Rail Replacement', cost: 650000, bcr: 0.9, npv: -50000, lat: centerLat + 0.005, lng: centerLng - 0.02 },
    ];

    const allProjects = [...analyzedSites, ...otherProjects].sort((a, b) => b.bcr - a.bcr);

    let cumulativeCost = 0;
    const fundedProjects = allProjects.map(p => {
        cumulativeCost += p.cost;
        const funded = cumulativeCost <= budget;
        return { ...p, funded, crashes: `BCR: ${(p.bcr || 0).toFixed(2)}` }; // Map popup text reuse
    });

    const columns = [
        { key: 'rank', label: 'Rank', render: (_, __, idx) => <span className="font-header font-bold text-primary">#{idx + 1}</span> },
        {
            key: 'name', label: 'Project Name', render: (val, row) => (
                <span className={analyzedSites.find(s => s.id === row.id) ? "text-amber-600 font-bold flex items-center gap-2" : "text-primary"}>
                    {val} {analyzedSites.find(s => s.id === row.id) && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded border border-amber-200">CURRENT</span>}
                </span>
            )
        },
        { key: 'cost', label: 'Cost', render: (val) => <span className="font-mono text-secondary">${((val || 0) / 1000).toFixed(0)}k</span> },
        { key: 'bcr', label: 'BCR', render: (val) => <span className={`font-bold ${val > 1 ? "text-green-600" : "text-red-500"}`}>{(val || 0).toFixed(2)}</span> },
        {
            key: 'funded', label: 'Status', render: (val) => (
                <span className={`px-2 py-1 rounded text-xs font-bold border ${val ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200 opacity-50'}`}>
                    {val ? 'FUNDED' : 'DEFERRED'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="page-header shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate('/economic-appraisal')} className="text-secondary hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-secondary text-sm uppercase tracking-wider">Step 5: Prioritization</span>
                    </div>
                    <h2>Project Prioritization</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-sm text-secondary">Funded Projects</div>
                        <div className="font-bold text-primary">{fundedProjects.filter(p => p.funded).length} / {fundedProjects.length}</div>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/evaluation')}
                    >
                        Evaluation <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Controls */}
                <div className="panel p-6 lg:col-span-1 h-fit">
                    <h3 className="mb-4 flex items-center gap-2 text-primary">
                        <DollarSign size={20} className="text-green-600" /> Budget Constraints
                    </h3>
                    <div className="form-group">
                        <label className="text-xs uppercase font-bold text-secondary mb-1 block">Available Budget ($)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="number"
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none font-bold text-lg text-primary"
                                value={budget}
                                onChange={(e) => setBudget(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded border border-slate-200">
                        <div className="text-xs uppercase font-bold text-secondary mb-1">Portfolio Summary</div>
                        <div className="text-3xl font-bold text-primary mb-1">
                            ${(cumulativeCost / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-secondary">Total Asks</div>
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                    {/* Map View of Projects */}
                    <div className="h-[40%] min-h-[250px] rounded-lg border border-slate-200 overflow-hidden relative shadow-inner">
                        <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-primary border border-slate-200 shadow-sm">
                            Portfolio Map
                        </div>
                        <MapComponent sites={fundedProjects} />
                    </div>

                    {/* Table View */}
                    <div className="flex-1 overflow-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                        <Table columns={columns} data={fundedProjects} />
                    </div>
                </div>
            </div>
        </div>
    );
}
