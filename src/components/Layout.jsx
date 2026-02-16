import React from 'react';
import { Header } from './Header';

export function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header />
            <main className="flex-1 p-6 max-w-[1920px] w-full mx-auto animate-fade-in">
                {children}
            </main>
        </div>
    );
}
