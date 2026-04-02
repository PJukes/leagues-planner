/* ==========================================================================
   OSRS Leagues Planner – planner.js
   ========================================================================== */

"use strict";

const cfg = window.PLANNER_CONFIG;

/** Starting XP (level 1 for all except Hitpoints which starts at level 10). */
function baseStats() {
  const s = {};
  SKILLS.forEach(sk => { s[sk] = 0; });
  s.hitpoints = xpForLevel(10); // OSRS starts at 10 hp
  return s;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let plan = {
  id: window.PLANNER_CONFIG.planId,
  name: window.PLANNER_CONFIG.planName,
  base_xp_multiplier: window.PLANNER_CONFIG.baseMultiplier,
  tiers: [],
  tasks: [],
};

let taskLibrary = [];
let editingTaskId = null;  // null = creating new
let pickingMapCoord = false;
let osrsMap = null;
const markers = {}; // taskId → L.marker
const openModalIds = [];
let activeTileLayer = null;
let activeTileSource = null;
let mapDebugState = {
  loaded: 0,
  errors: 0,
  lastErrorUrl: "",
};
let mapContextMenuEl = null;
let pathDrawingEnabled = false;
let pathDraftPoints = [];
let pathDraftPolyline = null;
const pathCommittedPolylines = [];

const TILE_X_OFFSET = 100;
const TILE_Y_OFFSET = 100;

const MIN_TILE_X = 0;
const MIN_TILE_Y = 0;
const MAX_TILE_X = 66; // example
const MAX_TILE_Y = 96; // example

const REGION_SIZE = 64;
const RENDER_TILE_SIZE = 256;
const MAP_UNITS_PER_GAME_TILE = RENDER_TILE_SIZE / REGION_SIZE; // 4

function gameToMapLatLng(gameX, gameY) {
  const serverTileX = Math.floor(gameX / REGION_SIZE);
  const serverTileY = Math.floor(gameY / REGION_SIZE);

  const localX = gameX % REGION_SIZE;
  const localY = gameY % REGION_SIZE;

  const lng =
    serverTileX * RENDER_TILE_SIZE +
    (localX + 0.5) * MAP_UNITS_PER_GAME_TILE;

  const lat =
    -(
      serverTileY * RENDER_TILE_SIZE +
      (REGION_SIZE - 1 - localY + 0.5) * MAP_UNITS_PER_GAME_TILE
    );

  return [lat, lng];
}

function mapLatLngToGame(latlng) {
  return {
    x: Math.round(latlng.lng / MAP_UNITS_PER_GAME_TILE),
    y: Math.round(latlng.lat / MAP_UNITS_PER_GAME_TILE),
  };
}

const OSRS_TILE_SOURCES = [
  {
    name: "RuneScape Wiki tiles",
    url: "https://maps.runescape.wiki/osrs/versions/2026-03-04_a/tiles/rendered/0/2/{z}_{x}_{y}.png",
    attribution: '&copy; <a href="https://www.jagex.com/">Jagex</a> / <a href="https://runescape.wiki/">RuneScape Wiki</a>',
  },
];

function updateMapDebugPanel() {
  const panel = document.getElementById("map-debug-info");
  if (!panel) return;
  const sourceLabel = activeTileSource ? activeTileSource.name : "none";
  const lastErr = mapDebugState.lastErrorUrl ? ` · last error: ${mapDebugState.lastErrorUrl}` : "";
  panel.textContent = `tiles source: ${sourceLabel} · loaded: ${mapDebugState.loaded} · errors: ${mapDebugState.errors}${lastErr}`;
}

function ensureMapDebugPanel() {
  const mapContainer = osrsMap.getContainer();
  if (!mapContainer || document.getElementById("map-debug-info")) return;
  const panel = document.createElement("div");
  panel.id = "map-debug-info";
  panel.style.cssText = "position:absolute;left:10px;bottom:10px;z-index:500;background:rgba(0,0,0,.7);color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;max-width:90%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
  mapContainer.appendChild(panel);
}

function attachTileLayer(sourceIdx) {
  const source = OSRS_TILE_SOURCES[sourceIdx];

  const layer = L.tileLayer("", {
    attribution: source.attribution,
    tileSize: 256,
    noWrap: true,
    tms: false,
    errorTileUrl:
      "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
  });

  layer.getTileUrl = function (coords) {
    const z = coords.z;
    const x = coords.x;
    const y = MAX_TILE_Y - coords.y;

    return `https://maps.runescape.wiki/osrs/versions/2026-03-04_a/tiles/rendered/0/2/${z}_${x}_${y}.png`;
  };

  activeTileLayer = layer;
  layer.addTo(osrsMap);
}


// ---------------------------------------------------------------------------
// Map initialisation
// ---------------------------------------------------------------------------

function initMap() {
  // OSRS uses game tile coordinates: x increases east, y increases north.
  // Leaflet CRS.Simple treats lat=y (north), lng=x (east) which matches perfectly.
  osrsMap = L.map("osrs-map", {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 2,
    zoomSnap: 0.5,
    zoomControl: true,
  });

  // OSRS map tiles.
  // Try multiple RuneScape tile API sources so users can still render the map
  // if one provider is blocked or unavailable from their network.
  ensureMapDebugPanel();
  attachTileLayer(0);

  // Configurable default view.
  osrsMap.setView(gameToMapLatLng(1680, 3107), Math.max(0, cfg.mapStartZoom));
  const south = -((MAX_TILE_Y + 1) * RENDER_TILE_SIZE);
  const north = -(MIN_TILE_Y * RENDER_TILE_SIZE);
  const west  = MIN_TILE_X * RENDER_TILE_SIZE;
  const east  = (MAX_TILE_X + 1) * RENDER_TILE_SIZE;

  const mapBounds = [[south, west], [north, east]];
  osrsMap.setMaxBounds(mapBounds);
  window.addEventListener("resize", () => osrsMap.invalidateSize());

  // Allow clicking the map to place / pick coordinates
  osrsMap.on("click", onMapClick);
  osrsMap.on("contextmenu", onMapContextMenu);
  osrsMap.on("movestart", hideMapContextMenu);
  osrsMap.on("zoomstart", hideMapContextMenu);
  osrsMap.on("dblclick", () => finishPathDrawingMode());
  initMapContextMenu();
}

function onMapClick(e) {
  const { x: osrsX, y: osrsY } = mapLatLngToGame(e.latlng);
  hideMapContextMenu();

  if (pickingMapCoord) {
    // Fill in the task modal coordinate inputs
    document.getElementById("task-map-x").value = osrsX;
    document.getElementById("task-map-y").value = osrsY;
    pickingMapCoord = false;
    document.getElementById("btn-pick-map").textContent = "Pick on map";
    osrsMap.getContainer().style.cursor = "";
    return;
  }

  if (pathDrawingEnabled) {
    pathDraftPoints.push(e.latlng);
    if (!pathDraftPolyline) {
      pathDraftPolyline = L.polyline(pathDraftPoints, {
        color: "#00d4ff",
        weight: 3,
        opacity: 0.95,
      }).addTo(osrsMap);
    } else {
      pathDraftPolyline.setLatLngs(pathDraftPoints);
    }
  }
}

function initMapContextMenu() {
  const container = osrsMap.getContainer();
  if (!container) return;
  if (mapContextMenuEl) return;

  const menu = document.createElement("div");
  menu.id = "map-context-menu";
  menu.className = "map-context-menu";
  menu.style.display = "none";
  menu.innerHTML = `
    <button type="button" data-map-action="complete_task">Complete Task</button>
    <button type="button" data-map-action="add_action">Add Actions</button>
    <button type="button" data-map-action="add_action">Buy Items</button>
    <button type="button" data-map-action="set_path">Set Destination</button>
  `;
  container.appendChild(menu);
  mapContextMenuEl = menu;

  menu.addEventListener("click", e => {
    const btn = e.target.closest("button[data-map-action]");
    if (!btn) return;
    handleMapContextAction(btn.dataset.mapAction);
  });
}

let lastClickEvent = null;
let lastPoint = null;

function onMapContextMenu(e) {
  L.DomEvent.preventDefault(e.originalEvent);
  lastClickEvent = e; // Store the click event
  const point = osrsMap.latLngToContainerPoint(e.latlng);
  showMapContextMenu(point.x, point.y);
}

function showMapContextMenu(x, y) {
  if (!mapContextMenuEl) return;
  const container = osrsMap.getContainer();
  const menuWidth = 180;
  const menuHeight = 120;
  const clampedX = Math.max(8, Math.min(x, container.clientWidth - menuWidth));
  const clampedY = Math.max(8, Math.min(y, container.clientHeight - menuHeight));
  mapContextMenuEl.style.left = `${clampedX}px`;
  mapContextMenuEl.style.top = `${clampedY}px`;
  mapContextMenuEl.style.display = "block";
}

function hideMapContextMenu() {
  if (!mapContextMenuEl) return;
  mapContextMenuEl.style.display = "none";
}

function handleMapContextAction(action) {
  hideMapContextMenu();

  // console.log("Last click event:", lastClickEvent);
  // if (!lastClickEvent) return;

  // const { x: osrsX, y: osrsY } = mapLatLngToGame(lastClickEvent.latlng);
  let marker = null;
  console.log("Handling action", action)
  if (action === "complete_task") {
    window.dispatchEvent(new CustomEvent("add-task", {detail: { id: 123 }}));
    // Add a marker for completed task
    marker = L.marker(lastClickEvent.latlng, {
      icon: taskMarkerIcon("league_task"),
      title: "Completed Task"
    });
    marker.bindPopup(`
      <div class="task-popup">
        <strong>Completed Task</strong>
        <span style="color:#666;font-size:.72rem">league task</span>
      </div>
    `);
  } else if (action === "add_action") {
    window.dispatchEvent(new CustomEvent("add-skill", {detail: { id: 123 }}));
    // Add a marker for generic action
    marker = L.marker(lastClickEvent.latlng, {
      icon: taskMarkerIcon("generic_action"),
      title: "Skilling Action"
    });
    marker.bindPopup(`
      <div class="task-popup">
        <strong>Skilling Action</strong>
        <span style="color:#666;font-size:.72rem">generic action</span>
      </div>
    `);
  } else if (action === "set_path") {
    window.dispatchEvent(new CustomEvent("add-destination", {detail: { id: 123 }}));
    // Add a marker for destination
    marker = L.marker(lastClickEvent.latlng, {
      icon: taskMarkerIcon("note"),
      title: "Destination"
    });
    marker.bindPopup(`
      <div class="task-popup">
        <strong>Destination</strong>
        <span style="color:#666;font-size:.72rem">note</span>
      </div>
    `);
  }
  marker.addTo(osrsMap);
  if (lastPoint !== null) {
    // Draw a line from the last point to the new point
    const latlngs = [lastPoint, marker.getLatLng()];
    const polyline = L.polyline(latlngs, { color: 'orange', weight: 2 });
    polyline.addTo(osrsMap);
  }
  lastPoint = marker.getLatLng();
}

function startPathDrawingMode() {
  pathDrawingEnabled = true;
  pathDraftPoints = [];
  if (pathDraftPolyline) {
    osrsMap.removeLayer(pathDraftPolyline);
    pathDraftPolyline = null;
  }
  osrsMap.getContainer().style.cursor = "crosshair";
}

function finishPathDrawingMode() {
  if (!pathDrawingEnabled) return;
  pathDrawingEnabled = false;
  if (pathDraftPoints.length >= 2 && pathDraftPolyline) {
    pathCommittedPolylines.push(pathDraftPolyline);
    pathDraftPolyline = null;
  } else if (pathDraftPolyline) {
    osrsMap.removeLayer(pathDraftPolyline);
    pathDraftPolyline = null;
  }
  pathDraftPoints = [];
  osrsMap.getContainer().style.cursor = pickingMapCoord ? "crosshair" : "";
}

function taskMarkerIcon(taskType) {
  const colors = {
    league_task: "#e8b84b",
    generic_action: "#4caf50",
    tier_unlock: "#9c27b0",
    note: "#2196f3",
  };
  const color = colors[taskType] || "#aaa";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:12px;height:12px;border-radius:50%;
      background:${color};border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,.5)
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function refreshMarkers() {
  // Remove old markers
  Object.values(markers).forEach(m => osrsMap.removeLayer(m));
  Object.keys(markers).forEach(k => delete markers[k]);

  for (const task of plan.tasks) {
    if (task.map_x != null && task.map_y != null) {
      const marker = L.marker(gameToMapLatLng(task.map_x, task.map_y), {
        icon: taskMarkerIcon(task.task_type),
        title: task.name,
      });
      marker.bindPopup(`
        <div class="task-popup">
          <strong>${escHtml(task.name)}</strong>
          <span style="color:#666;font-size:.72rem">${escHtml(task.task_type.replace("_", " "))}</span>
        </div>
      `);
      marker.addTo(osrsMap);
      markers[task.id] = marker;
    }
  }
}

// Initialise
document.addEventListener("DOMContentLoaded", async () => {
  initMap();
});
