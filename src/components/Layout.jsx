import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="app-main">
                <header className="page-header">
                    {/* Placeholder for breadcrumbs or page title actions */}
                    <div className="flex-1"></div>
                    <div className="user-profile">
                        <span className="text-secondary text-sm">Traffic Safety Engineer</span>
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                    </div>
                </header>
                <div className="content-area animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
