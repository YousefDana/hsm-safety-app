import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BarChart2, DollarSign, Map } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">
                    HSM Optimization Suite
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    A comprehensive, data-driven workflow for the Highway Safety Manual 6-step process.
                    Screen networks, diagnosis issues, and implement cost-effective countermeasures.
                </p>
                <button
                    className="btn btn-primary text-lg px-8 py-4 rounded-full mt-4"
                    onClick={() => navigate('/network-screening')}
                >
                    Start Analysis <ArrowRight className="ml-2" />
                </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="premium-card hover:bg-slate-800/80 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                        <Map size={24} />
                    </div>
                    <h3 className="text-xl mb-2">Network Screening</h3>
                    <p className="text-slate-400">
                        Identify high-risk locations using advanced safety performance functions (SPFs) and empirical bayes methods.
                    </p>
                </div>

                <div className="premium-card hover:bg-slate-800/80 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-xl mb-2">Countermeasure Selection</h3>
                    <p className="text-slate-400">
                        Access the CMF Clearinghouse to find proven safety treatments and estimate their effectiveness.
                    </p>
                </div>

                <div className="premium-card hover:bg-slate-800/80 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
                        <DollarSign size={24} />
                    </div>
                    <h3 className="text-xl mb-2">Economic Appraisal</h3>
                    <p className="text-slate-400">
                        Perform rigorous Benefit-Cost Analysis (BCA) to ensure fiscal responsibility and maximize ROI.
                    </p>
                </div>

                <div className="premium-card hover:bg-slate-800/80 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                        <BarChart2 size={24} />
                    </div>
                    <h3 className="text-xl mb-2">Prioritization & Eval</h3>
                    <p className="text-slate-400">
                        Rank projects within budget constraints and track post-implementation performance over time.
                    </p>
                </div>
            </div>

            {/* Workflow Steps Preview */}
            <div className="border-t border-slate-800 pt-16">
                <h2 className="text-center mb-12">The 6-Step Workflow</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {['Network Screening', 'Diagnosis', 'Countermeasure Selection', 'Economic Appraisal', 'Prioritization', 'Safety Effectiveness'].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm">
                            <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                            {step}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
