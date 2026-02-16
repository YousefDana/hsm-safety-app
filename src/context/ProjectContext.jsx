import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [currentProject, setCurrentProject] = useState({
        id: 'proj_001',
        name: 'District 1 Safety Audit',
        analysisYear: 2025,
        selectedSites: [], // Array of site IDs
        sitesData: {}, // Map of siteID -> Data
    });

    const updateProject = (updates) => {
        setCurrentProject(prev => ({ ...prev, ...updates }));
    };

    const selectSite = (site) => {
        updateProject({
            selectedSites: [...new Set([...currentProject.selectedSites, site.id])],
            sitesData: { ...currentProject.sitesData, [site.id]: site }
        });
    };

    const addCountermeasure = (siteId, cm) => {
        const existing = currentProject.sitesData[siteId]?.countermeasures || [];
        updateProject({
            sitesData: {
                ...currentProject.sitesData,
                [siteId]: { ...currentProject.sitesData[siteId], countermeasures: [...existing, cm] }
            }
        });
    };

    const updateAppraisal = (siteId, bcaData) => {
        updateProject({
            sitesData: {
                ...currentProject.sitesData,
                [siteId]: { ...currentProject.sitesData[siteId], appraisal: bcaData }
            }
        });
    };

    return (
        <ProjectContext.Provider value={{ currentProject, updateProject, selectSite, addCountermeasure, updateAppraisal }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    return useContext(ProjectContext);
}
