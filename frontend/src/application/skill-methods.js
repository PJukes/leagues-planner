export const SKILL_METHODS = {
    woodcutting: {
        label: "Woodcutting",
        methods: [
            { key: "chop_regular_trees", name: "Regular Trees", xpPerAction: 25, actionLabel: "log" },
            { key: "chop_oak_trees", name: "Oak Trees", xpPerAction: 37.5, actionLabel: "log" },
            { key: "chop_willow_trees", name: "Willow Trees", xpPerAction: 67.5, actionLabel: "log" },
            { key: "chop_maple_trees", name: "Maple Trees", xpPerAction: 100, actionLabel: "log" },
            { key: "chop_yew_trees", name: "Yew Trees", xpPerAction: 175, actionLabel: "log" },

        ],
    },
    firemaking: {
        label: "Firemaking",
        methods: [
            { key: "burn_normal_logs", name: "Normal Logs", xpPerAction: 40, actionLabel: "log" },
            { key: "burn_oak_logs", name: "Oak Logs", xpPerAction: 60, actionLabel: "log" },
            { key: "burn_willow_logs", name: "Willow Logs", xpPerAction: 90, actionLabel: "log" },
            { key: "burn_maple_logs", name: "Maple Logs", xpPerAction: 135, actionLabel: "log" },
            { key: "burn_yew_logs", name: "Yew Logs", xpPerAction: 202.5, actionLabel: "log" },

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
            { key: "fletch_fletch_arrow_shafts_logs", name: "Fletch Fletch Arrow Shafts (Logs)", xpPerAction: 5, actionLabel: "fletch" },
            { key: "fletch_headless_arrows", name: "Fletch Headless Arrows", xpPerAction: 1, actionLabel: "fletch" },
            { key: "fletch_shortbow_u", name: "Fletch Shortbow (u)", xpPerAction: 5, actionLabel: "fletch" },
        ],
    },
    thieving: {
        label: "Thieving",
        methods: [
            { key: "pickpocket_men", name: "Pickpocket Men", xpPerAction: 8, actionLabel: "pickpocket" },
            { key: "pickpocket_guard", name: "Pickpocket Guard", xpPerAction: 46.8, actionLabel: "pickpocket" },
            { key: "steal_from_vegetable_stall", name: "Steal From Vegetable stall", xpPerAction: 10, actionLabel: "steal from" },
            { key: "steal_from_bakery_stall", name: "Steal From Bakery stall", xpPerAction: 16, actionLabel: "steal from" },
            { key: "steal_from_tea_stall", name: "Steal From Tea stall", xpPerAction: 16, actionLabel: "steal from" },
            { key: "steal_from_monkey_food_stall", name: "Steal From Monkey food stall", xpPerAction: 16, actionLabel: "steal from" },
            { key: "steal_from_crafting_stall", name: "Steal From Crafting stall", xpPerAction: 20, actionLabel: "steal from" },
            { key: "steal_from_monkey_general_stall", name: "Steal From Monkey general stall", xpPerAction: 25, actionLabel: "steal from" },
            { key: "steal_from_silk_stall", name: "Steal From Silk stall", xpPerAction: 24, actionLabel: "steal from" },
            { key: "steal_from_wine_stall", name: "Steal From Wine stall", xpPerAction: 27, actionLabel: "steal from" },
            { key: "steal_from_fruit_stall", name: "Steal From Fruit Stall", xpPerAction: 28.5, actionLabel: "steal from" },
            { key: "steal_from_seed_stall", name: "Steal From Seed stall", xpPerAction: 10, actionLabel: "steal from" },
            { key: "steal_from_fur_stall", name: "Steal From Fur stall", xpPerAction: 45, actionLabel: "steal from" },
            { key: "steal_from_fish_stall", name: "Steal From Fish stall", xpPerAction: 42, actionLabel: "steal from" },
            { key: "steal_from_crossbow_stall", name: "Steal From Crossbow stall", xpPerAction: 52, actionLabel: "steal from" },
            { key: "steal_from_silver_stall", name: "Steal From Silver stall", xpPerAction: 205, actionLabel: "steal from" },
            { key: "steal_from_spice_stall", name: "Steal From Spice stall", xpPerAction: 92, actionLabel: "steal from" },
            { key: "steal_from_magic_stall", name: "Steal From Magic stall", xpPerAction: 90, actionLabel: "steal from" },
            { key: "steal_from_scimitar_stall", name: "Steal From Scimitar stall", xpPerAction: 210, actionLabel: "steal from" },
            { key: "steal_from_gem_stall", name: "Steal From Gem stall", xpPerAction: 408, actionLabel: "steal from" },
            { key: "steal_from_cannonball_stall", name: "Steal From Cannonball stall", xpPerAction: 223, actionLabel: "steal from" },
        ],
    },
    mining: {
        label: "Mining",
        methods: [
            { key: "mine_rune_essence", name: "Mine Rune essence", xpPerAction: 5, actionLabel: "cook" },
            { key: "mine_copper", name: "Mine Copper", xpPerAction: 17.5, actionLabel: "cook" },
            { key: "mine_tin", name: "Mine Tin", xpPerAction: 17.5, actionLabel: "cook" },
            { key: "mine_limestone", name: "Mine Limestone", xpPerAction: 26.5, actionLabel: "cook" },
            { key: "mine_blurite", name: "Mine Blurite", xpPerAction: 17.5, actionLabel: "cook" },
            { key: "mine_iron", name: "Mine Iron", xpPerAction: 35, actionLabel: "cook" },
            { key: "mine_silver", name: "Mine Silver", xpPerAction: 40, actionLabel: "cook" },
            { key: "mine_volcanic_ash", name: "Mine Volcanic ash", xpPerAction: 10, actionLabel: "cook" },
            { key: "mine_pure_essence", name: "Mine Pure essence", xpPerAction: 5, actionLabel: "cook" },
            { key: "mine_coal", name: "Mine Coal", xpPerAction: 50, actionLabel: "cook" },
            { key: "mine_sandstone", name: "Mine Sandstone", xpPerAction: 30, actionLabel: "cook" },
            { key: "mine_gem_rocks", name: "Mine Gem rocks", xpPerAction: 65, actionLabel: "cook" },
            { key: "mine_gold", name: "Mine Gold", xpPerAction: 65, actionLabel: "cook" },
            { key: "mine_calcified_rocks", name: "Mine Calcified rocks", xpPerAction: 33, actionLabel: "cook" },
            { key: "mine_granite", name: "Mine Granite", xpPerAction: 50, actionLabel: "cook" },
            { key: "mine_mithril", name: "Mine Mithril", xpPerAction: 80, actionLabel: "cook" },
            { key: "mine_adamantite", name: "Mine Adamantite", xpPerAction: 95, actionLabel: "cook" },
            { key: "mine_ancient_essence", name: "Mine Ancient essence", xpPerAction: 13.5, actionLabel: "cook" },
            { key: "mine_runite", name: "Mine Runite", xpPerAction: 125, actionLabel: "cook" },
        ]
    },
    smithing: {
        label: "Smithing",
        methods: [
            { key: "smelt_bronze", name: "Smelt Bronze", xpPerAction: 6.2, actionLabel: "smelt" },
            { key: "smith_bronze", name: "Smith Bronze", xpPerAction: 12.5, actionLabel: "smith" },
            { key: "smelt_iron", name: "Smelt Iron", xpPerAction: 12.5, actionLabel: "smelt" },
            { key: "smith_iron", name: "Smith Iron", xpPerAction: 25, actionLabel: "smith" },
            { key: "smelt_silver", name: "Smelt Silver", xpPerAction: 13.7, actionLabel: "smelt" },
            { key: "smelt_elemental", name: "Smelt Elemental", xpPerAction: 7.5, actionLabel: "smelt" },
            { key: "smelt_steel", name: "Smelt Steel", xpPerAction: 17.5, actionLabel: "smelt" },
            { key: "smith_steel", name: "Smith Steel", xpPerAction: 37.5, actionLabel: "smith" },
            { key: "smelt_gold", name: "Smelt Gold", xpPerAction: 22.5, actionLabel: "smelt" },
            { key: "smelt_lovakite", name: "Smelt Lovakite", xpPerAction: 20, actionLabel: "smelt" },
            { key: "smelt_mithril", name: "Smelt Mithril", xpPerAction: 30, actionLabel: "smelt" },
            { key: "smith_mithril", name: "Smith Mithril", xpPerAction: 50, actionLabel: "smith" },
            { key: "smelt_adamantite", name: "Smelt Adamantite", xpPerAction: 37.5, actionLabel: "smelt" },
            { key: "smith_adamantite", name: "Smith Adamantite", xpPerAction: 62.5, actionLabel: "smith" },
            { key: "smelt_runite", name: "Smelt Runite", xpPerAction: 50, actionLabel: "smelt" },
            { key: "smith_runite", name: "Smith Runite", xpPerAction: 75, actionLabel: "smith" },
        ]
    }
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
