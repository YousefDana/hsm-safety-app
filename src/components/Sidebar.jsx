import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Network,
    Stethoscope,
    ShieldCheck,
    DollarSign,
    ListOrdered,
    TrendingUp,
    Menu
} from 'lucide-react';

const steps = [
    { path: '/network-screening', label: '1. Network Screening', icon: Network },
    { path: '/diagnosis', label: '2. Diagnosis', icon: Stethoscope },
    { path: '/countermeasures', label: '3. Countermeasures', icon: ShieldCheck },
    { path: '/economic-appraisal', label: '4. Economic Appraisal', icon: DollarSign },
    { path: '/prioritization', label: '5. Prioritization', icon: ListOrdered },
    { path: '/evaluation', label: '6. Evaluation', icon: TrendingUp },
];

export function Sidebar() {
    return (
        <aside className="sidebar glass-panel">
            <NavLink to="/" className="sidebar-header text-white hover:text-amber-500 transition-colors no-underline decoration-0">
                <div className="logo-box">HSM</div>
                <span className="font-bold">Safety App</span>
            </NavLink>

            <nav className="sidebar-nav">
                {steps.map((step) => (
                    <NavLink
                        key={step.path}
                        to={step.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <step.icon size={20} />
                        <span>{step.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p className="text-xs text-secondary">© 2026 Traffic Safety</p>
            </div>
        </aside>
    );
}
