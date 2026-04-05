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
    axe_shop: {
        name: "Bob's Axes",
        inventory: [
            { item: "bronze_axe", price: 16 },
            { item: "iron_axe", price: 56 },
            { item: "steel_axe", price: 200 },
            { item: "mithril_axe", price: 512 },
            { item: "adamant_axe", price: 1408 },
        ],
    },
    pickaxe_shop: {
        name: "Nurmof's Pickaxes",
        inventory: [
            { item: "bronze_pickaxe", price: 1 },
            { item: "iron_pickaxe", price: 140 },
            { item: "steel_pickaxe", price: 500 },
            { item: "mithril_pickaxe", price: 1300 },
            { item: "adamant_pickaxe", price: 3200 },
        ],
    },
};

export const SHOP_LIST = Object.entries(SHOPS).map(([key, shop]) => ({
    key,
    name: shop.name,
}));
