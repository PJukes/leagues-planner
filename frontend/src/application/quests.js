/**
 * OSRS quest definitions.
 * requirements: { skill: level } — minimum levels needed before starting
 * xpRewards:   [{ skill, amount }] — XP given on completion (boosted by league multiplier)
 * itemRewards: [{ item, quantity }] — items added to the repository on completion
 */
export const QUESTS = {
    "cooks_assistant": {
        "name": "Cook's Assistant",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 300
            }
        ],
        "itemRewards": []
    },
    "recruitment_drive": {
        "name": "Recruitment Drive",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 12
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 1000.5
            },
            {
                "skill": "herblore",
                "amount": 1000.5
            },
            {
                "skill": "prayer",
                "amount": 1000.5
            }
        ],
        "itemRewards": []
    },
    "the_depths_of_despair": {
        "name": "The Depths of Despair",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 1500
            }
        ],
        "itemRewards": []
    },
    "the_fremennik_trials": {
        "name": "The Fremennik Trials",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 2812.4
            },
            {
                "skill": "attack",
                "amount": 2812.4
            },
            {
                "skill": "crafting",
                "amount": 2812.4
            },
            {
                "skill": "defence",
                "amount": 2812.4
            },
            {
                "skill": "fishing",
                "amount": 2812.4
            },
            {
                "skill": "fletching",
                "amount": 2812.4
            },
            {
                "skill": "hitpoints",
                "amount": 2812.4
            },
            {
                "skill": "strength",
                "amount": 2812.4
            },
            {
                "skill": "thieving",
                "amount": 2812.4
            },
            {
                "skill": "woodcutting",
                "amount": 2812.4
            }
        ],
        "itemRewards": []
    },
    "underground_pass": {
        "name": "Underground Pass",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "ranged",
                    "level": 25
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 3000
            },
            {
                "skill": "attack",
                "amount": 3000
            }
        ],
        "itemRewards": []
    },
    "icthlarins_little_helper": {
        "name": "Icthlarin's Little Helper",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": [
                "gertrudes_cat"
            ]
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 4000
            },
            {
                "skill": "thieving",
                "amount": 4500
            },
            {
                "skill": "woodcutting",
                "amount": 4000
            }
        ],
        "itemRewards": []
    },
    "cold_war": {
        "name": "Cold War",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "construction",
                    "level": 34
                },
                {
                    "skill": "crafting",
                    "level": 30
                },
                {
                    "skill": "hunter",
                    "level": 10
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 5000
            },
            {
                "skill": "construction",
                "amount": 1500
            },
            {
                "skill": "crafting",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "royal_trouble": {
        "name": "Royal Trouble",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 40
                }
            ],
            "quests": [
                "throne_of_miscellania"
            ]
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 5000
            },
            {
                "skill": "hitpoints",
                "amount": 5000
            },
            {
                "skill": "slayer",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "cabin_fever": {
        "name": "Cabin Fever",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 45
                },
                {
                    "skill": "smithing",
                    "level": 50
                },
                {
                    "skill": "ranged",
                    "level": 40
                },
                {
                    "skill": "farming",
                    "level": 40
                },
                {
                    "skill": "prayer",
                    "level": 47
                },
                {
                    "skill": "slayer",
                    "level": 42
                }
            ],
            "quests": [
                "rum_deal"
            ]
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 7000
            },
            {
                "skill": "crafting",
                "amount": 7000
            },
            {
                "skill": "smithing",
                "amount": 7000
            }
        ],
        "itemRewards": []
    },
    "darkness_of_hallowvale": {
        "name": "Darkness of Hallowvale",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "construction",
                    "level": 5
                },
                {
                    "skill": "mining",
                    "level": 20
                },
                {
                    "skill": "thieving",
                    "level": 22
                },
                {
                    "skill": "crafting",
                    "level": 32
                },
                {
                    "skill": "magic",
                    "level": 33
                },
                {
                    "skill": "strength",
                    "level": 40
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 7000
            },
            {
                "skill": "construction",
                "amount": 2000
            },
            {
                "skill": "thieving",
                "amount": 6000
            }
        ],
        "itemRewards": []
    },
    "death_on_the_isle": {
        "name": "Death on the Isle",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 34
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 7500
            },
            {
                "skill": "crafting",
                "amount": 5000
            },
            {
                "skill": "thieving",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "the_grand_tree": {
        "name": "The Grand Tree",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 7900
            },
            {
                "skill": "attack",
                "amount": 18400
            },
            {
                "skill": "magic",
                "amount": 2150
            }
        ],
        "itemRewards": []
    },
    "the_heart_of_darkness": {
        "name": "The Heart of Darkness",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "mining",
                    "level": 55
                },
                {
                    "skill": "slayer",
                    "level": 48
                },
                {
                    "skill": "thieving",
                    "level": 48
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 8000
            },
            {
                "skill": "mining",
                "amount": 8000
            },
            {
                "skill": "slayer",
                "amount": 8000
            },
            {
                "skill": "thieving",
                "amount": 8000
            }
        ],
        "itemRewards": []
    },
    "land_of_the_goblins": {
        "name": "Land of the Goblins",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "fishing",
                    "level": 40
                },
                {
                    "skill": "thieving",
                    "level": 45
                },
                {
                    "skill": "herblore",
                    "level": 48
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 8000
            },
            {
                "skill": "fishing",
                "amount": 8000
            },
            {
                "skill": "herblore",
                "amount": 8000
            },
            {
                "skill": "thieving",
                "amount": 8000
            }
        ],
        "itemRewards": []
    },
    "troll_romance": {
        "name": "Troll Romance",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": [
                "troll_stronghold"
            ]
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 8000
            },
            {
                "skill": "strength",
                "amount": 4000
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_king_awowogei": {
        "name": "Recipe for Disaster/Freeing King Awowogei",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "cooking",
                    "level": 70
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 10000
            },
            {
                "skill": "cooking",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "regicide": {
        "name": "Regicide",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": [
                "underground_pass"
            ]
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 13750
            }
        ],
        "itemRewards": []
    },
    "grim_tales": {
        "name": "Grim Tales",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "farming",
                    "level": 45
                },
                {
                    "skill": "herblore",
                    "level": 52
                },
                {
                    "skill": "thieving",
                    "level": 58
                },
                {
                    "skill": "woodcutting",
                    "level": 71
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 25000
            },
            {
                "skill": "farming",
                "amount": 10000
            },
            {
                "skill": "herblore",
                "amount": 15000
            },
            {
                "skill": "hitpoints",
                "amount": 5000
            },
            {
                "skill": "thieving",
                "amount": 25000
            },
            {
                "skill": "woodcutting",
                "amount": 60000
            }
        ],
        "itemRewards": []
    },
    "the_curse_of_arrav": {
        "name": "The Curse of Arrav",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 37
                },
                {
                    "skill": "strength",
                    "level": 58
                },
                {
                    "skill": "thieving",
                    "level": 62
                },
                {
                    "skill": "ranged",
                    "level": 62
                },
                {
                    "skill": "mining",
                    "level": 64
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 40000
            },
            {
                "skill": "mining",
                "amount": 40000
            },
            {
                "skill": "thieving",
                "amount": 40000
            }
        ],
        "itemRewards": []
    },
    "song_of_the_elves": {
        "name": "Song of the Elves",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "construction",
                    "level": 70
                },
                {
                    "skill": "farming",
                    "level": 70
                },
                {
                    "skill": "herblore",
                    "level": 70
                },
                {
                    "skill": "hunter",
                    "level": 70
                },
                {
                    "skill": "mining",
                    "level": 70
                },
                {
                    "skill": "smithing",
                    "level": 70
                },
                {
                    "skill": "woodcutting",
                    "level": 70
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 40000
            },
            {
                "skill": "construction",
                "amount": 40000
            },
            {
                "skill": "farming",
                "amount": 40000
            },
            {
                "skill": "herblore",
                "amount": 40000
            },
            {
                "skill": "hunter",
                "amount": 40000
            },
            {
                "skill": "mining",
                "amount": 40000
            },
            {
                "skill": "smithing",
                "amount": 40000
            },
            {
                "skill": "woodcutting",
                "amount": 40000
            }
        ],
        "itemRewards": []
    },
    "dragon_slayer_ii": {
        "name": "Dragon Slayer II",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 200
                },
                {
                    "skill": "magic",
                    "level": 75
                },
                {
                    "skill": "smithing",
                    "level": 70
                },
                {
                    "skill": "mining",
                    "level": 68
                },
                {
                    "skill": "crafting",
                    "level": 62
                },
                {
                    "skill": "thieving",
                    "level": 60
                },
                {
                    "skill": "construction",
                    "level": 50
                },
                {
                    "skill": "hitpoints",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 50000
            },
            {
                "skill": "mining",
                "amount": 60000
            },
            {
                "skill": "smithing",
                "amount": 80000
            },
            {
                "skill": "thieving",
                "amount": 50000
            }
        ],
        "itemRewards": []
    },
    "beneath_cursed_sands": {
        "name": "Beneath Cursed Sands",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 55
                },
                {
                    "skill": "firemaking",
                    "level": 55
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 50000
            }
        ],
        "itemRewards": []
    },
    "making_friends_with_my_arm": {
        "name": "Making Friends with My Arm",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "construction",
                    "level": 35
                },
                {
                    "skill": "firemaking",
                    "level": 66
                },
                {
                    "skill": "mining",
                    "level": 72
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 50000
            },
            {
                "skill": "construction",
                "amount": 10000
            },
            {
                "skill": "firemaking",
                "amount": 40000
            },
            {
                "skill": "mining",
                "amount": 50000
            }
        ],
        "itemRewards": []
    },
    "mournings_end_part_ii": {
        "name": "Mourning's End Part II",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": [
                "mournings_end_part_i"
            ]
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 60000
            }
        ],
        "itemRewards": []
    },
    "monkey_madness_ii": {
        "name": "Monkey Madness II",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 69
                },
                {
                    "skill": "crafting",
                    "level": 70
                },
                {
                    "skill": "hunter",
                    "level": 60
                },
                {
                    "skill": "thieving",
                    "level": 55
                },
                {
                    "skill": "agility",
                    "level": 55
                },
                {
                    "skill": "firemaking",
                    "level": 60
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 60000
            },
            {
                "skill": "hunter",
                "amount": 50000
            },
            {
                "skill": "slayer",
                "amount": 80000
            },
            {
                "skill": "thieving",
                "amount": 50000
            }
        ],
        "itemRewards": []
    },
    "secrets_of_the_north": {
        "name": "Secrets of the North",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "hunter",
                    "level": 56
                },
                {
                    "skill": "thieving",
                    "level": 64
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "agility",
                "amount": 60000
            },
            {
                "skill": "hunter",
                "amount": 40000
            },
            {
                "skill": "thieving",
                "amount": 50000
            }
        ],
        "itemRewards": []
    },
    "in_search_of_the_myreque": {
        "name": "In Search of the Myreque",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 25
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 600
            },
            {
                "skill": "crafting",
                "amount": 600
            },
            {
                "skill": "defence",
                "amount": 600
            },
            {
                "skill": "hitpoints",
                "amount": 600
            },
            {
                "skill": "strength",
                "amount": 600
            }
        ],
        "itemRewards": []
    },
    "mountain_daughter": {
        "name": "Mountain Daughter",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 1000
            },
            {
                "skill": "prayer",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "fairytale_i_growing_pains": {
        "name": "Fairytale I - Growing Pains",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 2000
            },
            {
                "skill": "farming",
                "amount": 3500
            },
            {
                "skill": "magic",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "in_aid_of_the_myreque": {
        "name": "In Aid of the Myreque",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 25
                },
                {
                    "skill": "mining",
                    "level": 15
                },
                {
                    "skill": "magic",
                    "level": 7
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 2000
            },
            {
                "skill": "crafting",
                "amount": 2000
            },
            {
                "skill": "defence",
                "amount": 2000
            },
            {
                "skill": "strength",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "tai_bwo_wannai_trio": {
        "name": "Tai Bwo Wannai Trio",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 15
                },
                {
                    "skill": "cooking",
                    "level": 30
                },
                {
                    "skill": "fishing",
                    "level": 5
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 2500
            },
            {
                "skill": "cooking",
                "amount": 5000
            },
            {
                "skill": "fishing",
                "amount": 5000
            },
            {
                "skill": "strength",
                "amount": 2500
            }
        ],
        "itemRewards": []
    },
    "death_plateau": {
        "name": "Death Plateau",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 3000
            }
        ],
        "itemRewards": []
    },
    "heroes_quest": {
        "name": "Heroes' Quest",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 55
                },
                {
                    "skill": "cooking",
                    "level": 53
                },
                {
                    "skill": "fishing",
                    "level": 53
                },
                {
                    "skill": "herblore",
                    "level": 25
                },
                {
                    "skill": "mining",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 3075
            },
            {
                "skill": "cooking",
                "amount": 2825
            },
            {
                "skill": "defence",
                "amount": 3075
            },
            {
                "skill": "firemaking",
                "amount": 1575
            },
            {
                "skill": "fishing",
                "amount": 2725
            },
            {
                "skill": "herblore",
                "amount": 1325
            },
            {
                "skill": "hitpoints",
                "amount": 3075
            },
            {
                "skill": "mining",
                "amount": 2575
            },
            {
                "skill": "ranged",
                "amount": 2075
            },
            {
                "skill": "smithing",
                "amount": 2275
            },
            {
                "skill": "strength",
                "amount": 3075
            },
            {
                "skill": "woodcutting",
                "amount": 1575
            }
        ],
        "itemRewards": []
    },
    "vampyre_slayer": {
        "name": "Vampyre Slayer",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 4825
            }
        ],
        "itemRewards": []
    },
    "tree_gnome_village": {
        "name": "Tree Gnome Village",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 11450
            }
        ],
        "itemRewards": []
    },
    "fight_arena": {
        "name": "Fight Arena",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 12175
            },
            {
                "skill": "thieving",
                "amount": 2175
            }
        ],
        "itemRewards": []
    },
    "waterfall_quest": {
        "name": "Waterfall Quest",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 13750
            },
            {
                "skill": "strength",
                "amount": 13750
            }
        ],
        "itemRewards": []
    },
    "knight_waves": {
        "name": "Knight Waves",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "magic",
                    "level": 45
                },
                {
                    "skill": "defence",
                    "level": 65
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "attack",
                "amount": 20000
            },
            {
                "skill": "defence",
                "amount": 20000
            },
            {
                "skill": "hitpoints",
                "amount": 20000
            },
            {
                "skill": "strength",
                "amount": 20000
            }
        ],
        "itemRewards": []
    },
    "the_eyes_of_glouphrie": {
        "name": "The Eyes of Glouphrie",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "magic",
                    "level": 46
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 250
            },
            {
                "skill": "magic",
                "amount": 12000
            },
            {
                "skill": "runecraft",
                "amount": 6000
            },
            {
                "skill": "woodcutting",
                "amount": 2500
            }
        ],
        "itemRewards": []
    },
    "daddys_home": {
        "name": "Daddy's Home",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 400
            }
        ],
        "itemRewards": []
    },
    "at_first_light": {
        "name": "At First Light",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "hunter",
                    "level": 46
                },
                {
                    "skill": "herblore",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 800
            },
            {
                "skill": "herblore",
                "amount": 500
            },
            {
                "skill": "hunter",
                "amount": 4500
            }
        ],
        "itemRewards": []
    },
    "tower_of_life": {
        "name": "Tower of Life",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 1000
            },
            {
                "skill": "crafting",
                "amount": 500
            },
            {
                "skill": "thieving",
                "amount": 500
            }
        ],
        "itemRewards": []
    },
    "the_great_brain_robbery": {
        "name": "The Great Brain Robbery",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 16
                },
                {
                    "skill": "prayer",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 2000
            },
            {
                "skill": "crafting",
                "amount": 3000
            },
            {
                "skill": "prayer",
                "amount": 6000
            }
        ],
        "itemRewards": []
    },
    "shadows_of_custodia": {
        "name": "Shadows of Custodia",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "fishing",
                    "level": 45
                },
                {
                    "skill": "hunter",
                    "level": 36
                },
                {
                    "skill": "slayer",
                    "level": 54
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 3000
            },
            {
                "skill": "fishing",
                "amount": 3000
            },
            {
                "skill": "hunter",
                "amount": 4000
            },
            {
                "skill": "slayer",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "getting_ahead": {
        "name": "Getting Ahead",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 3200
            },
            {
                "skill": "crafting",
                "amount": 4000
            }
        ],
        "itemRewards": []
    },
    "the_fremennik_isles": {
        "name": "The Fremennik Isles",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 40
                },
                {
                    "skill": "woodcutting",
                    "level": 56
                },
                {
                    "skill": "crafting",
                    "level": 46
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 5000
            },
            {
                "skill": "crafting",
                "amount": 5000
            },
            {
                "skill": "woodcutting",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "scrambled": {
        "name": "Scrambled!",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "cooking",
                    "level": 36
                },
                {
                    "skill": "smithing",
                    "level": 35
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "construction",
                "amount": 5000
            },
            {
                "skill": "cooking",
                "amount": 5000
            },
            {
                "skill": "smithing",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "rag_and_bone_man_i": {
        "name": "Rag and Bone Man I",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 500
            },
            {
                "skill": "prayer",
                "amount": 500
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_the_mountain_dwarf": {
        "name": "Recipe for Disaster/Freeing the Mountain Dwarf",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 1000
            },
            {
                "skill": "slayer",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_the_goblin_generals": {
        "name": "Recipe for Disaster/Freeing the Goblin generals",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 1000
            },
            {
                "skill": "crafting",
                "amount": 1000
            },
            {
                "skill": "farming",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_pirate_pete": {
        "name": "Recipe for Disaster/Freeing Pirate Pete",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 42
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 1000
            },
            {
                "skill": "crafting",
                "amount": 1000
            },
            {
                "skill": "fishing",
                "amount": 1000
            },
            {
                "skill": "smithing",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "big_chompy_bird_hunting": {
        "name": "Big Chompy Bird Hunting",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "fletching",
                    "level": 5
                },
                {
                    "skill": "ranged",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 1470
            },
            {
                "skill": "fletching",
                "amount": 262
            },
            {
                "skill": "ranged",
                "amount": 735
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_skrach_uglogwee": {
        "name": "Recipe for Disaster/Freeing Skrach Uglogwee",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "firemaking",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 1500
            },
            {
                "skill": "crafting",
                "amount": 1500
            },
            {
                "skill": "ranged",
                "amount": 1500
            },
            {
                "skill": "woodcutting",
                "amount": 1500
            }
        ],
        "itemRewards": []
    },
    "gertrudes_cat": {
        "name": "Gertrude's Cat",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 1525
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_the_lumbridge_guide": {
        "name": "Recipe for Disaster/Freeing the Lumbridge Guide",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 2500
            },
            {
                "skill": "magic",
                "amount": 2500
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_sir_amik_varze": {
        "name": "Recipe for Disaster/Freeing Sir Amik Varze",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 107
                }
            ],
            "quests": [
                "family_crest",
                "heroes_quest",
                "shilo_village",
                "underground_pass",
                "waterfall_quest"
            ]
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 4000
            },
            {
                "skill": "hitpoints",
                "amount": 4000
            }
        ],
        "itemRewards": []
    },
    "forgettable_tale": {
        "name": "Forgettable Tale...",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "farming",
                    "level": 17
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 5000
            },
            {
                "skill": "farming",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "recipe_for_disaster_freeing_evil_dave": {
        "name": "Recipe for Disaster/Freeing Evil Dave",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 7000
            }
        ],
        "itemRewards": []
    },
    "meat_and_greet": {
        "name": "Meat and Greet",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "cooking",
                "amount": 8000
            }
        ],
        "itemRewards": []
    },
    "sheep_shearer": {
        "name": "Sheep Shearer",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 150
            }
        ],
        "itemRewards": []
    },
    "goblin_diplomacy": {
        "name": "Goblin Diplomacy",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 200
            }
        ],
        "itemRewards": []
    },
    "misthalin_mystery": {
        "name": "Misthalin Mystery",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 600
            }
        ],
        "itemRewards": []
    },
    "dwarf_cannon": {
        "name": "Dwarf Cannon",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 750
            }
        ],
        "itemRewards": []
    },
    "animal_magnetism": {
        "name": "Animal Magnetism",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 18
                },
                {
                    "skill": "ranged",
                    "level": 30
                },
                {
                    "skill": "woodcutting",
                    "level": 35
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 1000
            },
            {
                "skill": "fletching",
                "amount": 1000
            },
            {
                "skill": "slayer",
                "amount": 1000
            },
            {
                "skill": "woodcutting",
                "amount": 2500
            }
        ],
        "itemRewards": []
    },
    "the_golem": {
        "name": "The Golem",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 25
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 1000
            },
            {
                "skill": "thieving",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "making_history": {
        "name": "Making History",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 1000
            },
            {
                "skill": "prayer",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "tears_of_guthix": {
        "name": "Tears of Guthix",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "firemaking",
                    "level": 49
                },
                {
                    "skill": "mining",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "murder_mystery": {
        "name": "Murder Mystery",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 1406
            }
        ],
        "itemRewards": []
    },
    "enlightened_journey": {
        "name": "Enlightened Journey",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 20
                },
                {
                    "skill": "firemaking",
                    "level": 20
                },
                {
                    "skill": "farming",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 2000
            },
            {
                "skill": "farming",
                "amount": 3000
            },
            {
                "skill": "firemaking",
                "amount": 4000
            },
            {
                "skill": "woodcutting",
                "amount": 1500
            }
        ],
        "itemRewards": []
    },
    "shades_of_mortton": {
        "name": "Shades of Mort'ton",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "herblore",
                    "level": 15
                },
                {
                    "skill": "firemaking",
                    "level": 5
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 2000
            },
            {
                "skill": "herblore",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "observatory_quest": {
        "name": "Observatory Quest",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 2250
            }
        ],
        "itemRewards": []
    },
    "the_giant_dwarf": {
        "name": "The Giant Dwarf",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "firemaking",
                    "level": 16
                },
                {
                    "skill": "magic",
                    "level": 33
                },
                {
                    "skill": "thieving",
                    "level": 14
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 2500
            },
            {
                "skill": "firemaking",
                "amount": 1500
            },
            {
                "skill": "magic",
                "amount": 1500
            },
            {
                "skill": "mining",
                "amount": 2500
            },
            {
                "skill": "smithing",
                "amount": 2500
            },
            {
                "skill": "thieving",
                "amount": 1500
            }
        ],
        "itemRewards": []
    },
    "nature_spirit": {
        "name": "Nature Spirit",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 3000
            },
            {
                "skill": "defence",
                "amount": 2000
            },
            {
                "skill": "hitpoints",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "the_slug_menace": {
        "name": "The Slug Menace",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "runecraft",
                    "level": 30
                },
                {
                    "skill": "slayer",
                    "level": 30
                },
                {
                    "skill": "thieving",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 3500
            },
            {
                "skill": "runecraft",
                "amount": 3500
            },
            {
                "skill": "thieving",
                "amount": 3500
            }
        ],
        "itemRewards": []
    },
    "shilo_village": {
        "name": "Shilo Village",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 32
                },
                {
                    "skill": "smithing",
                    "level": 4
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 3875
            }
        ],
        "itemRewards": []
    },
    "elemental_workshop_i": {
        "name": "Elemental Workshop I",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "smithing",
                    "level": 20
                },
                {
                    "skill": "mining",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 5000
            },
            {
                "skill": "smithing",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "enakhras_lament": {
        "name": "Enakhra's Lament",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "firemaking",
                    "level": 45
                },
                {
                    "skill": "prayer",
                    "level": 43
                },
                {
                    "skill": "magic",
                    "level": 39
                },
                {
                    "skill": "mining",
                    "level": 45
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 7000
            },
            {
                "skill": "firemaking",
                "amount": 7000
            },
            {
                "skill": "magic",
                "amount": 7000
            },
            {
                "skill": "mining",
                "amount": 7000
            }
        ],
        "itemRewards": []
    },
    "elemental_workshop_ii": {
        "name": "Elemental Workshop II",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "magic",
                    "level": 20
                },
                {
                    "skill": "smithing",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 7500
            },
            {
                "skill": "smithing",
                "amount": 7500
            }
        ],
        "itemRewards": []
    },
    "the_hand_in_the_sand": {
        "name": "The Hand in the Sand",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 17
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 9000
            },
            {
                "skill": "thieving",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "the_fremennik_exiles": {
        "name": "The Fremennik Exiles",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 60
                },
                {
                    "skill": "smithing",
                    "level": 60
                },
                {
                    "skill": "fishing",
                    "level": 60
                },
                {
                    "skill": "runecraft",
                    "level": 55
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "crafting",
                "amount": 50000
            },
            {
                "skill": "runecraft",
                "amount": 30000
            },
            {
                "skill": "slayer",
                "amount": 50000
            }
        ],
        "itemRewards": []
    },
    "a_souls_bane": {
        "name": "A Soul's Bane",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 500
            },
            {
                "skill": "hitpoints",
                "amount": 500
            }
        ],
        "itemRewards": []
    },
    "what_lies_below": {
        "name": "What Lies Below",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "runecraft",
                    "level": 35
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 2000
            },
            {
                "skill": "runecraft",
                "amount": 8000
            }
        ],
        "itemRewards": []
    },
    "between_a_rock": {
        "name": "Between a Rock...",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "mining",
                    "level": 40
                },
                {
                    "skill": "smithing",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 5000
            },
            {
                "skill": "mining",
                "amount": 5000
            },
            {
                "skill": "smithing",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "olafs_quest": {
        "name": "Olaf's Quest",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "firemaking",
                    "level": 40
                },
                {
                    "skill": "woodcutting",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 12000
            }
        ],
        "itemRewards": []
    },
    "holy_grail": {
        "name": "Holy Grail",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "attack",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 15300
            },
            {
                "skill": "prayer",
                "amount": 11000
            }
        ],
        "itemRewards": []
    },
    "dragon_slayer_i": {
        "name": "Dragon Slayer I",
        "members": false,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 32
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 18650
            },
            {
                "skill": "strength",
                "amount": 18650
            }
        ],
        "itemRewards": []
    },
    "kings_ransom": {
        "name": "King's Ransom",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "magic",
                    "level": 45
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "defence",
                "amount": 33000
            },
            {
                "skill": "magic",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "garden_of_tranquillity": {
        "name": "Garden of Tranquillity",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "farming",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "my_arms_big_adventure": {
        "name": "My Arm's Big Adventure",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "woodcutting",
                    "level": 10
                },
                {
                    "skill": "herblore",
                    "level": 31
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "farming",
                "amount": 5000
            },
            {
                "skill": "herblore",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "rum_deal": {
        "name": "Rum Deal",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 42
                },
                {
                    "skill": "prayer",
                    "level": 47
                },
                {
                    "skill": "slayer",
                    "level": 42
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "farming",
                "amount": 7000
            },
            {
                "skill": "fishing",
                "amount": 7000
            },
            {
                "skill": "prayer",
                "amount": 7000
            }
        ],
        "itemRewards": []
    },
    "the_garden_of_death": {
        "name": "The Garden of Death",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "farming",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "while_guthix_sleeps": {
        "name": "While Guthix Sleeps",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 72
                },
                {
                    "skill": "magic",
                    "level": 67
                },
                {
                    "skill": "agility",
                    "level": 66
                },
                {
                    "skill": "herblore",
                    "level": 65
                },
                {
                    "skill": "hunter",
                    "level": 62
                },
                {
                    "skill": "defence",
                    "level": 40
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "farming",
                "amount": 75000
            },
            {
                "skill": "herblore",
                "amount": 75000
            },
            {
                "skill": "hunter",
                "amount": 50000
            },
            {
                "skill": "thieving",
                "amount": 80000
            }
        ],
        "itemRewards": []
    },
    "current_affairs": {
        "name": "Current Affairs",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "sailing",
                    "level": 22
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fishing",
                "amount": 1000
            },
            {
                "skill": "sailing",
                "amount": 1400
            }
        ],
        "itemRewards": []
    },
    "fishing_contest": {
        "name": "Fishing Contest",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fishing",
                "amount": 2437
            }
        ],
        "itemRewards": []
    },
    "perilous_moons": {
        "name": "Perilous Moons",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 48
                },
                {
                    "skill": "hunter",
                    "level": 20
                },
                {
                    "skill": "runecraft",
                    "level": 20
                },
                {
                    "skill": "construction",
                    "level": 10
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fishing",
                "amount": 5000
            },
            {
                "skill": "hunter",
                "amount": 5000
            },
            {
                "skill": "runecraft",
                "amount": 5000
            },
            {
                "skill": "slayer",
                "amount": 40000
            }
        ],
        "itemRewards": []
    },
    "sea_slug": {
        "name": "Sea Slug",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "firemaking",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fishing",
                "amount": 7175
            }
        ],
        "itemRewards": []
    },
    "swan_song": {
        "name": "Swan Song",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 100
                },
                {
                    "skill": "magic",
                    "level": 66
                },
                {
                    "skill": "cooking",
                    "level": 62
                },
                {
                    "skill": "smithing",
                    "level": 45
                },
                {
                    "skill": "firemaking",
                    "level": 42
                },
                {
                    "skill": "crafting",
                    "level": 40
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fishing",
                "amount": 50000
            },
            {
                "skill": "magic",
                "amount": 15000
            },
            {
                "skill": "prayer",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "zogre_flesh_eaters": {
        "name": "Zogre Flesh Eaters",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "smithing",
                    "level": 4
                },
                {
                    "skill": "herblore",
                    "level": 8
                },
                {
                    "skill": "ranged",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fletching",
                "amount": 2000
            },
            {
                "skill": "herblore",
                "amount": 2000
            },
            {
                "skill": "ranged",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "devious_minds": {
        "name": "Devious Minds",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "smithing",
                    "level": 65
                },
                {
                    "skill": "runecraft",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fletching",
                "amount": 5000
            },
            {
                "skill": "runecraft",
                "amount": 5000
            },
            {
                "skill": "smithing",
                "amount": 6500
            }
        ],
        "itemRewards": []
    },
    "temple_of_ikov": {
        "name": "Temple of Ikov",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 42
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fletching",
                "amount": 8000
            },
            {
                "skill": "ranged",
                "amount": 10500
            }
        ],
        "itemRewards": []
    },
    "the_final_dawn": {
        "name": "The Final Dawn",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 66
                },
                {
                    "skill": "runecraft",
                    "level": 52
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "fletching",
                "amount": 25000
            },
            {
                "skill": "runecraft",
                "amount": 25000
            },
            {
                "skill": "thieving",
                "amount": 55000
            }
        ],
        "itemRewards": []
    },
    "druidic_ritual": {
        "name": "Druidic Ritual",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "herblore",
                "amount": 250
            }
        ],
        "itemRewards": []
    },
    "jungle_potion": {
        "name": "Jungle Potion",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "herblore",
                "amount": 775
            }
        ],
        "itemRewards": []
    },
    "the_dig_site": {
        "name": "The Dig Site",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 10
                },
                {
                    "skill": "thieving",
                    "level": 25
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "herblore",
                "amount": 2000
            },
            {
                "skill": "mining",
                "amount": 15300
            }
        ],
        "itemRewards": []
    },
    "fairytale_ii_cure_a_queen": {
        "name": "Fairytale II - Cure a Queen",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 40
                },
                {
                    "skill": "farming",
                    "level": 49
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "herblore",
                "amount": 3500
            },
            {
                "skill": "thieving",
                "amount": 2500
            }
        ],
        "itemRewards": []
    },
    "eadgars_ruse": {
        "name": "Eadgar's Ruse",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "herblore",
                "amount": 11000
            }
        ],
        "itemRewards": []
    },
    "witchs_house": {
        "name": "Witch's House",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hitpoints",
                "amount": 6325
            }
        ],
        "itemRewards": []
    },
    "dream_mentor": {
        "name": "Dream Mentor",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 32
                },
                {
                    "skill": "combat level",
                    "level": 85
                },
                {
                    "skill": "crafting",
                    "level": 61
                },
                {
                    "skill": "defence",
                    "level": 40
                },
                {
                    "skill": "firemaking",
                    "level": 49
                },
                {
                    "skill": "herblore",
                    "level": 5
                },
                {
                    "skill": "magic",
                    "level": 65
                },
                {
                    "skill": "mining",
                    "level": 60
                },
                {
                    "skill": "woodcutting",
                    "level": 55
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hitpoints",
                "amount": 15000
            },
            {
                "skill": "magic",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "mournings_end_part_i": {
        "name": "Mourning's End Part I",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "ranged",
                    "level": 60
                },
                {
                    "skill": "thieving",
                    "level": 50
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hitpoints",
                "amount": 25000
            },
            {
                "skill": "thieving",
                "amount": 40000
            }
        ],
        "itemRewards": []
    },
    "natural_history_quiz": {
        "name": "Natural history quiz",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hunter",
                "amount": 1000
            },
            {
                "skill": "slayer",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "the_ascent_of_arceuus": {
        "name": "The Ascent of Arceuus",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hunter",
                "amount": 1500
            },
            {
                "skill": "runecraft",
                "amount": 500
            }
        ],
        "itemRewards": []
    },
    "eagles_peak": {
        "name": "Eagles' Peak",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hunter",
                "amount": 2500
            }
        ],
        "itemRewards": []
    },
    "defender_of_varrock": {
        "name": "Defender of Varrock",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "smithing",
                    "level": 55
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "hunter",
                "amount": 15000
            },
            {
                "skill": "smithing",
                "amount": 15000
            }
        ],
        "itemRewards": []
    },
    "witchs_potion": {
        "name": "Witch's Potion",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 325
            }
        ],
        "itemRewards": []
    },
    "imp_catcher": {
        "name": "Imp Catcher",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 875
            }
        ],
        "itemRewards": []
    },
    "spirits_of_the_elid": {
        "name": "Spirits of the Elid",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 37
                },
                {
                    "skill": "ranged",
                    "level": 37
                },
                {
                    "skill": "mining",
                    "level": 37
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 1000
            },
            {
                "skill": "prayer",
                "amount": 8000
            },
            {
                "skill": "thieving",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "horror_from_the_deep": {
        "name": "Horror from the Deep",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 35
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 4662.5
            },
            {
                "skill": "ranged",
                "amount": 4662.5
            },
            {
                "skill": "strength",
                "amount": 4662.5
            }
        ],
        "itemRewards": []
    },
    "lunar_diplomacy": {
        "name": "Lunar Diplomacy",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 61
                },
                {
                    "skill": "defence",
                    "level": 40
                },
                {
                    "skill": "firemaking",
                    "level": 49
                },
                {
                    "skill": "herblore",
                    "level": 5
                },
                {
                    "skill": "mining",
                    "level": 60
                },
                {
                    "skill": "woodcutting",
                    "level": 55
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 5000
            },
            {
                "skill": "runecraft",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "the_path_of_glouphrie": {
        "name": "The Path of Glouphrie",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "strength",
                    "level": 60
                },
                {
                    "skill": "slayer",
                    "level": 56
                },
                {
                    "skill": "thieving",
                    "level": 56
                },
                {
                    "skill": "ranged",
                    "level": 47
                },
                {
                    "skill": "agility",
                    "level": 45
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 5000
            },
            {
                "skill": "slayer",
                "amount": 20000
            },
            {
                "skill": "strength",
                "amount": 30000
            },
            {
                "skill": "thieving",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "watchtower": {
        "name": "Watchtower",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 15
                },
                {
                    "skill": "agility",
                    "level": 25
                },
                {
                    "skill": "herblore",
                    "level": 14
                },
                {
                    "skill": "mining",
                    "level": 40
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 15250
            }
        ],
        "itemRewards": []
    },
    "desert_treasure_i": {
        "name": "Desert Treasure I",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 53
                },
                {
                    "skill": "firemaking",
                    "level": 50
                },
                {
                    "skill": "slayer",
                    "level": 10
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "magic",
                "amount": 20000
            }
        ],
        "itemRewards": []
    },
    "the_forsaken_tower": {
        "name": "The Forsaken Tower",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "mining",
                "amount": 500
            },
            {
                "skill": "smithing",
                "amount": 500
            }
        ],
        "itemRewards": []
    },
    "dorics_quest": {
        "name": "Doric's Quest",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "mining",
                "amount": 1300
            }
        ],
        "itemRewards": []
    },
    "plague_city": {
        "name": "Plague City",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "mining",
                "amount": 2425
            }
        ],
        "itemRewards": []
    },
    "another_slice_of_h_a_m": {
        "name": "Another Slice of H.A.M.",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "attack",
                    "level": 15
                },
                {
                    "skill": "prayer",
                    "level": 25
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "mining",
                "amount": 3000
            },
            {
                "skill": "prayer",
                "amount": 3000
            }
        ],
        "itemRewards": []
    },
    "the_lost_tribe": {
        "name": "The Lost Tribe",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 13
                },
                {
                    "skill": "thieving",
                    "level": 13
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "mining",
                "amount": 3000
            }
        ],
        "itemRewards": []
    },
    "the_restless_ghost": {
        "name": "The Restless Ghost",
        "members": false,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "prayer",
                "amount": 1125
            }
        ],
        "itemRewards": []
    },
    "priest_in_peril": {
        "name": "Priest in Peril",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "prayer",
                "amount": 1406
            }
        ],
        "itemRewards": []
    },
    "ghosts_ahoy": {
        "name": "Ghosts Ahoy",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 25
                },
                {
                    "skill": "cooking",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "prayer",
                "amount": 2400
            }
        ],
        "itemRewards": []
    },
    "rag_and_bone_man_ii": {
        "name": "Rag and Bone Man II",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 40
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "prayer",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "his_faithful_servants": {
        "name": "His Faithful Servants",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "prayer",
                "amount": 20000
            }
        ],
        "itemRewards": []
    },
    "hopespears_will": {
        "name": "Hopespear's Will",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "prayer",
                "amount": 38750
            }
        ],
        "itemRewards": []
    },
    "death_to_the_dorgeshuun": {
        "name": "Death to the Dorgeshuun",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "thieving",
                    "level": 23
                },
                {
                    "skill": "agility",
                    "level": 23
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "ranged",
                "amount": 2000
            },
            {
                "skill": "thieving",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "enter_the_abyss": {
        "name": "Enter the Abyss",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "runecraft",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "temple_of_the_eye": {
        "name": "Temple of the Eye",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "runecraft",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "pandemonium": {
        "name": "Pandemonium",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "sailing",
                "amount": 300
            }
        ],
        "itemRewards": []
    },
    "prying_times": {
        "name": "Prying Times",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "smithing",
                    "level": 30
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "sailing",
                "amount": 800
            },
            {
                "skill": "smithing",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "troubled_tortugans": {
        "name": "Troubled Tortugans",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "slayer",
                    "level": 51
                },
                {
                    "skill": "construction",
                    "level": 48
                },
                {
                    "skill": "hunter",
                    "level": 45
                },
                {
                    "skill": "woodcutting",
                    "level": 40
                },
                {
                    "skill": "crafting",
                    "level": 34
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "sailing",
                "amount": 10000
            },
            {
                "skill": "slayer",
                "amount": 8000
            }
        ],
        "itemRewards": []
    },
    "a_porcine_of_interest": {
        "name": "A Porcine of Interest",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "slayer",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "the_generals_shadow": {
        "name": "The General's Shadow",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 15
                },
                {
                    "skill": "firemaking",
                    "level": 50
                },
                {
                    "skill": "fletching",
                    "level": 10
                },
                {
                    "skill": "herblore",
                    "level": 10
                },
                {
                    "skill": "magic",
                    "level": 50
                },
                {
                    "skill": "ranged",
                    "level": 40
                },
                {
                    "skill": "smithing",
                    "level": 20
                },
                {
                    "skill": "thieving",
                    "level": 53
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "slayer",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "wanted": {
        "name": "Wanted!",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "quest points",
                    "level": 32
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "slayer",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "lair_of_tarn_razorlor": {
        "name": "Lair of Tarn Razorlor",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 15
                },
                {
                    "skill": "crafting",
                    "level": 35
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "slayer",
                "amount": 5000
            }
        ],
        "itemRewards": []
    },
    "sleeping_giants": {
        "name": "Sleeping Giants",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "smithing",
                "amount": 6000
            }
        ],
        "itemRewards": []
    },
    "the_knights_sword": {
        "name": "The Knight's Sword",
        "members": false,
        "requirements": {
            "skills": [
                {
                    "skill": "mining",
                    "level": 10
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "smithing",
                "amount": 12725
            }
        ],
        "itemRewards": []
    },
    "scorpion_catcher": {
        "name": "Scorpion Catcher",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "prayer",
                    "level": 31
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "strength",
                "amount": 6625
            }
        ],
        "itemRewards": []
    },
    "roving_elves": {
        "name": "Roving Elves",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "agility",
                    "level": 56
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "strength",
                "amount": 10000
            }
        ],
        "itemRewards": []
    },
    "haunted_mine": {
        "name": "Haunted Mine",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 35
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "strength",
                "amount": 22000
            }
        ],
        "itemRewards": []
    },
    "creature_of_fenkenstrain": {
        "name": "Creature of Fenkenstrain",
        "members": true,
        "requirements": {
            "skills": [
                {
                    "skill": "crafting",
                    "level": 20
                }
            ],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 1000
            }
        ],
        "itemRewards": []
    },
    "biohazard": {
        "name": "Biohazard",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 1250
            }
        ],
        "itemRewards": []
    },
    "hazeel_cult": {
        "name": "Hazeel Cult",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 1500
            }
        ],
        "itemRewards": []
    },
    "tribal_totem": {
        "name": "Tribal Totem",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 1775
            }
        ],
        "itemRewards": []
    },
    "the_queen_of_thieves": {
        "name": "The Queen of Thieves",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "twilights_promise": {
        "name": "Twilight's Promise",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 3000
            }
        ],
        "itemRewards": []
    },
    "ratcatchers": {
        "name": "Ratcatchers",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 4500
            }
        ],
        "itemRewards": []
    },
    "ethically_acquired_antiquities": {
        "name": "Ethically Acquired Antiquities",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 6000
            }
        ],
        "itemRewards": []
    },
    "contact": {
        "name": "Contact!",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 7000
            }
        ],
        "itemRewards": []
    },
    "the_feud": {
        "name": "The Feud",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "thieving",
                "amount": 15000
            }
        ],
        "itemRewards": []
    },
    "monks_friend": {
        "name": "Monk's Friend",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "woodcutting",
                "amount": 2000
            }
        ],
        "itemRewards": []
    },
    "the_ribbiting_tale_of_a_lily_pad_labour_dispute": {
        "name": "The Ribbiting Tale of a Lily Pad Labour Dispute",
        "members": true,
        "requirements": {
            "skills": [],
            "quests": []
        },
        "xpRewards": [
            {
                "skill": "woodcutting",
                "amount": 2000
            }
        ],
        "itemRewards": []
    }
};

export const QUEST_LIST = Object.entries(QUESTS).map(([key, q]) => ({
    key,
    name: q.name,
    requirements: q.requirements || {},
    xpRewards: q.xpRewards || [],
    itemRewards: q.itemRewards || [],
}));
