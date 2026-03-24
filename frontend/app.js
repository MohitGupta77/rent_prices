/**
 * app.js — US Choropleth Map (Dev Scaffold)
 *
 * Current state:  Renders all 50 US states with red fill + thick dark border.
 * Next steps:     Replace `getColorForState()` with real data from your database
 *                 and wire up `fetchStateData()` to your API endpoint.
 */
 
// ─────────────────────────────────────────────
//  MAP INIT
// ─────────────────────────────────────────────
 
const map = L.map('map', {
  center: [38.5, -96.5],   // Centered on CONUS
  zoom: 4,
  minZoom: 3,
  maxZoom: 10,
  zoomControl: true,
});
 
// Minimal dark tile layer (no clutter, lets states stand out)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20,
}).addTo(map);
 
 
// ─────────────────────────────────────────────
//  DATABASE HOOK  ← wire this up later
// ─────────────────────────────────────────────
 
/**
 * fetchStateData()
 *
 * TODO: Replace this stub with a real API/DB call, e.g.:
 *   const res = await fetch('/api/states');
 *   return res.json();   // expects [{ fips: "01", name: "Alabama", value: 42 }, ...]
 *
 * Returns a Map keyed by state FIPS code → { name, value }
 */
async function fetchStateData() {
  // ── STUB: returns uniform placeholder data ──────────────────────────────
  const placeholderStates = [
    "01","02","04","05","06","08","09","10","12","13",
    "15","16","17","18","19","20","21","22","23","24",
    "25","26","27","28","29","30","31","32","33","34",
    "35","36","37","38","39","40","41","42","44","45",
    "46","47","48","49","50","51","53","54","55","56",
  ];
 
  const dataMap = new Map();
  placeholderStates.forEach(fips => {
    dataMap.set(fips, { value: null }); // null → dev placeholder
  });
  return dataMap;
  // ────────────────────────────────────────────────────────────────────────
}
 
/**
 * getColorForState(value)
 *
 * TODO: Replace with your real color scale once data is live.
 *       e.g. a D3 quantile scale, manual thresholds, etc.
 *
 * For dev: returns a solid red.
 */
function getColorForState(value) {
  if (value === null) return '#c0392b';   // dev placeholder — all red
 
  // Example threshold scale (uncomment & adjust when you have real data):
  // return value > 80 ? '#7f0000'
  //      : value > 60 ? '#b91c1c'
  //      : value > 40 ? '#dc2626'
  //      : value > 20 ? '#ef4444'
  //      :               '#fca5a5';
}
 
 
// ─────────────────────────────────────────────
//  STYLE & INTERACTION
// ─────────────────────────────────────────────
 
function styleFeature(feature, dataMap) {
  const fips  = feature.properties.STATE;
  const entry = dataMap ? dataMap.get(fips) : null;
  const value = entry ? entry.value : null;
 
  return {
    fillColor:   getColorForState(value),
    fillOpacity: 0.75,
    color:       '#1a1a2e',   // thick dark border
    weight:      2.5,
    opacity:     1,
  };
}
 
function onEachFeature(feature, layer) {
  const name = feature.properties.NAME || 'State';
 
  // Hover highlight
  layer.on({
    mouseover(e) {
      e.target.setStyle({
        fillOpacity: 0.95,
        weight: 4,
        color: '#ffffff',
      });
      e.target.bringToFront();
      updateInfo(feature.properties);
    },
    mouseout(e) {
      geojsonLayer.resetStyle(e.target);
      updateInfo(null);
    },
    click(e) {
      map.fitBounds(e.target.getBounds(), { padding: [40, 40] });
    },
  });
 
  layer.bindTooltip(name, {
    direction: 'center',
    className: 'state-tooltip',
    permanent: false,
  });
}
 
 
// ─────────────────────────────────────────────
//  INFO PANEL
// ─────────────────────────────────────────────
 
const info = L.control({ position: 'topright' });
 
info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info-panel');
  this.update(null);
  return this._div;
};
 
info.update = function (props) {
  this._div.innerHTML = props
    ? `<strong>${props.NAME}</strong><br><span class="info-value">No data yet</span>`
    : '<span class="info-hint">Hover over a state</span>';
};
 
info.addTo(map);
 
function updateInfo(props) { info.update(props); }
 
// Inject info panel + tooltip styles dynamically
const style = document.createElement('style');
style.textContent = `
  .info-panel {
    background: rgba(13, 17, 23, 0.92);
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 10px 14px;
    font-family: 'Georgia', serif;
    font-size: 0.85rem;
    color: #e6edf3;
    min-width: 160px;
    pointer-events: none;
  }
  .info-panel strong { font-size: 0.95rem; display: block; margin-bottom: 4px; }
  .info-value { color: #f87171; font-style: italic; }
  .info-hint  { color: #8b949e; font-style: italic; }
 
  .state-tooltip {
    background: rgba(13,17,23,0.9);
    border: 1px solid #30363d;
    color: #f0f6fc;
    font-family: 'Georgia', serif;
    font-size: 0.78rem;
    padding: 3px 8px;
    border-radius: 4px;
    box-shadow: none;
  }
  .state-tooltip::before { display: none; }
`;
document.head.appendChild(style);
 
 
// ─────────────────────────────────────────────
//  GEOJSON LOAD + RENDER
// ─────────────────────────────────────────────
 
let geojsonLayer;
 
async function initMap() {
  // 1. Fetch state boundary GeoJSON (US Census simplified)
  const geoRes = await fetch(
    'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json'
  );
  const geoData = await geoRes.json();
 
  // 2. Fetch your state data (swap stub for real DB call when ready)
  const dataMap = await fetchStateData();
 
  // 3. Render
  geojsonLayer = L.geoJSON(geoData, {
    style: feature => styleFeature(feature, dataMap),
    onEachFeature,
  }).addTo(map);
 
  // Fit to continental US
  map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20] });
 
  console.log('[choropleth] Map ready. States rendered:', geoData.features.length);
  console.log('[choropleth] To add data: update fetchStateData() and getColorForState().');
}
 
initMap().catch(err => {
  console.error('[choropleth] Failed to initialize map:', err);
});