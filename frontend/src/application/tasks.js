import { getMethod, getMethodsForSkill, getSkillOptions } from "./skill-methods.js";

// ---------------------------------------------------------------------------
// XP / level utilities (mirrors planner.js for frontend use)
// ---------------------------------------------------------------------------

const XP_TABLE = (() => {
    const table = [0];
    for (let lvl = 1; lvl <= 99; lvl++) {
        let total = 0;
        for (let i = 1; i < lvl; i++) {
            total += Math.floor(i + 300 * Math.pow(2, i / 7));
        }
        table[lvl] = Math.floor(total / 4);
    }
    return table;
})();

function levelForXp(xp) {
    for (let lvl = 99; lvl >= 1; lvl--) {
        if (xp >= XP_TABLE[lvl]) return lvl;
    }
    return 1;
}

// ---------------------------------------------------------------------------
// Passive task triggers: auto-inserted when any non-HP skill first reaches
// the given level through actions in the queue.
// ---------------------------------------------------------------------------

const PASSIVE_TASK_TRIGGERS = [
    { key: "achieve_your_first_level_up", minLevel: 2 },
    { key: "achieve_your_first_level_5",  minLevel: 5 },
    { key: "achieve_your_first_level_10", minLevel: 10 },
    { key: "achieve_your_first_level_20", minLevel: 20 },
    { key: "achieve_your_first_level_30", minLevel: 30 },
    { key: "achieve_your_first_level_40", minLevel: 40 },
    { key: "achieve_your_first_level_50", minLevel: 50 },
    { key: "achieve_your_first_level_60", minLevel: 60 },
    { key: "achieve_your_first_level_70", minLevel: 70 },
    { key: "achieve_your_first_level_80", minLevel: 80 },
    { key: "achieve_your_first_level_90", minLevel: 90 },
    { key: "achieve_your_first_level_95", minLevel: 95 },
];

export function taskManager() {
    const SKILLS = [
        "attack", "hitpoints", "mining", "strength", "agility", "smithing",
        "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
        "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
        "runecraft", "slayer", "farming", "construction", "hunter",
    ];

    // Skills used for "first level X" milestone checks – excludes hitpoints
    // because HP starts at level 10 in OSRS and should not pre-trigger milestones.
    const MILESTONE_SKILLS = SKILLS.filter(sk => sk !== "hitpoints");

    const emptySkillExperience = () => Object.fromEntries(SKILLS.map(skill => [skill, 0]));

    const RELIC_LIST = [
        ["Endless Harvest", "Barbarian Gathering", "Abundance"],
        ["Woodsman",],
        ["Evil Eye"],
        ["Conniving Clues"],
        ["Nature's Accord"],
        ["Culling Spree"],
        ["Minion", "Flask of Fervour"]
    ];
    const RELIC_POINTS_TIER = [0, 750, 1500, 2500, 3500, 5000, 10000, 15000];

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
        baseXpMultiplier: 5,
        init() {
            // Read base multiplier from the page config (set by Django template).
            this.baseXpMultiplier = window.PLANNER_CONFIG?.baseXpMultiplier ?? 5;

            window.addEventListener('add-task', (event) => {
                console.log("Adding task", event);
                this.openModal();
            });
            window.addEventListener('add-skill', (event) => {
                console.log("Adding skill", event);
                this.openModal("skill-list-template");
            });
            fetch('http://127.0.0.1:8002/planner/task-list/')
                .then(res => res.json())
                .then(data => {
                    this.taskList = data["tasks"];
                    console.log(this.taskList);
                });
        },
        openModal(content="task-list-template") {
            this.showModal = true;
            const template = document.getElementById(content);
            const modalContent = document.getElementById('modalContent');

            if (!template || !modalContent) return;

            modalContent.innerHTML = '';
            modalContent.appendChild(template.content.cloneNode(true));

            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        addTask(task_key) {
            console.log("Adding task", task_key);
            const task = this.taskList.find(task => task.key === task_key);
            if (task) {
                task.type = "task";
                task.selected = false;
                this.actions.push(task);
                this.totalTasks += 1;
                this.syncPassiveTasks();
            }
            this.closeModal();
        },
        selectTask(taskKey) {
            if (this.selectedTask != null) {
                this.selectedTask.selected = false;
            }
            if (this.selectedTask === taskKey) {
                this.selectedTask = null;
                return;
            }
            this.selectedTask = this.actions.find(task => task.key === taskKey);
            this.selectedTask.selected = true;
        },
        removeTask(taskKey) {
            const taskToRemove = this.actions.find(task => task.key === taskKey);
            this.actions = this.actions.filter(task => task.key !== taskKey);
            if (taskToRemove && !taskToRemove.passive) {
                const isLibraryTask = this.taskList.find(task => task.key === taskKey);
                if (isLibraryTask) {
                    this.totalTasks -= 1;
                }
            }
            this.syncPassiveTasks();
        },
        addRelic(relicKey) {
            console.log("Adding relic", relicKey);
            const relic = {
                key: relicKey,
                name: relicKey,
                type: "relic"
            };
            this.actions.push(relic);
            this.relicSelection.push(relicKey);
            this.recalculateActionState();
            this.closeModal();
        },
        getSkillExperience(action) {
            // Loop through all actions up to the current action and calculate experience
            // for all skills
            let experience = 0;
            for (const act of this.actions) {
                if (act.key === action.key) break;
                experience += act.experience;
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
                this.openModal('relic-list-template');
            }
        },
        addSkillAction(skill, method, quantity, xpPerAction) {
            console.log("Adding skill action", skill, method, quantity, xpPerAction);
            const safeQuantity = Number(quantity) || 0;
            const safeXpPerAction = Number(xpPerAction) || 0;
            const skillAction = {
                key: `${skill}-${method}-${Date.now()}`,
                name: skill,
                skill: skill,
                skillKey: (skill || "").toLowerCase(),
                method: method,
                quantity: safeQuantity,
                xpPerAction: safeXpPerAction,
                type: "skill",
            };
            this.actions.push(skillAction);
            this.syncPassiveTasks();
            this.closeModal();
        },
        recalculateActionState() {
            let runningPoints = 0;
            let runningExperience = 0;
            const runningBySkill = emptySkillExperience();
            // Observe the current multiplier as it may change via tier-unlock actions.
            let currentMult = this.baseXpMultiplier;

            this.actions.forEach(action => {
                runningPoints += Number(action.league_points || 0);
                action.cumulativePoints = runningPoints;

                const actionExperienceBySkill = emptySkillExperience();
                if (action.type === "skill" && action.skillKey && SKILLS.includes(action.skillKey)) {
                    // Apply the current XP multiplier (default 5x) to every skill action.
                    actionExperienceBySkill[action.skillKey] =
                        (Number(action.quantity) || 0) * (Number(action.xpPerAction) || 0) * currentMult;
                }

                Object.entries(actionExperienceBySkill).forEach(([skill, xp]) => {
                    runningBySkill[skill] += xp;
                });

                action.experienceBySkill = actionExperienceBySkill;
                action.totalExperienceGain = Object.values(actionExperienceBySkill).reduce((sum, xp) => sum + xp, 0);
                runningExperience += action.totalExperienceGain;
                action.cumulativeExperience = runningExperience;
                action.cumulativeExperienceBySkill = { ...runningBySkill };
                // Record the multiplier in effect when this action's XP was added.
                action.currentMultiplier = currentMult;
            });

            this.totalPoints = runningPoints;
            this.skillExperience = { ...runningBySkill };
        },

        /**
         * Automatically insert passive milestone tasks (e.g. "Achieve Your First
         * Level 5") into the actions queue at the position where the milestone is
         * first crossed by any non-HP skill.  Existing passive entries are removed
         * and rebuilt on every call so the queue stays correct after edits.
         */
        syncPassiveTasks() {
            // Work from the non-passive actions to determine insertion points.
            const nonPassiveActions = this.actions.filter(a => !a.passive);

            // Per-skill XP accumulated through actions (all start at 0).
            const skillXp = emptySkillExperience();

            let currentMult = this.baseXpMultiplier;
            let maxLevelReached = 1; // starts at 1 (all non-HP skills begin at level 1)

            // Map: trigger key → index in nonPassiveActions after which to insert.
            const insertAfterIndex = {};

            nonPassiveActions.forEach((action, idx) => {
                const prevMaxLevel = maxLevelReached;

                if (action.type === "skill" && action.skillKey && SKILLS.includes(action.skillKey)) {
                    const xpGain =
                        (Number(action.quantity) || 0) *
                        (Number(action.xpPerAction) || 0) *
                        currentMult;
                    skillXp[action.skillKey] = (skillXp[action.skillKey] || 0) + xpGain;
                }

                // Determine the highest level any non-HP skill has reached so far.
                const newMaxLevel = Math.max(
                    ...MILESTONE_SKILLS.map(sk => levelForXp(skillXp[sk] || 0))
                );
                maxLevelReached = newMaxLevel;

                // Check each passive trigger once.
                for (const trigger of PASSIVE_TASK_TRIGGERS) {
                    if (insertAfterIndex[trigger.key] !== undefined) continue;
                    if (prevMaxLevel < trigger.minLevel && newMaxLevel >= trigger.minLevel) {
                        insertAfterIndex[trigger.key] = idx;
                    }
                }
            });

            // Group insertions by their target index; sort each group by minLevel.
            const insertionsByIndex = {};
            for (const [key, idx] of Object.entries(insertAfterIndex)) {
                const taskDef = this.taskList.find(t => t.key === key);
                if (!taskDef) continue; // task library not yet loaded – skip silently
                if (!insertionsByIndex[idx]) insertionsByIndex[idx] = [];
                insertionsByIndex[idx].push({
                    ...taskDef,
                    type: "task",
                    passive: true,
                    selected: false,
                });
            }
            for (const group of Object.values(insertionsByIndex)) {
                group.sort((a, b) => {
                    const aMin = PASSIVE_TASK_TRIGGERS.find(t => t.key === a.key)?.minLevel ?? 0;
                    const bMin = PASSIVE_TASK_TRIGGERS.find(t => t.key === b.key)?.minLevel ?? 0;
                    return aMin - bMin;
                });
            }

            // Rebuild the actions array with passive tasks inserted at the right spots.
            const newActions = [];
            nonPassiveActions.forEach((action, idx) => {
                newActions.push(action);
                if (insertionsByIndex[idx]) {
                    newActions.push(...insertionsByIndex[idx]);
                }
            });

            this.actions = newActions;
            this.recalculateActionState();
        },

    };
}
