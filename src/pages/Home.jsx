import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BarChart2, DollarSign, Map } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto py-12 space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold text-primary tracking-tight">
                    CDOT Safety Analysis Tool
                </h1>
                <p className="text-xl text-secondary max-w-2xl mx-auto font-light">
                    A data-driven workflow for the Highway Safety Manual 6-step process.
                    Screen Chicago's roadway network, diagnosis collision patterns, and implement cost-effective countermeasures.
                </p>
                <button
                    className="btn btn-primary text-lg px-8 py-4 rounded-full mt-4"
                    onClick={() => navigate('/network-screening')}
                >
                    Start Analysis <ArrowRight className="ml-2" />
                </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="panel p-6 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500" onClick={() => navigate('/network-screening')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Map size={20} />
                        </div>
                        <h3 className="text-xl m-0 text-primary">Network Screening</h3>
                    </div>
                    <p className="text-secondary text-sm">
                        Identify high-risk locations using advanced safety performance functions (SPFs) and empirical bayes methods.
                    </p>
                </div>

                <div className="panel p-6 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-amber-500" onClick={() => navigate('/countermeasures')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-xl m-0 text-primary">Countermeasure Selection</h3>
                    </div>
                    <p className="text-secondary text-sm">
                        Access the CMF Clearinghouse to find proven safety treatments and estimate their effectiveness.
                    </p>
                </div>

                <div className="panel p-6 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-green-500" onClick={() => navigate('/economic-appraisal')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <DollarSign size={20} />
                        </div>
                        <h3 className="text-xl m-0 text-primary">Economic Appraisal</h3>
                    </div>
                    <p className="text-secondary text-sm">
                        Perform rigorous Benefit-Cost Analysis (BCA) to ensure fiscal responsibility and maximize ROI.
                    </p>
                </div>

                <div className="panel p-6 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-purple-500" onClick={() => navigate('/prioritization')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <BarChart2 size={20} />
                        </div>
                        <h3 className="text-xl m-0 text-primary">Prioritization & Eval</h3>
                    </div>
                    <p className="text-secondary text-sm">
                        Rank projects within budget constraints and track post-implementation performance over time.
                    </p>
                </div>
            </div>

            {/* Workflow Steps Preview */}
            <div className="border-t border-slate-200 pt-12">
                <h2 className="text-center mb-8 text-2xl">The 6-Step Workflow</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {['Network Screening', 'Diagnosis', 'Countermeasure Selection', 'Economic Appraisal', 'Prioritization', 'Safety Effectiveness'].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm shadow-sm text-secondary">
                            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</span>
                            {step}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
