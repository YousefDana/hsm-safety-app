import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, DollarSign, Calculator } from 'lucide-react';
import { MOCK_CMFS, CRASH_COSTS, DISCOUNT_RATE } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export function EconomicAppraisal() {
    const { currentProject } = useProject();
    const navigate = useNavigate();
    const [constructionCost, setConstructionCost] = useState(0);
    const [maintenanceCost, setMaintenanceCost] = useState(1000);
    const [serviceLife, setServiceLife] = useState(20);

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];
    const selectedCMFIds = currentProject.selectedCMFs?.[siteId] || [];

    useEffect(() => {
        const baseCost = selectedCMFIds.reduce((acc, id) => {
            const cmf = MOCK_CMFS.find(c => c.id === id);
            return acc + (cmf?.cost || 0);
        }, 0);
        setConstructionCost(baseCost);

        if (selectedCMFIds.length > 0) {
            const maxLife = Math.max(...selectedCMFIds.map(id => MOCK_CMFS.find(c => c.id === id).life));
            setServiceLife(maxLife);
        }
    }, [siteId, JSON.stringify(selectedCMFIds)]);

    if (!site) return <div>No site selected.</div>;

    const combinedCMF = selectedCMFIds.reduce((acc, id) => acc * MOCK_CMFS.find(c => c.id === id).cmf, 1);
    const crashReductionFactor = 1 - combinedCMF;
    const AVG_CRASH_COST = 150000;
    const annualCrashReduction = site.predictedCrashes * crashReductionFactor;
    const annualSafetyBenefit = annualCrashReduction * AVG_CRASH_COST;
    const factor = (Math.pow(1 + DISCOUNT_RATE, serviceLife) - 1) / (DISCOUNT_RATE * Math.pow(1 + DISCOUNT_RATE, serviceLife));
    const presentValueBenefits = annualSafetyBenefit * factor;
    const presentValueMaintenance = maintenanceCost * factor;
    const presentValueCosts = constructionCost + presentValueMaintenance;
    const netPresentValue = presentValueBenefits - presentValueCosts;
    const benefitCostRatio = presentValueCosts > 0 ? presentValueBenefits / presentValueCosts : 0;

    // Chart Data
    const comparisonData = [
        { name: 'Benefits', amount: presentValueBenefits, fill: '#10b981' }, // Green
        { name: 'Costs', amount: presentValueCosts, fill: '#ef4444' },       // Red
    ];

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate('/countermeasures')} className="text-secondary hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-secondary text-sm uppercase tracking-wider">Step 4: Economic Appraisal</span>
                    </div>
                    <h2>Economic Appraisal</h2>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/prioritization')}
                >
                    Proceed to Prioritization <ArrowRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="premium-card lg:col-span-1 h-fit">
                    <h3 className="mb-4">Project Costs</h3>
                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Total Construction ($)</label>
                            <label className="form-label">Total Construction ($)</label>
                            <input
                                type="range"
                                min={0}
                                max={5000000}
                                step={10000}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2 accent-amber-500"
                                value={constructionCost}
                                onChange={(e) => setConstructionCost(parseFloat(e.target.value))}
                            />
                            <input
                                type="number"
                                className="form-input font-bold"
                                value={constructionCost}
                                onChange={(e) => setConstructionCost(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Annual Maintenance ($)</label>
                            <input
                                type="range"
                                min={0}
                                max={50000}
                                step={100}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2 accent-amber-500"
                                value={maintenanceCost}
                                onChange={(e) => setMaintenanceCost(parseFloat(e.target.value))}
                            />
                            <input
                                type="number"
                                className="form-input"
                                value={maintenanceCost}
                                onChange={(e) => setMaintenanceCost(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Service Life (Years)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={serviceLife}
                                onChange={(e) => setServiceLife(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Visual Comparison Chart */}
                        <div className="premium-card h-64 p-4">
                            <h4 className="text-sm text-secondary mb-2">Benefit-Cost Comparison (PV)</h4>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={comparisonData}>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        formatter={(value) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '']}
                                    />
                                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Key Metrics */}
                        <div className="flex flex-col gap-4">
                            <div className="glass-panel p-6 rounded-lg flex-1 flex flex-col justify-center">
                                <div className="text-secondary text-sm mb-1 uppercase tracking-wide">Benefit-Cost Ratio</div>
                                <div className={`text-5xl font-bold ${benefitCostRatio >= 1.0 ? 'text-amber-400 api-gradient' : 'text-slate-500'}`}>
                                    {benefitCostRatio.toFixed(2)}
                                </div>
                                <div className="w-full bg-slate-700 h-1 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${benefitCostRatio >= 1.0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(benefitCostRatio * 50, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="glass-panel p-4 rounded-lg">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary">Ann. Safety Benefit</span>
                                    <span className="text-green-400 font-medium">${annualSafetyBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-secondary">Net Present Value</span>
                                    <span className={`font-medium ${netPresentValue > 0 ? 'text-white' : 'text-red-400'}`}>${netPresentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
