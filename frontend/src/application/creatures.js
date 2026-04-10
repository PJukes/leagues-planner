export const CREATURES = {
    buffalo: { key: "buffalo", name: "Buffalo", hitpoints: 20, },
    icefiend: { key: "icefiend", name: "Icefiend", hitpoints: 15, },
    frost_crab: { key: "frost_crab", name: "Frost Crab", hitpoints: 25, },
    guard: { key: "guard", name: "Guard", hitpoints: 22, },
};

export function getCreatureOptions() {
    return Object.entries(CREATURES).map(([key, value]) => ({
        key,
        label: value.name,
    }));
}
