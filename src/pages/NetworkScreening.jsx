import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCREENING_METHODS } from '../data/mockData'; // Keeping screening methods config for now
import { Table } from '../components/Table';
import { MapComponent } from '../components/MapComponent';
import { AlertCircle, BarChart2, ArrowRight, Play, Sliders, Calendar, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchCrashes, aggregateCrashesByStreet } from '../services/chicagoDataService';

export function NetworkScreening() {
    const navigate = useNavigate();
    const { selectSite } = useProject();
    const [selectedMethod, setSelectedMethod] = useState(SCREENING_METHODS[2].id);
    const [startYear, setStartYear] = useState(2019);
    const [endYear, setEndYear] = useState(2023);
    const [isCalculated, setIsCalculated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [realSites, setRealSites] = useState([]);
    const [dataError, setDataError] = useState(null);

    // Initial load handling or on-demand
    useEffect(() => {
        // Optional: Auto-load data or wait for "Run Screening"
    }, []);

    const handleRunScreening = async () => {
        setIsLoading(true);
        setIsCalculated(false);
        setDataError(null);
        try {
            // Fetch crashes for the selected years
            const whereClause = `crash_date >= '${startYear}-01-01' AND crash_date <= '${endYear}-12-31'`;
            console.log("Fetching crashes with:", whereClause);

            const crashes = await fetchCrashes(2000, whereClause); // Limit 2000 for demo speed
            console.log("Fetched crashes:", crashes.length);

            if (crashes.length === 0) {
                setDataError("No crash data found for this period.");
            } else {
                const aggregatedSites = aggregateCrashesByStreet(crashes);
                setRealSites(aggregatedSites);
                setIsCalculated(true);
            }
        } catch (err) {
            console.error(err);
            setDataError("Failed to fetch Chicago crash data. " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeSite = (site) => {
        selectSite(site);
        navigate('/diagnosis');
    };

    const columns = [
        { key: 'rank', label: 'Rank', render: (val) => <span className="font-header font-bold text-amber-600">#{val}</span> },
        {
            key: 'displayName',
            label: 'Street Segment / Location',
            render: (val, row) => (
                <div>
                    <div className="font-bold text-slate-700">{val || row.name}</div>
                    {!val && <div className="text-xs text-slate-400 italic">Entire Corridor</div>}
                </div>
            )
        },
        { key: 'crashes', label: 'Total Crashes', render: (val) => <span className="font-mono">{val}</span> },
        {
            key: 'severity',
            label: 'Severe (K+A)',
            render: (val) => <span className="font-bold text-red-600 font-mono">{(val.k || 0) + (val.a || 0)}</span>
        },
        {
            key: 'excess',
            label: 'Exp. Excess',
            render: (val) => (
                <span className={val > 0 ? "text-red-500 font-medium font-mono" : "text-green-500 font-mono"}>
                    {val > 0 ? '+' : ''}{val}
                </span>
            )
        },
        {
            key: 'action',
            label: '',
            render: (_, row) => (
                <button
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-primary"
                    onClick={(e) => { e.stopPropagation(); handleAnalyzeSite(row); }}
                    title="Analyze Site"
                >
                    <ArrowRight size={16} />
                </button>
            )
        }
    ];

    // Distribution Data for Histogram
    const distData = realSites.slice(0, 15).map(s => ({
        name: s.id.split(' ').slice(0, 2).join(' '), // Shorten name
        value: s.crashes,
        color: s.crashes > 50 ? '#be123c' : '#0ea5e9'
    }));

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex shrink-0 mb-4 items-center justify-between">
                <div>
                    <h2>Network Screening</h2>
                    <p className="text-secondary">Identify high-injury corridors using Chicago Data Portal crash records.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Left Panel: Config */}
                <div className="panel lg:col-span-1 h-fit overflow-y-auto">
                    <div className="panel-header">
                        <h3 className="flex items-center gap-2 text-lg">
                            <Sliders size={18} /> Configuration
                        </h3>
                    </div>
                    <div className="panel-content space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary">Screening Method</label>
                            <select
                                className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none"
                                value={selectedMethod}
                                onChange={(e) => { setSelectedMethod(e.target.value); setIsCalculated(false); }}
                            >
                                {SCREENING_METHODS.map(m => (
                                    <option key={m.id} value={m.id}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary flex items-center gap-1"><Calendar size={12} /> Start Year</label>
                                <select className="w-full text-sm p-2 border border-slate-300 rounded outline-none" value={startYear} onChange={e => setStartYear(e.target.value)}>
                                    {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary flex items-center gap-1"><Calendar size={12} /> End Year</label>
                                <select className="w-full text-sm p-2 border border-slate-300 rounded outline-none" value={endYear} onChange={e => setEndYear(e.target.value)}>
                                    {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        {dataError && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-start gap-2">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                {dataError}
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-200">
                            <button
                                className="btn btn-primary w-full py-3 text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleRunScreening}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
                                {isLoading ? 'Querying Socrata...' : 'Run Screening'}
                            </button>
                        </div>

                        <p className="text-xs text-center text-slate-400 mt-2">
                            Connects to data.cityofchicago.org
                        </p>
                    </div>
                </div>

                {/* Right Panel: Data Viz */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                    {isCalculated ? (
                        <>
                            <div className="h-[40%] min-h-[200px] rounded-lg overflow-hidden border border-slate-200 relative shrink-0">
                                <div className="absolute top-2 left-2 z-[400] bg-white/90 px-2 py-1 rounded border border-slate-200 text-xs font-mono shadow-sm">
                                    Geospatial Distribution ({realSites.length} Corridors)
                                </div>
                                <MapComponent sites={realSites} onSiteClick={handleAnalyzeSite} />
                            </div>

                            <div className="flex-1 flex gap-4 min-h-0">
                                {/* Table Widget */}
                                <div className="w-2/3 overflow-auto bg-white rounded-lg border border-slate-200">
                                    <Table columns={columns} data={realSites} onRowClick={handleAnalyzeSite} />
                                </div>

                                {/* Histogram Widget */}
                                <div className="w-1/3 panel !mb-0 flex flex-col">
                                    <div className="panel-header py-2 min-h-[auto]">
                                        <h3 className="text-xs text-secondary uppercase m-0">Top 15 High Crash Corridors</h3>
                                    </div>
                                    <div className="flex-1 min-h-0 p-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={distData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 20 }}>
                                                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Total Crashes', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }} />
                                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }} itemStyle={{ color: '#1e293b' }} />
                                                <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={15}>
                                                    {distData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="panel p-12 flex flex-col items-center justify-center text-center h-full border-2 border-dashed border-slate-300 shadow-none bg-slate-50">
                            <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-6">
                                {isLoading ? (
                                    <Loader2 size={40} className="text-secondary animate-spin" />
                                ) : (
                                    <BarChart2 size={40} className="text-slate-400" />
                                )}
                            </div>
                            <h3 className="text-2xl text-primary font-light mb-2">
                                {isLoading ? 'Processing Chicago Data...' : 'Ready to Analyze'}
                            </h3>
                            <p className="text-secondary max-w-sm">
                                {isLoading
                                    ? 'Fetching live crash records from Socrata API and aggregating by street segment...'
                                    : 'Select your analysis years and run screening to pull real-time IDOT/Chicago crash data.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
