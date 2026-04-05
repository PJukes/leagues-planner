/**
 * OSRS quest definitions.
 * requirements: { skill: level } — minimum levels needed before starting
 * xpRewards:   [{ skill, amount }] — XP given on completion (boosted by league multiplier)
 * itemRewards: [{ item, quantity }] — items added to the repository on completion
 */
export const QUESTS = {
    // ── F2P ──────────────────────────────────────────────────────────────────
    cooks_assistant: {
        name: "Cook's Assistant",
        requirements: {},
        xpRewards: [{ skill: "cooking", amount: 300 }],
        itemRewards: [],
    },
    sheep_shearer: {
        name: "Sheep Shearer",
        requirements: {},
        xpRewards: [{ skill: "crafting", amount: 150 }],
        itemRewards: [],
    },
    the_restless_ghost: {
        name: "The Restless Ghost",
        requirements: {},
        xpRewards: [{ skill: "prayer", amount: 1125 }],
        itemRewards: [],
    },
    ernest_the_chicken: {
        name: "Ernest the Chicken",
        requirements: {},
        xpRewards: [],
        itemRewards: [{ item: "feather", quantity: 300 }],
    },
    goblin_diplomacy: {
        name: "Goblin Diplomacy",
        requirements: {},
        xpRewards: [],
        itemRewards: [],
    },
    romeo_and_juliet: {
        name: "Romeo & Juliet",
        requirements: {},
        xpRewards: [],
        itemRewards: [],
    },
    imp_catcher: {
        name: "Imp Catcher",
        requirements: {},
        xpRewards: [{ skill: "magic", amount: 875 }],
        itemRewards: [{ item: "amulet_of_accuracy", quantity: 1 }],
    },
    rune_mysteries: {
        name: "Rune Mysteries",
        requirements: {},
        xpRewards: [{ skill: "runecraft", amount: 575 }],
        itemRewards: [],
    },
    demon_slayer: {
        name: "Demon Slayer",
        requirements: {},
        xpRewards: [],
        itemRewards: [{ item: "silverlight", quantity: 1 }],
    },
    dorics_quest: {
        name: "Doric's Quest",
        requirements: {},
        xpRewards: [{ skill: "mining", amount: 1300 }],
        itemRewards: [],
    },
    // ── P2P ──────────────────────────────────────────────────────────────────
    priest_in_peril: {
        name: "Priest in Peril",
        requirements: {},
        xpRewards: [{ skill: "prayer", amount: 1406 }],
        itemRewards: [],
    },
    plague_city: {
        name: "Plague City",
        requirements: {},
        xpRewards: [{ skill: "mining", amount: 2425 }],
        itemRewards: [],
    },
    biohazard: {
        name: "Biohazard",
        requirements: { agility: 10 },
        xpRewards: [{ skill: "thieving", amount: 1250 }],
        itemRewards: [],
    },
    tree_gnome_village: {
        name: "Tree Gnome Village",
        requirements: {},
        xpRewards: [{ skill: "attack", amount: 11450 }],
        itemRewards: [],
    },
    fight_arena: {
        name: "Fight Arena",
        requirements: {},
        xpRewards: [
            { skill: "attack", amount: 12175 },
            { skill: "thieving", amount: 2175 },
        ],
        itemRewards: [],
    },
    waterfall_quest: {
        name: "Waterfall Quest",
        requirements: {},
        xpRewards: [
            { skill: "attack", amount: 13750 },
            { skill: "strength", amount: 13750 },
        ],
        itemRewards: [],
    },
    ghosts_ahoy: {
        name: "Ghosts Ahoy",
        requirements: { agility: 20, cooking: 25 },
        xpRewards: [
            { skill: "agility", amount: 2400 },
            { skill: "woodcutting", amount: 2400 },
        ],
        itemRewards: [],
    },
    shades_of_mortons: {
        name: "Shades of Mort'ton",
        requirements: { crafting: 20, firemaking: 20 },
        xpRewards: [
            { skill: "crafting", amount: 2000 },
            { skill: "firemaking", amount: 2000 },
            { skill: "prayer", amount: 2000 },
        ],
        itemRewards: [],
    },
    nature_spirit: {
        name: "Nature Spirit",
        requirements: {},
        xpRewards: [
            { skill: "crafting", amount: 3000 },
            { skill: "defence", amount: 3000 },
        ],
        itemRewards: [],
    },
    the_grand_tree: {
        name: "The Grand Tree",
        requirements: { agility: 25 },
        xpRewards: [
            { skill: "attack", amount: 18400 },
            { skill: "magic", amount: 7900 },
            { skill: "agility", amount: 2150 },
        ],
        itemRewards: [],
    },
    lost_city: {
        name: "Lost City",
        requirements: { woodcutting: 36, crafting: 31 },
        xpRewards: [
            { skill: "woodcutting", amount: 3000 },
            { skill: "crafting", amount: 3000 },
        ],
        itemRewards: [],
    },
    dragon_slayer_i: {
        name: "Dragon Slayer I",
        requirements: {},
        xpRewards: [
            { skill: "strength", amount: 18650 },
            { skill: "defence", amount: 18650 },
            { skill: "hitpoints", amount: 18650 },
        ],
        itemRewards: [],
    },
    animal_magnetism: {
        name: "Animal Magnetism",
        requirements: { slayer: 18, crafting: 19, ranged: 30, woodcutting: 35 },
        xpRewards: [
            { skill: "fletching", amount: 1000 },
            { skill: "ranged", amount: 2500 },
            { skill: "woodcutting", amount: 1000 },
        ],
        itemRewards: [],
    },
    desert_treasure_i: {
        name: "Desert Treasure I",
        requirements: { thieving: 53, firemaking: 50, slayer: 10, magic: 50 },
        xpRewards: [
            { skill: "magic", amount: 20000 },
            { skill: "thieving", amount: 20000 },
            { skill: "hitpoints", amount: 20000 },
            { skill: "slayer", amount: 20000 },
        ],
        itemRewards: [],
    },
};

export const QUEST_LIST = Object.entries(QUESTS).map(([key, q]) => ({
    key,
    name: q.name,
    requirements: q.requirements || {},
    xpRewards: q.xpRewards || [],
    itemRewards: q.itemRewards || [],
}));
