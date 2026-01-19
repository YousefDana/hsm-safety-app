/**
 * Service to interact with NHTSA FARS (Fatality Analysis Reporting System) API
 * Base URL is proxied via /api/nhtsa to avoid CORS in dev.
 */

const BASE_URL = '/api/nhtsa';

export const farsService = {
    /**
     * Fetch fatal crashes for a specific location (State/County) and year range.
     * @param {number} state - State FIPS code (e.g., 1 for AL, 6 for CA)
     * @param {number} county - County FIPS code
     * @param {number} year - Analysis year (e.g., 2021)
     */
    async getCrashes(state = 1, county = 1, year = 2021) {
        try {
            // Using the GetCrashesByLocation endpoint
            const params = new URLSearchParams({
                fromCaseYear: year,
                toCaseYear: year,
                state: state,
                county: county,
                format: 'json'
            });

            console.log(`[FARS] Fetching: ${BASE_URL}/crashes/GetCrashesByLocation?${params}`);
            const response = await fetch(`${BASE_URL}/crashes/GetCrashesByLocation?${params}`);

            if (!response.ok) {
                // If 404/500 (likely due to missing proxy on production), throw specific error
                throw new Error(response.status === 404 ? 'API Proxy Not Found (Dev Only)' : response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("[FARS] Service Failure:", error);
            // Fallback for demo/production where proxy isn't available
            if (error.message.includes('Proxy') || error.message.includes('Failed to fetch')) {
                console.warn("[FARS] Switching to Fallback Mock Data due to API unavailability.");
                return this.getMockRealData();
            }
            throw error;
        }
    },

    getMockRealData() {
        // Return a structure mimicking the API for demonstration on GH Pages
        return {
            Results: [[
                { ST_CASE: 1001, CASEYEAR: 2021, FATALS: 2, LATITUDE: 32.46, LONGITUD: -86.47 },
                { ST_CASE: 1002, CASEYEAR: 2021, FATALS: 1, LATITUDE: 32.48, LONGITUD: -86.49 },
                { ST_CASE: 1003, CASEYEAR: 2021, FATALS: 1, LATITUDE: 32.45, LONGITUD: -86.42 }
            ]]
        };
    },

    /**
     * Parse the raw FARS response into simplified app format
     */
    transformData(rawData) {
        if (!rawData || !rawData.Results || !rawData.Results[0]) return [];

        // The API returns a nested structure
        return rawData.Results[0].map(crash => ({
            id: crash.ST_CASE,
            year: crash.CASEYEAR,
            month: crash.MONTH,
            day: crash.DAY,
            hour: crash.HOUR,
            fatalities: crash.FATALS,
            drunkDrivers: crash.DRUNK_DR,
            lat: crash.LATITUDE,
            lng: crash.LONGITUD, // Note: typo in API field name often exists, or it's LONGITUDE
        }));
    }
};
