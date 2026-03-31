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

  // OSRS map tiles from the Jagex CDN.
  // The tile URL uses standard XYZ scheme; 'tms: false' keeps y=0 at north.
  // Each tile covers 64 game tiles at the base resolution.
  // Note: if tiles don't load the map is still fully interactive.
  L.tileLayer("https://maps.runescape.com/osrs/tiles/{z}/{x}_{y}.png", {
    attribution: "&copy; Jagex Ltd",
    tileSize: 256,
    noWrap: true,
    tms: false,
    errorTileUrl: "", // silently fail missing tiles
  }).addTo(osrsMap);

  // Configurable default view.
  osrsMap.setView([cfg.mapStartY, cfg.mapStartX], cfg.mapStartZoom);
  osrsMap.setMaxBounds([[-128, -128], [16384, 16384]]);
  window.addEventListener("resize", () => osrsMap.invalidateSize());

  // Allow clicking the map to place / pick coordinates
  osrsMap.on("click", onMapClick);
}

function onMapClick(e) {
  const osrsX = Math.round(e.latlng.lng);
  const osrsY = Math.round(e.latlng.lat);

  if (uiStore()?.pickingMapCoord) {
    // Fill in the task modal coordinate inputs
    document.getElementById("task-map-x").value = osrsX;
    document.getElementById("task-map-y").value = osrsY;
    uiStore().stopMapPicking();
    document.getElementById("btn-pick-map").textContent = "Pick on map";
    osrsMap.getContainer().style.cursor = "";
    return;
  }
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
      const marker = L.marker([task.map_y, task.map_x], {
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
