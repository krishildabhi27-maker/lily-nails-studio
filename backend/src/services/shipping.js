// Server-authoritative shipping — mirror of the frontend app/india.jsx brackets.
// This is the ONLY place shipping is trusted; the client value is ignored.
// Keep in sync with the frontend config if you change brackets.

export const SHIPPING = {
  origin: { lat: 23.0225, lng: 72.5714 }, // Ahmedabad fulfillment
  freeState: "Gujarat",
  freeCity: "Ahmedabad",
  detour: 1.25, // straight-line → road distance factor
  brackets: [
    { maxKm: 25, fee: 0 },
    { maxKm: 75, fee: 40 },
    { maxKm: 150, fee: 70 },
    { maxKm: 300, fee: 100 },
    { maxKm: 500, fee: 140 },
    { maxKm: 800, fee: 180 },
    { maxKm: 1200, fee: 220 },
    { maxKm: 1600, fee: 260 },
    { maxKm: Infinity, fee: 300 }, // cap
  ],
};

// Approx coordinates (state centroids + major-city overrides). Extend as needed.
export const GEO = {
  states: {
    "Andhra Pradesh": { lat: 15.91, lng: 79.74 }, "Arunachal Pradesh": { lat: 28.22, lng: 94.73 },
    "Assam": { lat: 26.20, lng: 92.94 }, "Bihar": { lat: 25.10, lng: 85.31 },
    "Chhattisgarh": { lat: 21.28, lng: 81.87 }, "Goa": { lat: 15.30, lng: 74.12 },
    "Gujarat": { lat: 22.26, lng: 71.19 }, "Haryana": { lat: 29.06, lng: 76.09 },
    "Himachal Pradesh": { lat: 31.10, lng: 77.17 }, "Jharkhand": { lat: 23.61, lng: 85.28 },
    "Karnataka": { lat: 15.32, lng: 75.71 }, "Kerala": { lat: 10.85, lng: 76.27 },
    "Madhya Pradesh": { lat: 22.97, lng: 78.66 }, "Maharashtra": { lat: 19.75, lng: 75.71 },
    "Manipur": { lat: 24.66, lng: 93.91 }, "Meghalaya": { lat: 25.47, lng: 91.37 },
    "Mizoram": { lat: 23.16, lng: 92.94 }, "Nagaland": { lat: 26.16, lng: 94.56 },
    "Odisha": { lat: 20.95, lng: 85.10 }, "Punjab": { lat: 31.15, lng: 75.34 },
    "Rajasthan": { lat: 27.02, lng: 74.22 }, "Sikkim": { lat: 27.53, lng: 88.51 },
    "Tamil Nadu": { lat: 11.13, lng: 78.66 }, "Telangana": { lat: 18.11, lng: 79.02 },
    "Tripura": { lat: 23.94, lng: 91.99 }, "Uttar Pradesh": { lat: 26.85, lng: 80.95 },
    "Uttarakhand": { lat: 30.07, lng: 79.02 }, "West Bengal": { lat: 22.99, lng: 87.85 },
    "Andaman & Nicobar Islands": { lat: 11.74, lng: 92.66 }, "Chandigarh": { lat: 30.73, lng: 76.78 },
    "Dadra & Nagar Haveli and Daman & Diu": { lat: 20.27, lng: 73.02 }, "Delhi": { lat: 28.61, lng: 77.21 },
    "Jammu & Kashmir": { lat: 33.78, lng: 76.58 }, "Ladakh": { lat: 34.15, lng: 77.58 },
    "Lakshadweep": { lat: 10.57, lng: 72.64 }, "Puducherry": { lat: 11.94, lng: 79.81 },
  },
  cities: {
    "Surat": { lat: 21.17, lng: 72.83 }, "Vadodara": { lat: 22.31, lng: 73.18 }, "Rajkot": { lat: 22.30, lng: 70.80 },
    "Gandhinagar": { lat: 23.22, lng: 72.65 }, "Bhavnagar": { lat: 21.76, lng: 72.15 }, "Jamnagar": { lat: 22.47, lng: 70.06 },
    "Mumbai": { lat: 19.08, lng: 72.88 }, "Pune": { lat: 18.52, lng: 73.86 }, "Nagpur": { lat: 21.15, lng: 79.09 },
    "Nashik": { lat: 20.00, lng: 73.79 }, "Delhi": { lat: 28.61, lng: 77.21 }, "New Delhi": { lat: 28.61, lng: 77.21 },
    "Noida": { lat: 28.54, lng: 77.39 }, "Gurugram": { lat: 28.46, lng: 77.03 }, "Jaipur": { lat: 26.91, lng: 75.79 },
    "Jodhpur": { lat: 26.24, lng: 73.02 }, "Udaipur": { lat: 24.58, lng: 73.71 }, "Bengaluru": { lat: 12.97, lng: 77.59 },
    "Hyderabad": { lat: 17.39, lng: 78.49 }, "Chennai": { lat: 13.08, lng: 80.27 }, "Kolkata": { lat: 22.57, lng: 88.36 },
    "Indore": { lat: 22.72, lng: 75.86 }, "Bhopal": { lat: 23.26, lng: 77.41 }, "Kochi": { lat: 9.93, lng: 76.27 },
    "Lucknow": { lat: 26.85, lng: 80.95 }, "Ahmedabad": { lat: 23.02, lng: 72.57 },
  },
};

function geoFor(state, city) {
  return GEO.cities[city] || GEO.states[state] || SHIPPING.origin;
}

export function distanceKm(state, city) {
  const o = SHIPPING.origin, p = geoFor(state, city);
  const R = 6371, toR = d => (d * Math.PI) / 180;
  const dLat = toR(p.lat - o.lat), dLng = toR(p.lng - o.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toR(o.lat)) * Math.cos(toR(p.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a)) * SHIPPING.detour;
}

export function shipFor(state, city) {
  if (state === SHIPPING.freeState && city === SHIPPING.freeCity) return { fee: 0, km: 0 };
  const km = distanceKm(state, city);
  const b = SHIPPING.brackets.find(b => km <= b.maxKm) || SHIPPING.brackets[SHIPPING.brackets.length - 1];
  return { fee: b.fee, km: Math.round(km) };
}
