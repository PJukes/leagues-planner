export const SKILL_METHODS = {
    woodcutting: {
        label: "Woodcutting",
        methods: [
            { key: "regular_trees", name: "Regular Trees", xpPerAction: 25, actionLabel: "log" },
            { key: "oak_trees", name: "Oak Trees", xpPerAction: 37.5, actionLabel: "log" },
            { key: "willow_trees", name: "Willow Trees", xpPerAction: 67.5, actionLabel: "log" },
        ],
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
            { key: "pickpocket_men", name: "Pickpocket Men", xpPerAction: 8, actionLabel: "pickpocket" },
            { key: "pickpocket_citizen", name: "Pickpocket Citizen", xpPerAction: 50, actionLabel: "pickpocket" },
            { key: "pickpocket_guard", name: "Pickpocket Guard", xpPerAction: 46.8, actionLabel: "pickpocket" },
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
