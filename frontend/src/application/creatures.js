export const CREATURES = {
    buffalo: {
        key: "buffalo",
        name: "Buffalo",
        hitpoints: 20,
    },
    frost_crab: {
        key: "frost_crab",
        name: "Frost Crab",
        hitpoints: 25,
    },
};

export function getCreatureOptions() {
    return Object.entries(CREATURES).map(([key, value]) => ({
        key,
        label: value.name,
    }));
}
