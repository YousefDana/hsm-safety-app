import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BarChart2, DollarSign, Map } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto py-12 space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <img
                    src="https://highstreetconsulting.com/wp-content/uploads/high-street-logo-400x83.png"
                    alt="High Street Consulting"
                    className="h-16 mx-auto mb-8"
                />
                <h1 className="text-5xl font-bold text-primary tracking-tight">
                    Mock Chicago Department of Transportation Safety Analysis Tool
                </h1>
                <p className="text-xl text-secondary max-w-3xl mx-auto font-light">
                    A data-driven workflow to screen the roadway network, diagnosis collision patterns, and implement cost-effective countermeasures.
                    This tool is not to be used for analysis and only created for the CDOT STP Group 3 proposal.
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
                        Identify high-risk locations based on Crash Frequency, Crash Rate, Excess Crashes, or Critical Rate.
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

        </div>
    );
}
