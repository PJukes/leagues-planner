export const SHOPS = {
    general_store: {
        name: "General Store",
        inventory: [
            { item: "bucket", price: 2 },
            { item: "pot", price: 1 },
            { item: "jug", price: 1 },
            { item: "bowl", price: 4 },
            { item: "shears", price: 1 },
            { item: "tinderbox", price: 1 },
            { item: "chisel", price: 9 },
            { item: "hammer", price: 13 },
            { item: "knife", price: 6 },
        ],
    },
    fishing_shop: {
        name: "Fishing Supplies",
        inventory: [
            { item: "small_fishing_net", price: 5 },
            { item: "fishing_rod", price: 5 },
            { item: "fly_fishing_rod", price: 5 },
            { item: "lobster_pot", price: 20 },
            { item: "harpoon", price: 45 },
            { item: "big_fishing_net", price: 36 },
            { item: "fishing_bait", price: 3 },
            { item: "feather", price: 2 },
        ],
    },
    tal_teklan_rune_shop: {
        name: "Tal Teklan Rune Shop",
        inventory: [
            { item: "air_rune", price: 4},
            { item: "water_rune", price: 4},
            { item: "earth_rune", price: 4},
            { item: "fire_rune", price: 4},
            { item: "mind_rune", price: 3},
            { item: "body_rune", price: 3},
            { item: "chaos_rune", price: 90},
            { item: "death_rune", price: 180},
            { item: "cosmic_rune", price: 50},
            { item: "nature_rune", price: 180},
            { item: "air_rune_pack", price: 430},
            { item: "water_rune_pack", price: 430},
            { item: "earth_rune_pack", price: 430},
            { item: "fire_rune_pack", price: 430},
            { item: "mind_rune_pack", price: 330},
            { item: "chaos_rune_pack", price: 9950},
        ]
    }
};

export const SHOP_LIST = Object.entries(SHOPS).map(([key, shop]) => ({
    key,
    name: shop.name,
}));
