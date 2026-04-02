import {
    SKILLS,
    STARTING_LEVEL,
    HITPOINTS_STARTING_LEVEL,
    HITPOINTS_STARTING_XP,
    BASE_XP_MULTIPLIER,
    DEFAULT_LEAGUE_TIERS,
} from "./constants.js";

/** Convert cumulative XP to the corresponding OSRS skill level (1–99). */
export function experienceToLevel(experience) {
    const safeExperience = Math.max(0, Number(experience) || 0);
    let points = 0;
    let output = 0;
    for (let level = 1; level <= 99; level++) {
        points += Math.floor(level + 300 * Math.pow(2, level / 7));
        const threshold = Math.floor(points / 4);
        if (threshold > safeExperience) {
            return level;
        }
        output = level;
    }
    return Math.max(1, output);
}

/** Return a fresh per-skill XP map with Hitpoints pre-seeded. */
export function emptySkillExperience() {
    const experience = Object.fromEntries(SKILLS.map(skill => [skill, 0]));
    experience.hitpoints = HITPOINTS_STARTING_XP;
    return experience;
}

/** Return a fresh per-skill level map with Hitpoints pre-seeded. */
export function emptySkillLevels() {
    const levels = Object.fromEntries(SKILLS.map(skill => [skill, STARTING_LEVEL]));
    levels.hitpoints = HITPOINTS_STARTING_LEVEL;
    return levels;
}

/**
 * Return the XP multiplier that applies once the player has accumulated
 * the given number of league points.
 */
export function getXpMultiplier(points, tiers = DEFAULT_LEAGUE_TIERS) {
    let multiplier = BASE_XP_MULTIPLIER;
    for (const tier of tiers) {
        if (points >= tier.pointsRequired) {
            multiplier = tier.xpMultiplier;
        }
    }
    return multiplier;
}
