import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { Layout } from './components/Layout';
import { NetworkScreening } from './pages/NetworkScreening';
import { Diagnosis } from './pages/Diagnosis';
import { Countermeasures } from './pages/Countermeasures';
import { EconomicAppraisal } from './pages/EconomicAppraisal';
import { Prioritization } from './pages/Prioritization';
import { Evaluation } from './pages/Evaluation';
import { Home } from './pages/Home';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/network-screening" element={<NetworkScreening />} />
                    <Route path="/diagnosis" element={<Diagnosis />} />
                    <Route path="/countermeasures" element={<Countermeasures />} />
                    <Route path="/economic-appraisal" element={<EconomicAppraisal />} />
                    <Route path="/prioritization" element={<Prioritization />} />
                    <Route path="/evaluation" element={<Evaluation />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
