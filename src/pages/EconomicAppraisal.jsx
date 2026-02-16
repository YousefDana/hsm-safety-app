import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, DollarSign, Calculator } from 'lucide-react';
import { MOCK_CMFS, CRASH_COSTS, DISCOUNT_RATE } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export function EconomicAppraisal() {
    const { currentProject, updateAppraisal } = useProject();
    const navigate = useNavigate();
    const [constructionCost, setConstructionCost] = useState(0);
    const [maintenanceCost, setMaintenanceCost] = useState(1000);
    const [serviceLife, setServiceLife] = useState(20);

    const siteId = currentProject.selectedSites[0];
    const site = currentProject.sitesData[siteId];
    // Read from site.countermeasures object
    const selectedCMFs = site?.countermeasures || [];

    useEffect(() => {
        // Calculate dynamic cost based on selection
        const baseCost = selectedCMFs.reduce((acc, cm) => acc + (cm.cost || 0), 0);
        const maxLife = selectedCMFs.length > 0 ? Math.max(...selectedCMFs.map(cm => cm.life)) : 20;

        // Use functional state updates to avoid loops/stale closures if we added dependencies
        setConstructionCost(baseCost);
        setServiceLife(maxLife);
    }, [selectedCMFs.length, siteId]); // Simple dependency check on length

    if (!site) return <div>No site selected.</div>;

    // --- BCA Engine ---
    const combinedCMF = selectedCMFs.reduce((acc, cm) => acc * cm.cmf, 1);
    const crashReductionFactor = 1 - combinedCMF;

    // Average Cost per Crash (Simplified Blended Rate or specific if available)
    const AVG_CRASH_COST = 150000;

    // Annual Crash Frequency (Assuming site.crashes is 1-year data for demo, otherwise divide by years)
    const annualCrashes = site.crashes || 0;

    // Monetary Benefits
    const annualSafetyBenefit = (annualCrashes * crashReductionFactor) * AVG_CRASH_COST;

    // Discount Factors
    const r = DISCOUNT_RATE;
    const n = serviceLife;
    const uniformSeriesFactor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

    const presentValueBenefits = annualSafetyBenefit * uniformSeriesFactor;
    const presentValueMaintenance = maintenanceCost * uniformSeriesFactor;
    const presentValueCosts = constructionCost + presentValueMaintenance;
    const netPresentValue = presentValueBenefits - presentValueCosts;
    const benefitCostRatio = presentValueCosts > 0 ? presentValueBenefits / presentValueCosts : 0;

    const handleProceed = () => {
        updateAppraisal(siteId, {
            bcaRatio: benefitCostRatio,
            npv: netPresentValue,
            cost: presentValueCosts,
            benefits: presentValueBenefits,
            status: 'Proposed'
        });
        navigate('/prioritization');
    };

    // Chart Data
    const comparisonData = [
        { name: 'Benefits', amount: presentValueBenefits, fill: '#10b981' },
        { name: 'Costs', amount: presentValueCosts, fill: '#ef4444' },
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

                <div className="flex items-center gap-4">
                    {benefitCostRatio > 1.0 && (
                        <div className="hidden md:flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-bold border border-green-200">
                            <DollarSign size={14} /> Viable Project
                        </div>
                    )}
                    <button
                        className="btn btn-primary"
                        onClick={handleProceed}
                    >
                        Proceed to Prioritization <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="panel p-6 lg:col-span-1 h-fit">
                    <h3 className="mb-4 flex items-center gap-2"><Calculator size={18} /> Project Costs</h3>
                    <div className="space-y-6">
                        <div className="form-group">
                            <label className="text-xs uppercase font-bold text-secondary mb-1 block">Total Construction ($)</label>
                            <input
                                type="range"
                                min={0}
                                max={5000000}
                                step={10000}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-3 accent-sky-500"
                                value={constructionCost}
                                onChange={(e) => setConstructionCost(parseFloat(e.target.value))}
                            />
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3 text-secondary" />
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                                    value={constructionCost}
                                    onChange={(e) => setConstructionCost(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-xs uppercase font-bold text-secondary mb-1 block">Annual Maintenance ($)</label>
                            <input
                                type="range"
                                min={0}
                                max={50000}
                                step={100}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-3 accent-sky-500"
                                value={maintenanceCost}
                                onChange={(e) => setMaintenanceCost(parseFloat(e.target.value))}
                            />
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3 text-secondary" />
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                                    value={maintenanceCost}
                                    onChange={(e) => setMaintenanceCost(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-xs uppercase font-bold text-secondary mb-1 block">Service Life (Years)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                                value={serviceLife}
                                onChange={(e) => setServiceLife(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Visual Comparison Chart */}
                        <div className="panel p-4 h-64">
                            <h4 className="text-xs text-secondary mb-4 uppercase font-bold">Benefit-Cost Comparison (PV)</h4>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={comparisonData}>
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                                        itemStyle={{ color: '#1e293b' }}
                                        formatter={(value) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '']}
                                    />
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Key Metrics */}
                        <div className="flex flex-col gap-4">
                            <div className="panel p-6 rounded-lg flex-1 flex flex-col justify-center bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-4 opacity-5">
                                    <Calculator size={100} />
                                </div>
                                <div className="text-secondary text-xs mb-1 uppercase tracking-wide font-bold">Benefit-Cost Ratio</div>
                                <div className={`text-5xl font-header font-bold ${benefitCostRatio >= 1.0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {benefitCostRatio.toFixed(2)}
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${benefitCostRatio >= 1.0 ? 'bg-amber-500' : 'bg-red-400'}`}
                                        style={{ width: `${Math.min(benefitCostRatio * 50, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-right mt-1 text-secondary">Target: 1.0+</div>
                            </div>
                            <div className="panel p-4 rounded-lg bg-slate-50 border-slate-200">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary font-medium">Ann. Safety Benefit</span>
                                    <span className="text-green-600 font-bold">${annualSafetyBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-200">
                                    <span className="text-secondary font-medium">Net Present Value</span>
                                    <span className={`font-bold ${netPresentValue > 0 ? 'text-primary' : 'text-red-500'}`}>${netPresentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
