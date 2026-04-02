import { getMethod, getMethodsForSkill, getSkillOptions } from "./skill-methods.js";

export function taskManager() {
    const SKILLS = [
        "attack", "hitpoints", "mining", "strength", "agility", "smithing",
        "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
        "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
        "runecraft", "slayer", "farming", "construction", "hunter",
    ];
    // const SKILL_LABELS = {
    //     attack: "Attack", hitpoints: "Hitpoints", mining: "Mining",
    //     strength: "Strength", agility: "Agility", smithing: "Smithing",
    //     defence: "Defence", herblore: "Herblore", fishing: "Fishing",
    //     ranged: "Ranged", thieving: "Thieving", cooking: "Cooking",
    //     prayer: "Prayer", crafting: "Crafting", firemaking: "Firemaking",
    //     magic: "Magic", fletching: "Fletching", woodcutting: "Woodcutting",
    //     runecraft: "Runecraft", slayer: "Slayer", farming: "Farming",
    //     construction: "Construction", hunter: "Hunter",
    // };

    /** Pre-compute the XP required for each level 1-99 using the OSRS formula. */
    // const XP_TABLE = (() => {
    //     const table = [0]; // index 0 unused; index 1 = XP for level 1 = 0
    //     for (let lvl = 1; lvl <= 99; lvl++) {
    //         let total = 0;
    //         for (let i = 1; i < lvl; i++) {
    //         total += Math.floor(i + 300 * Math.pow(2, i / 7));
    //         }
    //         table[lvl] = Math.floor(total / 4);
    //     }
    //     return table;
    // })();

    // function levelForXp(xp) {
    //     for (let lvl = 99; lvl >= 1; lvl--) {
    //         if (xp >= XP_TABLE[lvl]) return lvl;
    //     }
    //     return 1;
    // }

    // function xpForLevel(lvl) {
    //     return XP_TABLE[Math.max(1, Math.min(99, lvl))];
    // }

    const STARTING_LEVEL = 1;
    const HITPOINTS_STARTING_LEVEL = 10;
    const HITPOINTS_STARTING_XP = 1154;

    const emptySkillExperience = () => {
        const experience = Object.fromEntries(SKILLS.map(skill => [skill, 0]));
        experience.hitpoints = HITPOINTS_STARTING_XP;
        return experience;
    };

    const emptySkillLevels = () => {
        const levels = Object.fromEntries(SKILLS.map(skill => [skill, STARTING_LEVEL]));
        levels.hitpoints = HITPOINTS_STARTING_LEVEL;
        return levels;
    };

    const RELIC_LIST = [
        ["Endless Harvest", "Barbarian Gathering", "Abundance"],
        ["Woodsman"],
        ["Evil Eye"],
        ["Conniving Clues"],
        ["Nature's Accord"],
        ["Culling Spree"],
        ["Minion", "Flask of Fervour"],
    ];
    const RELICS = {
        "endless_harvest": {
            name: "Endless Harvest",
            tier: 1
        },
        "barbarian_gathering": {
            name: "Barbarian Gathering",
            tier: 1
        },
        "abundance": {
            name: "Abundance",
            tier: 1
        }
    };
    const RELIC_POINTS_TIER = [0, 750, 1500, 2500, 3500, 5000, 10000, 15000];

    const BASE_XP_MULTIPLIER = 5.0;
    const DEFAULT_LEAGUE_TIERS = [
        { pointsRequired: 500, xpMultiplier: 5.0 },
        { pointsRequired: 1800, xpMultiplier: 5.0 },
        { pointsRequired: 5000, xpMultiplier: 8.0 },
        { pointsRequired: 12000, xpMultiplier: 12.0 },
        { pointsRequired: 21000, xpMultiplier: 16.0 },
        { pointsRequired: 37000, xpMultiplier: 24.0 },
        { pointsRequired: 60000, xpMultiplier: 32.0 },
        { pointsRequired: 80000, xpMultiplier: 48.0 },
        { pointsRequired: 104000, xpMultiplier: 64.0 },
        { pointsRequired: 136000, xpMultiplier: 80.0 },
    ];

    const experienceToLevel = (experience) => {
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
    };

    const evaluatePassiveRequirement = (requirement, skillLevels, totalLevel) => {
        if (!requirement || !requirement.type) {
            return false;
        }
        const targetValue = Number(requirement.value) || 0;
        if (requirement.type === "any_skill_level") {
            return Object.entries(skillLevels).some(([skill, level]) => 
                level >= targetValue && skill !== undefined
            );
        }
        if (requirement.type === "total_level") {
            return totalLevel >= targetValue;
        }
        return false;
    };

    return {
        showModal: false,
        actions: [],
        totalPoints: 0,
        totalTasks: 0,
        taskList: [],
        relicList: RELIC_LIST,
        relicSelection: [],
        currentRelicTier: 0,
        selectedTask: null,
        skillSelection: "",
        methodSelection: "",
        skillQuantity: 1,
        skillOptions: getSkillOptions(),
        skillExperience: emptySkillExperience(),
        skillLevels: emptySkillLevels(),
        viewStats: null,
        totalLevel: SKILLS.length,
        init() {
            window.addEventListener("add-task", (event) => {
                console.log("Adding task", event);
                this.openModal();
            });
            window.addEventListener("add-skill", (event) => {
                console.log("Adding skill", event);
                this.openModal("skill-list-template");
            });
            window.addEventListener("add-destination", (event) => {
                console.log("Adding destination", event);
                this.openModal("destination-template");
            });
            fetch("http://127.0.0.1:8002/planner/task-list/")
                .then(res => res.json())
                .then(data => {
                    this.taskList = data.tasks || [];
                });
        },
        openModal(content = "task-list-template") {
            this.showModal = true;
            const template = document.getElementById(content);
            const modalContent = document.getElementById("modalContent");

            if (!template || !modalContent) return;

            modalContent.innerHTML = "";
            modalContent.appendChild(template.content.cloneNode(true));

            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        addTask(taskKey) {
            console.log("Adding task", taskKey);
            const taskTemplate = this.taskList.find(task => task.key === taskKey);
            if (taskTemplate && !taskTemplate.is_passive) {
                const task = {
                    ...taskTemplate,
                    type: "task",
                    selected: false,
                    currentStats: this.calculateStats()
                };
                this.actions.push(task);
                this.totalTasks += 1;
                this.recalculateActionState();
            }
            this.closeModal();
        },
        selectTask(taskKey) {
            if (this.selectedTask != null) {
                this.selectedTask.selected = false;
            }
            if (this.selectedTask === taskKey) {
                this.selectedTask.selected = false;
                this.selectedTask = null;
                return;
            }
            this.selectedTask = this.actions.find(task => task.key === taskKey);
            this.selectedTask.selected = true;
        },
        removeTask(taskKey) {
            this.actions = this.actions.filter(task => task.key !== taskKey);
            const removedTask = this.taskList.find(task => task.key === taskKey);
            if (removedTask && !removedTask.is_passive) {
                this.totalTasks -= 1;
            }
            this.recalculateActionState();
        },
        addRelic(relicKey) {
            console.log("Adding relic", relicKey);
            const relic = {
                key: relicKey,
                name: RELICS[relicKey].name,
                type: "relic",
                currentStats: this.calculateStats()
            };
            this.actions.push(relic);
            this.relicSelection.push(relicKey);
            this.recalculateActionState();
            this.closeModal();
        },
        getSkillExperience(action) {
            let experience = 0;
            for (const act of this.actions) {
                if (act.key === action.key) break;
                experience += act.experience || 0;
            }
            return experience;
        },
        getMethodOptions() {
            return getMethodsForSkill(this.skillSelection);
        },
        getSelectedMethod() {
            return getMethod(this.skillSelection, this.methodSelection);
        },
        canAddSkillAction() {
            return Boolean(this.skillSelection && this.methodSelection && Number(this.skillQuantity) > 0);
        },
        canPickRelic() {
            if (this.currentRelicTier === 0 && this.relicSelection.length === 0) {
                return true;
            }
            const totalPoints = this.totalPoints;
            for (let i = 0; i < RELIC_POINTS_TIER.length; i++) {
                if (totalPoints >= RELIC_POINTS_TIER[i] && this.currentRelicTier < i) {
                    return true;
                }
            }
            return false;
        },
        pickRelic() {
            if (this.canPickRelic()) {
                this.openModal("relic-list-template");
            }
        },
        addSkillAction(skill, method, quantity) {
            const parsedQuantity = Number(quantity);
            const selectedMethod = getMethod(skill, method);

            if (!selectedMethod || parsedQuantity <= 0) {
                return;
            }

            const skillLabel = this.skillOptions.find((opt) => opt.key === skill)?.label || skill;
            const experience = selectedMethod.xpPerAction * parsedQuantity * (this.getXpMultiplier(this.totalPoints) || 5);
            const skillAction = {
                key: `${skill}-${method}-${Date.now()}`,
                skill,
                skillLabel,
                method,
                methodLabel: selectedMethod.name,
                quantity: parsedQuantity,
                xpPerAction: selectedMethod.xpPerAction,
                experience,
                type: "skill",
            };
            skillAction.currentStats = this.calculateStats(skillAction);

            // Calculate current stats after the skillAction object is created
            console.log("Current skill stats:", skillAction.currentStats);
            this.actions.push(skillAction);
            this.skillSelection = "";
            this.methodSelection = "";
            this.skillQuantity = 1;
            this.recalculateActionState();
            this.closeModal();
        },
        calculateStats(action=null) {
            const stats = {};
            const runningBySkill = { ...this.skillExperience };

            // If we have an action, add its experience to the running totals
            if (action && action.skill && SKILLS.includes(action.skill)) {
                runningBySkill[action.skill] += action.experience || 0;
            }

            // Calculate stats for all 23 skills
            for (const skill of SKILLS) {
                const cumulativeExperience = runningBySkill[skill] || 0;
                const currentLevel = this.skillLevels[skill] || 1;
                const newLevel = experienceToLevel(cumulativeExperience);
                const levelGain = newLevel - currentLevel;
                const experienceGain = action && action.skill === skill ? (action.experience || 0) : 0;

                stats[skill] = {
                    cumulativeExperience: cumulativeExperience,
                    experienceGain: experienceGain,
                    level: newLevel,
                    levelGain: levelGain,
                };
            }

            return stats;
        },
        syncPassiveTasks() {
            console.log("Syncing passive tasks...");
            const manualActions = this.actions.filter(action => !action.isPassiveAward);
            const passiveTemplates = this.taskList.filter(task => task.is_passive && task.passive_requirement);

            const runningBySkill = Object.fromEntries(SKILLS.map(skill => [skill, 0]));
            let runningPoints = 0;
            const unlockedPassiveKeys = new Set();
            const resultActions = [];

            manualActions.forEach(action => {
                resultActions.push(action);

                if (action.skill && SKILLS.includes(action.skill)) {
                    const baseXp = (Number(action.quantity) || 0) * (Number(action.xpPerAction) || 0) * (this.getXpMultiplier(runningPoints) || 5);
                    runningBySkill[action.skill] += baseXp;
                }
                runningPoints += Number(action.league_points || 0);

                const levelsBySkill = Object.fromEntries(
                    Object.entries(runningBySkill).map(([skill, xp]) => [skill, experienceToLevel(xp)]),
                );
                const totalLevel = Object.values(levelsBySkill).reduce((sum, lvl) => sum + lvl, 0);

                passiveTemplates.forEach(task => {
                    if (!unlockedPassiveKeys.has(task.key) &&
                        evaluatePassiveRequirement(task.passive_requirement, levelsBySkill, totalLevel)) {
                        unlockedPassiveKeys.add(task.key);
                        resultActions.push({
                            ...task,
                            type: "task",
                            selected: false,
                            isPassiveAward: true,
                        });
                    }
                });
            });

            this.actions = resultActions;
        },
        recalculateActionState() {
            console.log("Recalculating action state...");
            this.syncPassiveTasks();

            let runningPoints = 0;
            let runningExperience = 0;
            const runningBySkill = emptySkillExperience();

            this.actions.forEach(action => {
                const currentMultiplier = this.getXpMultiplier(runningPoints);
                runningPoints += Number(action.league_points || 0);
                action.cumulativePoints = runningPoints;

                const actionExperienceBySkill = Object.fromEntries(SKILLS.map(skill => [skill, 0]));
                if (action.skill && SKILLS.includes(action.skill)) {
                    const baseXp = (Number(action.quantity) || 0) * (Number(action.xpPerAction) || 0) * (this.getXpMultiplier(runningPoints) || 5);
                    actionExperienceBySkill[action.skill] = baseXp;
                    action.currentMultiplier = currentMultiplier;
                    action.effectiveExperience = baseXp * currentMultiplier;
                }

                Object.entries(actionExperienceBySkill).forEach(([skill, xp]) => {
                    runningBySkill[skill] += xp;
                });

                action.experienceBySkill = actionExperienceBySkill;
                action.totalExperienceGain = Object.values(actionExperienceBySkill).reduce((sum, xp) => sum + xp, 0);
                runningExperience += action.totalExperienceGain;
                action.cumulativeExperience = runningExperience;
                action.cumulativeExperienceBySkill = { ...runningBySkill };
            });

            this.totalPoints = runningPoints;
            this.skillExperience = { ...runningBySkill };
            this.skillLevels = Object.fromEntries(
                Object.entries(runningBySkill).map(([skill, xp]) => [skill, experienceToLevel(xp)]),
            );
            this.totalLevel = Object.values(this.skillLevels).reduce((sum, lvl) => sum + lvl, 0);
            this.totalTasks = this.actions.filter(action => action.type === "task").length;
        },
        addDestination(destination) {
            this.closeModal();
            if (!destination) return;
    
            this.actions.push({
                key: `destination_${this.actions.length}`,
                type: "destination",
                description: destination,
            });
        },
        showStats(skillKey) {
            console.log("Showing stats for skill:", skillKey);
            this.viewStats = this.actions.find(action => action.key === skillKey);
            console.log("Current skill stats:", this.viewStats.currentStats);
            if (!this.viewStats) return;

            // Show skill details in a modal 
            this.openModal('stats-template');
        },
        getXpMultiplier(points, tiers=DEFAULT_LEAGUE_TIERS) {
            let multiplier = BASE_XP_MULTIPLIER;
            for (const tier of tiers) {
                if (points >= tier.pointsRequired) {
                    multiplier = tier.xpMultiplier;
                }
            }
            return multiplier;
        }
    };
}
