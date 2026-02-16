import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Network,
    Stethoscope,
    ShieldCheck,
    DollarSign,
    ListOrdered,
    TrendingUp
} from 'lucide-react';

const steps = [
    { path: '/network-screening', label: 'Network Screening', icon: Network },
    { path: '/diagnosis', label: 'Diagnosis', icon: Stethoscope },
    { path: '/countermeasures', label: 'Countermeasures', icon: ShieldCheck },
    { path: '/economic-appraisal', label: 'Economic Appraisal', icon: DollarSign },
    { path: '/prioritization', label: 'Prioritization', icon: ListOrdered },
    { path: '/evaluation', label: 'Evaluation', icon: TrendingUp },
];

export function Header() {
    return (
        <header className="dashboard-header">
            <NavLink to="/" className="header-brand">
                <div className="logo-box">CDOT</div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none">Safety App</span>
                    <span className="text-xs opacity-80 uppercase tracking-wider">Internal Tool</span>
                </div>
            </NavLink>

            <nav className="header-nav">
                {steps.map((step) => (
                    <NavLink
                        key={step.path}
                        to={step.path}
                        className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                        title={step.label}
                    >
                        <step.icon size={18} />
                        <span className="hidden lg:inline">{step.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="user-profile flex items-center gap-3">
                <div className="text-right hidden md:block">
                    <div className="text-sm font-bold">Traffic Safety</div>
                    <div className="text-xs text-slate-400">Engineer</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-600 border border-slate-500"></div>
            </div>
        </header>
    );
}
