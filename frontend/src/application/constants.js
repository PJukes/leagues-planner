export const SKILLS = [
    "attack", "hitpoints", "mining", "strength", "agility", "smithing",
    "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
    "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
    "runecraft", "slayer", "farming", "construction", "hunter",
];

export const STARTING_LEVEL = 1;
export const HITPOINTS_STARTING_LEVEL = 10;
export const HITPOINTS_STARTING_XP = 1154;

export const RELICS = {
    endless_harvest: { name: "Endless Harvest", tier: 1 },
    barbarian_gathering: { name: "Barbarian Gathering", tier: 1 },
    abundance: { name: "Abundance", tier: 1 },
    hotfoot: { name: "Hot Foot", tier: 2 },
    friendly_forager: { name: "Friendly Forager", tier: 2 },
    woodsman: { name: "Woodsman", tier: 2 }
};

export const RELIC_LIST = [
    [RELICS.endless_harvest.name, RELICS.barbarian_gathering.name, RELICS.abundance.name],
    [RELICS.hotfoot.name, RELICS.friendly_forager.name, RELICS.woodsman.name],
    ["Evil Eye", "", ""],
    ["Conniving Clues", "", ""],
    ["Nature's Accord", "", ""],
    ["Culling Spree", "", ""],
    ["Minion", "Flask of Fervour"],
];



export const RELIC_POINTS_TIER = [0, 750, 1500, 2500, 3500, 5000, 10000, 15000];

export const BASE_XP_MULTIPLIER = 5.0;

// Regions are areas of the game that unlock progressively as tasks are completed.
// tasks_required is the number of completed tasks needed to unlock the region.
// Regions with tasks_required: 0 are available from the start.
export const VARLAMORE = { key: "varlamore",  name: "Varlamore", tasks_required: 0,   color: "orange" };
export const MISTHALIN = { key: "misthalin",  name: "Misthalin", tasks_required: 0,   color: "yellow" };
export const KARAMJA = { key: "karamja",    name: "Karamja", tasks_required: 50,  color: "green"  };
export const ASGARNIA = { key: "asgarnia",   name: "Asgarnia", tasks_required: 100, color: "blue"   };
export const KANDARIN = { key: "kandarin",   name: "Kandarin", tasks_required: 150, color: "teal"   };
export const DESERT = { key: "desert",     name: "Desert", tasks_required: 175, color: "amber"  };
export const MORYTANIA = { key: "morytania",  name: "Morytania", tasks_required: 200, color: "purple" };
export const FREMENNIK = { key: "fremennik",  name: "Fremennik", tasks_required: 225, color: "indigo" };
export const TIRANNWN = { key: "tirannwn",   name: "Tirannwn", tasks_required: 250, color: "emerald"};
export const WILDERNESS = { key: "wilderness", name: "Wilderness", tasks_required: 275, color: "red"    };

export const REGIONS = {
    varlamore: VARLAMORE,
    misthalin: MISTHALIN,
    karamja: KARAMJA,
    asgarnia: ASGARNIA,
    kandarin: KANDARIN,
    desert: DESERT,
    morytania: MORYTANIA,
    fremennik: FREMENNIK,
    tirannwn: TIRANNWN,
    wilderness: WILDERNESS,
};

export const DEFAULT_LEAGUE_TIERS = [
    { pointsRequired: 500, xpMultiplier: 5.0 },
    { pointsRequired: 1800, xpMultiplier: 5.0 },
    { pointsRequired: 5000, xpMultiplier: 8.0 },
    { pointsRequired: 12000, xpMultiplier: 12.0 },
    { pointsRequired: 21000, xpMultiplier: 16.0 },
    { pointsRequired: 37000, xpMultiplier: 24.0 },
    { pointsRequired: 60000, xpMultiplier: 32.0 },
    { pointsRequired: 80000, xpMultiplier: 48.0 },
    { pointsRequired: 104000, xpMultiplier: 64.0 },
    { pointsRequired: 136000, xpMultiplier: 80.0 },
];
