export const SKILLS = [
    "attack", "hitpoints", "mining", "strength", "agility", "smithing",
    "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
    "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
    "runecraft", "slayer", "farming", "construction", "hunter",
];

export const STARTING_LEVEL = 1;
export const HITPOINTS_STARTING_LEVEL = 10;
export const HITPOINTS_STARTING_XP = 1154;

export const RELIC_LIST = [
    ["Endless Harvest", "Barbarian Gathering", "Abundance"],
    ["Woodsman"],
    ["Evil Eye"],
    ["Conniving Clues"],
    ["Nature's Accord"],
    ["Culling Spree"],
    ["Minion", "Flask of Fervour"],
];

export const RELICS = {
    "endless_harvest": {
        name: "Endless Harvest",
        tier: 1
    },
    "barbarian_gathering": {
        name: "Barbarian Gathering",
        tier: 1
    },
    "abundance": {
        name: "Abundance",
        tier: 1
    }
};

export const RELIC_POINTS_TIER = [0, 750, 1500, 2500, 3500, 5000, 10000, 15000];

export const BASE_XP_MULTIPLIER = 5.0;

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
