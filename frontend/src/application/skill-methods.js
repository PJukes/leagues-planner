export const SKILL_METHODS = {
    woodcutting: {
        label: "Woodcutting",
        methods: [
            { key: "regular_trees", name: "Regular Trees", xpPerAction: 25, actionLabel: "log" },
            { key: "oak_trees", name: "Oak Trees", xpPerAction: 37.5, actionLabel: "log" },
            { key: "willow_trees", name: "Willow Trees", xpPerAction: 67.5, actionLabel: "log" },
            { key: "maple_trees", name: "Maple Trees", xpPerAction: 100, actionLabel: "log" },
            { key: "yew_trees", name: "Yew Trees", xpPerAction: 175, actionLabel: "log" },

        ],
    },
    firemaking: {
        label: "Firemaking",
        methods: [
            { key: "normal_logs", name: "Normal Logs", xpPerAction: 40, actionLabel: "log" },
            { key: "oak_logs", name: "Oak Logs", xpPerAction: 60, actionLabel: "log" },
            { key: "willow_logs", name: "Willow Logs", xpPerAction: 90, actionLabel: "log" },
            { key: "maple_logs", name: "Maple Logs", xpPerAction: 135, actionLabel: "log" },
            { key: "yew_logs", name: "Yew Logs", xpPerAction: 202.5, actionLabel: "log" },

        ],
    },
    fishing: {
        label: "Fishing",
        methods: [
            { key: "catch_shrimp", name: "Catch Shrimp", xpPerAction: 10, actionLabel: "fish" },
            { key: "catch_sardine", name: "Catch Sardine", xpPerAction: 20, actionLabel: "fish" },
            { key: "catch_karambwanji", name: "Catch Karambwanji", xpPerAction: 5, actionLabel: "fish" },
            { key: "catch_herring", name: "Catch Herring", xpPerAction: 30, actionLabel: "fish" },
            { key: "catch_anchovies", name: "Catch Anchovies", xpPerAction: 40, actionLabel: "fish" },
            { key: "catch_mackerel", name: "Catch Mackerel", xpPerAction: 20, actionLabel: "fish" },
            { key: "catch_trout", name: "Catch Trout", xpPerAction: 50, actionLabel: "fish" },
            { key: "catch_bream", name: "Catch Bream", xpPerAction: 20, actionLabel: "fish" },
            { key: "catch_cod", name: "Catch Cod", xpPerAction: 45, actionLabel: "fish" },
            { key: "catch_pike", name: "Catch Pike", xpPerAction: 60, actionLabel: "fish" },
            { key: "catch_slimy eel", name: "Catch Slimy eel", xpPerAction: 80, actionLabel: "fish" },
            { key: "catch_salmon", name: "Catch Salmon", xpPerAction: 70, actionLabel: "fish" },
            { key: "catch_frog spawn", name: "Catch Frog spawn", xpPerAction: 75, actionLabel: "fish" },
            { key: "catch_tuna", name: "Catch Tuna", xpPerAction: 80, actionLabel: "fish" },
            { key: "catch_rainbow fish", name: "Catch Rainbow fish", xpPerAction: 80, actionLabel: "fish" },
            { key: "catch_cave eel", name: "Catch Cave eel", xpPerAction: 80, actionLabel: "fish" },
            { key: "catch_lobster", name: "Catch Lobster", xpPerAction: 90, actionLabel: "fish" },
            { key: "catch_bass", name: "Catch Bass", xpPerAction: 100, actionLabel: "fish" },
            { key: "catch_swordfish", name: "Catch Swordfish", xpPerAction: 100, actionLabel: "fish" },
            { key: "catch_lava eel", name: "Catch Lava eel", xpPerAction: 60, actionLabel: "fish" },
            { key: "catch_monkfish", name: "Catch Monkfish", xpPerAction: 120, actionLabel: "fish" },
            { key: "catch_karambwan", name: "Catch Karambwan", xpPerAction: 50, actionLabel: "fish" },
            { key: "catch_shark", name: "Catch Shark", xpPerAction: 110, actionLabel: "fish" },
            { key: "catch_sea turtle", name: "Catch Sea turtle", xpPerAction: 38, actionLabel: "fish" },
            { key: "catch_infernal eel (smashed)", name: "Catch Infernal eel (smashed)", xpPerAction: 95, actionLabel: "fish" },
            { key: "catch_manta ray", name: "Catch Manta ray", xpPerAction: 69, actionLabel: "fish" },
            { key: "catch_anglerfish", name: "Catch Anglerfish", xpPerAction: 120, actionLabel: "fish" },
            { key: "catch_dark crab", name: "Catch Dark crab", xpPerAction: 130, actionLabel: "fish" },
        ],
    },
    cooking: {
        label: "Cooking",
        methods: [
            { key: "cook_shrimp", name: "Cook Shrimp", xpPerAction: 30, actionLabel: "cook" },
            { key: "cook_sardine", name: "Cook Sardine", xpPerAction: 40, actionLabel: "cook" },
            { key: "cook_karambwanji", name: "Cook Karambwanji", xpPerAction: 10, actionLabel: "cook" },
            { key: "cook_herring", name: "Cook Herring", xpPerAction: 50, actionLabel: "cook" },
            { key: "cook_anchovies", name: "Cook Anchovies", xpPerAction: 30, actionLabel: "cook" },
            { key: "cook_mackerel", name: "Cook Mackerel", xpPerAction: 60, actionLabel: "cook" },
            { key: "cook_trout", name: "Cook Trout", xpPerAction: 70, actionLabel: "cook" },
            { key: "cook_bream", name: "Cook Bream", xpPerAction: 45, actionLabel: "cook" },
            { key: "cook_cod", name: "Cook Cod", xpPerAction: 75, actionLabel: "cook" },
            { key: "cook_pike", name: "Cook Pike", xpPerAction: 80, actionLabel: "cook" },
            { key: "cook_slimy eel", name: "Cook Slimy eel", xpPerAction: 95, actionLabel: "cook" },
            { key: "cook_salmon", name: "Cook Salmon", xpPerAction: 90, actionLabel: "cook" },
            { key: "cook_rainbow fish", name: "Cook Rainbow fish", xpPerAction: 110, actionLabel: "cook" },
            { key: "cook_cave eel", name: "Cook Cave eel", xpPerAction: 115, actionLabel: "cook" },
            { key: "cook_lobster", name: "Cook Lobster", xpPerAction: 120, actionLabel: "cook" },
            { key: "cook_bass", name: "Cook Bass", xpPerAction: 130, actionLabel: "cook" },
            { key: "cook_catfish (prepared)", name: "Cook Catfish (prepared)", xpPerAction: 43, actionLabel: "cook" },
            { key: "cook_swordtip squid (cooked, crushed)", name: "Cook Swordtip squid (cooked, crushed)", xpPerAction: 150, actionLabel: "cook" },
            { key: "cook_common tench", name: "Cook Common tench", xpPerAction: 10, actionLabel: "cook" },
            { key: "cook_karambwan", name: "Cook Karambwan", xpPerAction: 190, actionLabel: "cook" },
            { key: "cook_giant krill", name: "Cook Giant krill", xpPerAction: 177.5, actionLabel: "cook" },
            { key: "cook_sea turtle", name: "Cook Sea turtle", xpPerAction: 212, actionLabel: "cook" },
            { key: "cook_yellowfin", name: "Cook Yellowfin", xpPerAction: 200, actionLabel: "cook" },
            { key: "cook_manta ray", name: "Cook Manta ray", xpPerAction: 216, actionLabel: "cook" },
            { key: "cook_anglerfish", name: "Cook Anglerfish", xpPerAction: 230, actionLabel: "cook" },
            { key: "cook_dark crab", name: "Cook Dark crab", xpPerAction: 215, actionLabel: "cook" },
        ]
    },
    fletching: {
        label: "Fletching",
        methods: [
            { key: "arrow_shafts_logs", name: "Fletch Arrow Shafts (Logs)", xpPerAction: 5, actionLabel: "log" },
            { key: "headless_arrows", name: "Headless Arrows", xpPerAction: 1, actionLabel: "arrow" },
            { key: "shortbow_u", name: "Shortbow (u)", xpPerAction: 5, actionLabel: "bow" },
        ],
    },
    thieving: {
        label: "Thieving",
        methods: [
            { key: "pickpocket_men", name: "Pickpocket Men", xpPerAction: 8, actionLabel: "pickpocket", gold: 3 },
            { key: "pickpocket_guard", name: "Pickpocket Guard", xpPerAction: 46.8, actionLabel: "pickpocket", gold: 30 },
            { key: "vegetable_stall", name: "Steal from Vegetable stall", level: 2, xpPerAction: 10,	loot: "Onion, cabbage, potato, tomato, or garlic" },
            { key: "bakery_stall", name: "Steal from Bakery stall", level: 5, xpPerAction: 16,	loot: "Cake, chocolate slice or bread" },
            { key: "tea_stall", name: "Steal from Tea stall", level: 5, xpPerAction: 16,	loot: "Cup of tea" },
            { key: "monkey_food_stall", name: "Steal from Monkey food stall", level: 5, xpPerAction: 16,	loot: "Banana" },
            { key: "crafting_stall", name: "Steal from Crafting stall", level: 5, xpPerAction: 20,	loot: "Chisel, ring mould, necklace mould, amulet mould or bracelet mould" },
            { key: "monkey_general_stall", name: "Steal from Monkey general stall", level: 5, xpPerAction: 25,	loot: "Pot, hammer or tinderbox" },
            { key: "silk_stall", name: "Steal from Silk stall", level: 2, xpPerAction: 24,	loot: "Silk" },
            { key: "wine_stall", name: "Steal from Wine stall", level: 2, xpPerAction: 27,	loot: "Jug of water, jug of wine, grapes, jug, or bottle of wine" },
            { key: "fruit_stall", name: "Steal from Fruit Stall", level: 25, xpPerAction: 28.5, loot: "Cooking apple, banana, strawberry, redberries, jangerberries, strange fruit, lime, lemon, pineapple, papaya fruit, or golovanova fruit top" },
            { key: "seed_stall", name: "Steal from Seed stall", level: 2, xpPerAction: 10,	loot: "Various seeds" },
            { key: "fur_stall", name: "Steal from Fur stall", level: 3, xpPerAction: 45,	loot: "Fur or grey wolf fur" },
            { key: "fish_stall", name: "Steal from Fish stall", level: 4, xpPerAction: 42,	loot: "Raw salmon, raw tuna or raw lobster" },
            { key: "crossbow_stall", name: "Steal from Crossbow stall", level: 4, xpPerAction: 52,	loot: "Bronze bolts (3), bronze limbs, mithril bolts, mithril limbs or wooden stock" },
            { key: "silver_stall", name: "Steal from Silver stall", level: 5, xpPerAction: 205,	loot: "Silver ore, silver bar or tiara" },
            { key: "spice_stall", name: "Steal from Spice stall", level: 6, xpPerAction: 92,	loot: "Spice" },
            { key: "magic_stall", name: "Steal from Magic stall", level: 6, xpPerAction: 90,	loot: "Air, earth, fire, nature or law runes" },
            { key: "scimitar_stall", name: "Steal from Scimitar stall", level: 6, xpPerAction: 210,	loot: "Iron scimitar, steel scimitar, mithril scimitar or adamant scimitar" },
            { key: "gem_stall", name: "Steal from Gem stall", level: 7, xpPerAction: 408,	loot: "Uncut sapphire, uncut emerald, uncut ruby, or uncut diamond" },
            { key: "cannonball_stall", name: "Steal from Cannonball stall", level: 8, xpPerAction: 223,loot: "" },
        ],
    },
};

export function getSkillOptions() {
    return Object.entries(SKILL_METHODS).map(([key, value]) => ({
        key,
        label: value.label,
    }));
}

export function getMethodsForSkill(skillKey) {
    if (!skillKey || !SKILL_METHODS[skillKey]) {
        return [];
    }

    return SKILL_METHODS[skillKey].methods;
}

export function getMethod(skillKey, methodKey) {
    return getMethodsForSkill(skillKey).find((method) => method.key === methodKey);
}
