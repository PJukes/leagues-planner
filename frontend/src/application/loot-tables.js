// Loot tables for skill actions with complex or extensive drop pools.
// Used when the full set of possible drops is too large to inline on a skill method.
//
// Each drop entry mirrors the itemYields format:
//   { item, quantity, chance }
// where `chance` is the probability per action (0–1). Omit or set to 1 for guaranteed drops.
//
// Skill methods reference a table via `lootTableKey: "<key>"`.

export const LOOT_TABLES = {
    // HAM Members have a wide variety of junk drops alongside a small coin reward,
    // making them a good candidate for a dedicated loot table rather than inline yields.
    ham_member: {
        name: "HAM Member",
        drops: [
            { item: "coins",          quantity: 3,  chance: 1     },
            { item: "bronze_dagger",  quantity: 1,  chance: 3/100 },
            { item: "iron_ore",       quantity: 1,  chance: 3/100 },
            { item: "coal",           quantity: 1,  chance: 2/100 },
            { item: "uncut_sapphire", quantity: 1,  chance: 1/100 },
            { item: "uncut_emerald",  quantity: 1,  chance: 1/200 },
        ],
    },
};

export function getLootTable(key) {
    return LOOT_TABLES[key] ?? null;
}

/**
 * Returns a flat list of expected yield objects for a loot table, scaled to `quantity` actions.
 * RNG drops use their expected value (drop.quantity * quantity * chance).
 */
export function resolveLootTableYields(tableKey, quantity, itemNames) {
    const table = getLootTable(tableKey);
    if (!table) return [];

    return table.drops.map(drop => {
        const chance = drop.chance ?? 1;
        const isRng = chance < 1;
        return {
            item: drop.item,
            name: itemNames[drop.item]?.name ?? drop.item,
            quantity: drop.quantity * quantity * chance,
            chance: isRng ? chance : null,
            isRng,
        };
    });
}
