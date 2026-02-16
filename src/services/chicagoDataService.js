/**
 * Service to interact with Chicago Data Portal (Socrata API)
 * Base URL: https://data.cityofchicago.org/resource/
 */

const DATASETS = {
    CRASHES: '85ca-t3if.json',
    PEOPLE: 'u6pd-qa9d.json',
    VEHICLES: '68nd-jvt3.json',
    STREETS: '6imu-meau.json', // Street Center Lines
    BIKE_ROUTES: '3w5d-sru8.json'
};

const BASE_URL = 'https://data.cityofchicago.org/resource/';

/**
 * Fetch crashes with optional filters
 * @param {Object} params - Query parameters (limit, where clause, etc.)
 * @returns {Promise<Array>} Array of crash records
 */
export const fetchCrashes = async (limit = 1000, where = "crash_date > '2023-01-01'") => {
    try {
        const query = new URLSearchParams({
            "$limit": limit,
            "$where": where,
            "$order": "crash_date DESC"
        });

        // Remove token if it causes issues or isn't provided
        if (!query.get("$$app_token")) query.delete("$$app_token");

        const response = await fetch(`${BASE_URL}${DATASETS.CRASHES}?${query.toString()}`);
        if (!response.ok) throw new Error(`Chicago Data Portal Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch crashes:", error);
        throw error;
    }
};

/**
 * Fetch Street Centerlines (Roadway Inventory)
 * @param {number} limit 
 */
export const fetchStreets = async (limit = 500) => {
    try {
        const query = new URLSearchParams({
            "$limit": limit,
            "$where": "street_type != 'RAMP' AND street_type != 'ALLEY'" // Filter out minor links
        });

        const response = await fetch(`${BASE_URL}${DATASETS.STREETS}?${query.toString()}`);
        if (!response.ok) throw new Error(`Chicago Data Portal Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch streets:", error);
        return [];
    }
};


/**
 * Aggregate crashes by Street Name to simulate "Sites" for Network Screening
 * Aggregates the raw crash list into site objects.
 */
export const aggregateCrashesByStreet = (crashData) => {
    const streets = {};

    crashData.forEach(crash => {
        const street = crash.street_name;
        if (!street) return;

        // Parse coordinates
        const lat = parseFloat(crash.latitude);
        const lng = parseFloat(crash.longitude);
        const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

        // Parse Address
        const houseNo = parseInt(crash.street_no || 0);
        const direction = crash.street_direction || '';

        if (!streets[street]) {
            streets[street] = {
                id: street,
                name: street,
                direction: direction,
                crashes: 0,
                fatalities: 0,
                injuries: 0,
                severity: { k: 0, a: 0, b: 0 },
                types: {},
                // Centroid Calc
                latSum: 0,
                lngSum: 0,
                coordCount: 0,
                // Range Calc
                minAddr: hasCoords ? houseNo : 999999,
                maxAddr: hasCoords ? houseNo : 0
            };
        }

        const s = streets[street];
        s.crashes += 1;

        if (hasCoords) {
            s.latSum += lat;
            s.lngSum += lng;
            s.coordCount += 1;
            if (houseNo > 0) {
                if (houseNo < s.minAddr) s.minAddr = houseNo;
                if (houseNo > s.maxAddr) s.maxAddr = houseNo;
            }
        }

        // Simple Severity Logic based on "injuries_fatal" column
        if (parseInt(crash.injuries_fatal) > 0) {
            s.fatalities += parseInt(crash.injuries_fatal);
            s.severity.k += 1;
        } else if (parseInt(crash.injuries_incapacitating) > 0) {
            s.injuries += parseInt(crash.injuries_incapacitating);
            s.severity.a += 1;
        } else {
            s.severity.b += 1;
        }

        // Crash Type
        const type = crash.first_crash_type || 'UNKNOWN';
        s.types[type] = (s.types[type] || 0) + 1;
    });

    // Convert to array and sort by crash count
    return Object.values(streets)
        .filter(s => s.coordCount > 0) // Ensure at least one valid coordinate
        .map(s => ({
            ...s,
            // Calculate Centroids
            lat: s.latSum / s.coordCount,
            lng: s.lngSum / s.coordCount,
            // Format Name with Range
            displayName: `${s.direction} ${s.name} (${s.minAddr}-${s.maxAddr})`.trim(),
            rank: 0,
            excess: parseFloat((s.crashes * 0.15).toFixed(2))
        }))
        .sort((a, b) => b.crashes - a.crashes)
        .slice(0, 50)
        .map((s, i) => ({ ...s, rank: i + 1 }));
};
