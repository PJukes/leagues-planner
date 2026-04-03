export const CREATURES = {
    buffalo: {
        key: "buffalo",
        name: "Buffalo",
        hitpoints: 20,
    },
};

export function getCreatureOptions() {
    return Object.entries(CREATURES).map(([key, value]) => ({
        key,
        label: value.label,
    }));
}
