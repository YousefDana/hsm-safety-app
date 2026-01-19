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

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];

    // Current Project Object
    const currentProjectMock = {
        id: currentProject.id,
        name: currentProject.name,
        cost: 325000,
        bcr: 4.2,
        npv: 850000,
        // Use site location if available, else default
        lat: site?.lat || 40.7128,
        lng: site?.lng || -74.0060
    };

    const otherProjects = [
        { id: 'p_002', name: 'Rt 66 Signal Upgrade', cost: 450000, bcr: 3.8, npv: 1200000, ...OTHER_PROJECT_LOCS['p_002'] },
        { id: 'p_003', name: 'Downtown Pedestrian Safety', cost: 120000, bcr: 5.1, npv: 450000, ...OTHER_PROJECT_LOCS['p_003'] },
        { id: 'p_004', name: 'County Rd 12 Curve Realignment', cost: 1800000, bcr: 1.5, npv: 200000, ...OTHER_PROJECT_LOCS['p_004'] },
        { id: 'p_005', name: 'School Zone Traffic Calming', cost: 85000, bcr: 2.9, npv: 110000, ...OTHER_PROJECT_LOCS['p_005'] },
        { id: 'p_006', name: 'Bridge Rail Replacement', cost: 650000, bcr: 0.9, npv: -50000, ...OTHER_PROJECT_LOCS['p_006'] },
    ];

    const allProjects = [currentProjectMock, ...otherProjects].sort((a, b) => b.bcr - a.bcr);

    let cumulativeCost = 0;
    const fundedProjects = allProjects.map(p => {
        cumulativeCost += p.cost;
        const funded = cumulativeCost <= budget;
        return { ...p, funded, crashes: `BCR: ${p.bcr}` }; // Hack to show BCR in map popup
    });

    const columns = [
        { key: 'rank', label: 'Rank', render: (_, __, idx) => <span className="font-bold">#{idx + 1}</span> },
        {
            key: 'name', label: 'Project Name', render: (val, row) => (
                <span className={row.id === currentProject.id ? "text-amber-500 font-bold" : ""}>
                    {val} {row.id === currentProject.id && '(Current)'}
                </span>
            )
        },
        { key: 'cost', label: 'Cost', render: (val) => `$${(val / 1000).toFixed(0)}k` }, // Compact format
        { key: 'bcr', label: 'BCR', render: (val) => <span className={val > 1 ? "text-green-400" : "text-red-400"}>{val.toFixed(2)}</span> },
        {
            key: 'funded', label: 'Status', render: (val) => (
                <span className={`badge ${val ? 'bg-green-500/20 text-green-500' : 'bg-red-500/10 text-red-500/50'}`}>
                    {val ? 'Funded' : 'Cut'}
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

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/evaluation')}
                >
                    Evaluation <ArrowRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Controls */}
                <div className="premium-card lg:col-span-1 h-fit">
                    <h3 className="mb-4 flex items-center gap-2">
                        <DollarSign className="text-green-500" /> Budget
                    </h3>
                    <div className="form-group">
                        <label className="form-label">Available Budget ($)</label>
                        <input
                            type="number"
                            className="form-input text-lg font-bold"
                            value={budget}
                            onChange={(e) => setBudget(parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                        <div className="text-secondary text-sm">Projects Funded</div>
                        <div className="text-2xl font-bold text-white">
                            {fundedProjects.filter(p => p.funded).length} / {fundedProjects.length}
                        </div>
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                    {/* Map View of Projects */}
                    <div className="h-[40%] min-h-[250px] rounded-lg border border-slate-700 overflow-hidden relative">
                        <div className="absolute top-2 right-2 z-10 bg-slate-900/80 px-2 py-1 rounded text-xs text-white border border-slate-700">
                            Map View
                        </div>
                        <MapComponent sites={fundedProjects} />
                    </div>

                    {/* Table View */}
                    <div className="flex-1 overflow-auto bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                        <Table columns={columns} data={fundedProjects} />
                    </div>
                </div>
            </div>
        </div>
    );
}
