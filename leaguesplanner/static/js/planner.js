/* ==========================================================================
   OSRS Leagues Planner – planner.js
   ========================================================================== */

"use strict";

// ---------------------------------------------------------------------------
// OSRS XP / level utilities
// ---------------------------------------------------------------------------

/** Pre-compute the XP required for each level 1-99 using the OSRS formula. */
const XP_TABLE = (() => {
  const table = [0]; // index 0 unused; index 1 = XP for level 1 = 0
  for (let lvl = 1; lvl <= 99; lvl++) {
    let total = 0;
    for (let i = 1; i < lvl; i++) {
      total += Math.floor(i + 300 * Math.pow(2, i / 7));
    }
    table[lvl] = Math.floor(total / 4);
  }
  return table;
})();

function levelForXp(xp) {
  for (let lvl = 99; lvl >= 1; lvl--) {
    if (xp >= XP_TABLE[lvl]) return lvl;
  }
  return 1;
}

function xpForLevel(lvl) {
  return XP_TABLE[Math.max(1, Math.min(99, lvl))];
}

const SKILLS = [
  "attack", "hitpoints", "mining", "strength", "agility", "smithing",
  "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
  "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
  "runecraft", "slayer", "farming", "construction", "hunter",
];

const SKILL_LABELS = {
  attack: "Attack", hitpoints: "Hitpoints", mining: "Mining",
  strength: "Strength", agility: "Agility", smithing: "Smithing",
  defence: "Defence", herblore: "Herblore", fishing: "Fishing",
  ranged: "Ranged", thieving: "Thieving", cooking: "Cooking",
  prayer: "Prayer", crafting: "Crafting", firemaking: "Firemaking",
  magic: "Magic", fletching: "Fletching", woodcutting: "Woodcutting",
  runecraft: "Runecraft", slayer: "Slayer", farming: "Farming",
  construction: "Construction", hunter: "Hunter",
};

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

  // layer.getTileUrl = function (coords) {
  //   const z = coords.z;
  //   const x = coords.x + TILE_X_OFFSET;  
  //   const MAX_Y_AT_Z0 = 100; // example, adjust to your tile set
  //   // flip Y
  //   const y = MAX_Y_AT_Z0 - coords.y;

  //   if (
  //     x < MIN_TILE_X || x > MAX_TILE_X ||
  //     y < MIN_TILE_Y || y > MAX_TILE_Y
  //   ) {
  //     return this.options.errorTileUrl;
  //   }

  //   return `https://maps.runescape.wiki/osrs/versions/2026-03-04_a/tiles/rendered/0/2/${z}_${x}_${y}.png`;
  // };

  layer.getTileUrl = function (coords) {
    const z = coords.z;
    const x = coords.x;
    const y = MAX_TILE_Y - coords.y;

    return `https://maps.runescape.wiki/osrs/versions/2026-03-04_a/tiles/rendered/0/2/${z}_${x}_${y}.png`;
  };

  activeTileLayer = layer;
  layer.addTo(osrsMap);
}

// function attachTileLayer(sourceIdx) {
//   if (sourceIdx >= OSRS_TILE_SOURCES.length) {
//     console.error("All OSRS tile sources failed.");
//     mapDebugState.lastErrorUrl = "all tile sources failed";
//     updateMapDebugPanel();
//     return;
//   }

//   const source = OSRS_TILE_SOURCES[sourceIdx];
//   activeTileSource = source;
//   mapDebugState = { loaded: 0, errors: 0, lastErrorUrl: "" };
//   updateMapDebugPanel();

//   const OsrsTileLayer = L.TileLayer.extend({
//     getTileUrl(coords) {
//       // adjust these rules to match the server
//       const z = Math.max(0, Math.min(2, coords.z));
//       const x = coords.x;
//       const y = coords.y; // or flip if needed
//       return `https://maps.runescape.wiki/osrs/tiles/0_2019-10-31_1/3/${z}_${x}_${y}.png`;
//     }
//   });

//   const layer = new OsrsTileLayer("", {
//     attribution: source.attribution,
//     tileSize: 256,
//     noWrap: true,
//   });

//   activeTileLayer = layer;
//   layer.addTo(osrsMap);

//   let switchedSource = false;
//   layer.on("tileload", () => {
//     mapDebugState.loaded += 1;
//     updateMapDebugPanel();
//   });

//   layer.on("tileerror", (evt) => {
//     console.log("tileerror url:", evt.tile?.src || evt.tile?.currentSrc);
//     console.log("tile coords:", evt.coords);
//   });

//   layer.on("tileloadstart", (evt) => {
//     console.log("tileloadstart url:", evt.tile?.src || evt.tile?.currentSrc);
//     console.log("tile coords:", evt.coords);
//   });

//   layer.on("tileload", (evt) => {
//     console.log("tileload url:", evt.tile?.src || evt.tile?.currentSrc);
//     console.log("tile coords:", evt.coords);
//   });

//   console.log(
//     activeTileLayer.getTileUrl({ z: 0, x: 100, y: 100 })
//   );

//   layer.on("tileerror", (evt) => {
//     mapDebugState.errors += 1;
//     mapDebugState.lastErrorUrl = evt?.tile?.currentSrc || source.url;
//     updateMapDebugPanel();
//     if (!switchedSource && mapDebugState.loaded === 0 && mapDebugState.errors >= 6) {
//       switchedSource = true;
//       console.warn(`Switching tile source after repeated failures: ${source.name}`);
//       osrsMap.removeLayer(layer);
//       attachTileLayer(sourceIdx + 1);
//     }
//   });
// }


// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const cfg = window.PLANNER_CONFIG;

async function apiFetch(url, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cfg.csrfToken,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    console.error("API error", res.status, text);
    return null;
  }
  if (res.status === 204) return {};
  return res.json();
}

// ---------------------------------------------------------------------------
// Computed state helpers
// ---------------------------------------------------------------------------

/**
 * Walk through all tasks in order and compute:
 *  - cumulative league points after each task
 *  - current XP multiplier at each task
 *  - skill XP totals at each task
 *  - which tiers become available (milestone notifications)
 *
 * Returns an array of state snapshots, one per task.
 */
function computeTaskStates() {
  let cumPoints = 0;
  let currentMult = plan.base_xp_multiplier;
  const skillXp = baseStats();
  const states = [];
  const tiersById = Object.fromEntries(plan.tiers.map(t => [t.id, t]));

  for (const task of plan.tasks) {
    // --- Apply task effects ---
    if (task.task_type === "league_task") {
      cumPoints += task.league_points;
    } else if (task.task_type === "generic_action") {
      if (task.skill) {
        const totalXp = task.base_xp_per_action * task.quantity * currentMult;
        skillXp[task.skill] = (skillXp[task.skill] || 0) + totalXp;
      }
    } else if (task.task_type === "tier_unlock") {
      if (task.tier_id && tiersById[task.tier_id]) {
        currentMult = tiersById[task.tier_id].xp_multiplier;
      }
    }

    // --- Check if this task tips us over a tier threshold ---
    // (only for league tasks – these are what accumulate points)
    let unlockedTier = null;
    if (task.task_type === "league_task") {
      for (const tier of plan.tiers) {
        const prevPoints = cumPoints - task.league_points;
        if (prevPoints < tier.points_required && cumPoints >= tier.points_required) {
          unlockedTier = tier;
        }
      }
    }

    states.push({
      taskId: task.id,
      cumPoints,
      multiplier: currentMult,
      skillXp: { ...skillXp },
      skillLevels: Object.fromEntries(
        SKILLS.map(sk => [sk, levelForXp(skillXp[sk] || 0)])
      ),
      unlockedTier,
    });
  }

  return states;
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
    <button type="button" data-map-action="add_action">Add Action</button>
    <button type="button" data-map-action="set_path">Set Path</button>
  `;
  container.appendChild(menu);
  mapContextMenuEl = menu;

  menu.addEventListener("click", e => {
    const btn = e.target.closest("button[data-map-action]");
    if (!btn) return;
    handleMapContextAction(btn.dataset.mapAction);
  });
}

function onMapContextMenu(e) {
  L.DomEvent.preventDefault(e.originalEvent);
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
  if (action === "complete_task") {
    window.dispatchEvent(new CustomEvent("add-task", {
      detail: { id: 123 }
    }));
  } else if (action === "add_action") {
    window.dispatchEvent(new CustomEvent("add-skill", {
      detail: { id: 123 }
    }));
  } else if (action === "set_path") {
    startPathDrawingMode();
  }
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

// ---------------------------------------------------------------------------
// Task Modal
// ---------------------------------------------------------------------------

function updateTaskTypeFields() {
  const type = document.querySelector('input[name="taskType"]:checked').value;
  document.getElementById("fields-league").style.display = (type === "league_task") ? "" : "none";
  document.getElementById("fields-action").style.display = (type === "generic_action") ? "" : "none";
  document.getElementById("fields-tier").style.display = (type === "tier_unlock") ? "" : "none";
}

function updateXpPreview() {
  const preview = document.getElementById("xp-preview");
  const type = document.querySelector('input[name="taskType"]:checked').value;
  if (type !== "generic_action") { preview.style.display = "none"; return; }

  const xp = parseFloat(document.getElementById("task-xp").value) || 0;
  const qty = parseInt(document.getElementById("task-qty").value) || 1;
  const states = computeTaskStates();
  const mult = states.length > 0 ? states[states.length - 1].multiplier : plan.base_xp_multiplier;
  const total = xp * qty * mult;
  const skill = document.getElementById("task-skill").value;
  if (skill) {
    preview.style.display = "";
    preview.textContent = `Total XP: ${fmtNum(total)} (${fmtNum(xp)} × ${qty} × ${mult}x multiplier)`;
  } else {
    preview.style.display = "none";
  }
}

async function saveTask() {
  const type = document.querySelector('input[name="taskType"]:checked').value;
  const name = document.getElementById("task-name").value.trim();
  if (!name) { alert("Please enter a task name."); return; }

  const mapX = document.getElementById("task-map-x").value;
  const mapY = document.getElementById("task-map-y").value;

  const body = {
    template_key: document.getElementById("task-template-select").value || null,
    task_type: type,
    name,
    notes: document.getElementById("task-notes").value.trim(),
    league_points: parseInt(document.getElementById("task-points").value) || 0,
    skill: document.getElementById("task-skill").value,
    base_xp_per_action: parseFloat(document.getElementById("task-xp").value) || 0,
    quantity: parseInt(document.getElementById("task-qty").value) || 1,
    tier_id: document.getElementById("task-tier-select").value || null,
    map_x: mapX !== "" ? parseInt(mapX) : null,
    map_y: mapY !== "" ? parseInt(mapY) : null,
    map_plane: 0,
  };

  let result;
  if (editingTaskId) {
    result = await apiFetch(`/planner/${plan.id}/tasks/${editingTaskId}/`, "PUT", body);
    if (result) {
      const idx = plan.tasks.findIndex(t => t.id === editingTaskId);
      if (idx !== -1) plan.tasks[idx] = { ...plan.tasks[idx], ...result };
    }
  } else {
    result = await apiFetch(cfg.createTaskUrl, "POST", body);
    if (result) plan.tasks.push(result);
  }

  if (!result) {
    alert("Could not save task. Please check required fields and try again.");
    return;
  }

  hideModal("taskModal");
  renderTaskList();
  checkMilestones();
}

async function deleteTask(taskId) {
  if (!confirm("Delete this task?")) return;
  await apiFetch(`/planner/${plan.id}/tasks/${taskId}/`, "DELETE");
  plan.tasks = plan.tasks.filter(t => t.id !== taskId);
  renderTaskList();
}

// ---------------------------------------------------------------------------
// Milestone notifications
// ---------------------------------------------------------------------------

let shownMilestones = new Set();

function checkMilestones() {
  const states = computeTaskStates();
  for (const state of states) {
    if (state.unlockedTier && !shownMilestones.has(state.unlockedTier.id)) {
      shownMilestones.add(state.unlockedTier.id);
      showMilestoneToast(state.unlockedTier, state.cumPoints);
    }
  }
}

function showMilestoneToast(tier, points) {
  const toast = document.getElementById("milestone-toast");
  toast.innerHTML = `
    <div style="font-size:.75rem;color:#e8b84b;font-weight:700;margin-bottom:.25rem">🏆 TIER MILESTONE</div>
    <div style="font-weight:700">${escHtml(tier.name)}</div>
    <div style="font-size:.8rem;margin-top:.2rem">${points.toLocaleString()} pts — now available to unlock!</div>
    <div style="font-size:.75rem;color:#aaa;margin-top:.15rem">New multiplier on unlock: ${tier.xp_multiplier}x</div>
  `;
  toast.style.display = "";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.display = "none"; }, 6000);
}

// ---------------------------------------------------------------------------
// Tier management
// ---------------------------------------------------------------------------

async function deleteTier(tierId) {
  if (!confirm("Delete this tier?")) return;
  await apiFetch(`/planner/${plan.id}/tiers/${tierId}/`, "DELETE");
  plan.tiers = plan.tiers.filter(t => t.id !== tierId);
  // Remove any references from tasks
  plan.tasks.forEach(t => { if (t.tier_id === tierId) t.tier_id = null; });
  renderTiersTable();
  renderTaskList();
}

// ---------------------------------------------------------------------------
// Drag-and-drop reorder
// ---------------------------------------------------------------------------

function initSortable() {
  Sortable.create(document.getElementById("task-list"), {
    animation: 150,
    ghostClass: "sortable-ghost",
    onEnd: async () => {
      const cards = document.querySelectorAll(".task-card");
      const newOrder = Array.from(cards).map(c => parseInt(c.dataset.id));

      // Reorder local state
      const taskMap = Object.fromEntries(plan.tasks.map(t => [t.id, t]));
      plan.tasks = newOrder.map((id, idx) => {
        const t = { ...taskMap[id], order: idx };
        return t;
      });

      renderTaskList();

      // Persist
      await apiFetch(cfg.reorderUrl, "POST", { order: newOrder });
    },
  });
}

// ---------------------------------------------------------------------------
// Stats modal
// ---------------------------------------------------------------------------

function openStatsModal(atTaskIndex = null) {
  const states = computeTaskStates();
  const state = atTaskIndex !== null ? states[atTaskIndex] : (states.length ? states[states.length - 1] : null);

  const title = atTaskIndex !== null
    ? `Stats after step ${atTaskIndex + 1}: ${escHtml(plan.tasks[atTaskIndex]?.name || "")}`
    : "Stats (end of plan)";
  document.getElementById("statsModalTitle").textContent = title;

  const grid = document.getElementById("stats-grid");
  if (!state) {
    grid.innerHTML = `<p class="text-muted">No tasks yet.</p>`;
  } else {
    const total = SKILLS.reduce((s, sk) => s + (state.skillLevels[sk] || 1), 0);
    grid.innerHTML = `
      <p class="mb-2"><strong>Total level:</strong> ${total} &nbsp;|&nbsp;
         <strong>League Points:</strong> ${state.cumPoints.toLocaleString()} &nbsp;|&nbsp;
         <strong>Multiplier:</strong> ${state.multiplier}x</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.4rem">
        ${SKILLS.map(sk => `
          <div style="background:#f8f9fa;border:1px solid #dee2e6;border-radius:6px;padding:.35rem .6rem;display:flex;justify-content:space-between">
            <span style="font-size:.8rem">${SKILL_LABELS[sk]}</span>
            <strong style="color:#1a1a2e;font-size:.85rem">${state.skillLevels[sk] || 1}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  showModal("statsModal");
}

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------

async function loadPlanData() {
  const data = await apiFetch(cfg.dataUrl);
  if (!data) return;
  plan.name = data.name;
  plan.base_xp_multiplier = data.base_xp_multiplier;
  plan.tiers = data.tiers;
  plan.tasks = data.tasks;
}

async function loadTaskLibrary() {
  const data = await apiFetch(cfg.taskLibraryUrl);
  if (!data || !Array.isArray(data.tasks)) return;
  taskLibrary = data.tasks;
  const sel = document.getElementById("task-template-select");
  sel.innerHTML = `<option value="">— start from scratch —</option>`;
  taskLibrary.forEach(task => {
    const opt = document.createElement("option");
    opt.value = task.key;
    opt.textContent = `${task.name} (${task.task_type.replace("_", " ")})`;
    sel.appendChild(opt);
  });
}

function applyTaskTemplate(templateKey) {
  if (!templateKey) return;
  const template = taskLibrary.find(item => item.key === templateKey);
  if (!template) return;

  const taskTypeRadio = document.querySelector(`input[name="taskType"][value="${template.task_type}"]`);
  if (taskTypeRadio) taskTypeRadio.checked = true;
  document.getElementById("task-name").value = template.name || "";
  document.getElementById("task-points").value = template.league_points || 0;
  document.getElementById("task-skill").value = template.skill || "";
  document.getElementById("task-xp").value = template.base_xp_per_action || 0;
  document.getElementById("task-qty").value = template.quantity || 1;
  document.getElementById("task-notes").value = template.notes || "";
  document.getElementById("task-map-x").value = template.map_x ?? "";
  document.getElementById("task-map-y").value = template.map_y ?? "";
  updateTaskTypeFields();
  updateXpPreview();
}

function renderTaskLibraryList(filterText = "") {
  const list = document.getElementById("task-template-list");
  const count = document.getElementById("task-template-count");
  if (!list) return;

  const filter = filterText.trim().toLowerCase();
  const items = taskLibrary.filter(item => !filter || item.name.toLowerCase().includes(filter));

  list.innerHTML = "";
  if (items.length === 0) {
    list.innerHTML = `<div class="list-group-item text-muted">No templates match your search.</div>`;
  } else {
    items.forEach(item => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
      btn.dataset.templateKey = item.key;
      btn.innerHTML = `
        <span>${escHtml(item.name)}</span>
        <span class="badge text-bg-light">${escHtml(item.task_type.replace("_", " "))}</span>
      `;
      btn.addEventListener("click", () => {
        document.getElementById("task-template-select").value = item.key;
        applyTaskTemplate(item.key);
      });
      list.appendChild(btn);
    });
  }

  if (count) count.textContent = `${items.length} of ${taskLibrary.length} templates shown. Click one to prefill the task form.`;
}

document.addEventListener("DOMContentLoaded", async () => {
  initMap();
});
