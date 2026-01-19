export const MOCK_SITES = [
    { id: 1, name: 'Main St (1st Ave to 5th Ave)', aadt: 12500, length: 0.5, crashes: 15, predictedCrashes: 18.2, excess: 3.2, rank: 1, lat: 40.7128, lng: -74.0060 },
    { id: 2, name: 'Broadway (10th St to 15th St)', aadt: 8400, length: 0.7, crashes: 8, predictedCrashes: 10.1, excess: -2.1, rank: 3, lat: 40.7138, lng: -74.0040 },
    { id: 3, name: 'Elm St (Maple Rd to Oak Rd)', aadt: 5600, length: 1.2, crashes: 12, predictedCrashes: 8.5, excess: 3.5, rank: 2, lat: 40.7148, lng: -74.0010 },
    { id: 4, name: 'State Hwy 9 (Mile 10-12)', aadt: 22000, length: 2.0, crashes: 45, predictedCrashes: 42.0, excess: 3.0, rank: 4, lat: 40.7158, lng: -74.0080 },
    { id: 5, name: 'County Rd 45 (Intxn with CR 9)', aadt: 3500, length: 0.1, crashes: 5, predictedCrashes: 2.1, excess: 2.9, rank: 5, lat: 40.7118, lng: -74.0090 },
];

export const SCREENING_METHODS = [
    { id: 'crash_freq', label: 'Average Crash Frequency' },
    { id: 'crash_rate', label: 'Crash Rate' },
    { id: 'excess_expected', label: 'Excess Expected Average Crash Frequency' }, // Key HSM method
    { id: 'critical_rate', label: 'Critical Rate' }
];

export const MOCK_CMFS = [
    { id: 'cmf_001', name: 'Install Traffic Signal', cmf: 0.72, cost: 250000, life: 20, crashType: 'All' },
    { id: 'cmf_002', name: 'Convert to Roundabout', cmf: 0.65, cost: 1500000, life: 25, crashType: 'Injury' },
    { id: 'cmf_003', name: 'Install Left Turn Lane', cmf: 0.81, cost: 120000, life: 15, crashType: 'Rear End' },
    { id: 'cmf_004', name: 'Improve Lighting', cmf: 0.90, cost: 45000, life: 10, crashType: 'Nighttime' },
    { id: 'cmf_005', name: 'Install Rumble Strips', cmf: 0.85, cost: 15000, life: 7, crashType: 'Run-off-road' },
];

export const CRASH_COSTS = {
    k: 11200000, // Fatal
    a: 655000,   // Incapacitating Injury
    b: 198000,   // Non-incapacitating Injury
    c: 125000,   // Possible Injury
    o: 11900     // Property Damage Only
};

export const DISCOUNT_RATE = 0.04; // 4%
