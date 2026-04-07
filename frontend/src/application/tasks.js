import { getMethod, getMethodsForSkill, getSkillOptions } from "./skill-methods.js";
import { ITEMS, STARTER_ITEMS } from "./items.js";
import { getLootTable } from "./loot-tables.js";
import { SHOPS, SHOP_LIST } from "./shops.js";
import { QUESTS, QUEST_LIST } from "./quests.js";
import { CREATURES } from "./creatures.js";
import { SKILLS, RELIC_LIST, RELICS, RELIC_POINTS_TIER, REGIONS } from "./constants.js";
import {
    experienceToLevel,
    emptySkillExperience,
    emptySkillLevels,
    getXpMultiplier,
    getCombatLevel
} from "./experience.js";

const STORAGE_KEY_CURRENT = 'leagues_planner_current';

/**
 * Formats a probability as a human-readable fraction (e.g. 0.0588… → "1/17")
 * or percentage when no clean fraction exists.
 */
function formatChance(chance) {
    const n = Math.round(1 / chance);
    if (n > 1 && Math.abs(chance - 1 / n) < 1e-6) return `1/${n}`;
    return `${(chance * 100).toFixed(1)}%`;
}

/**
 * Resolves all item yields for a skill method into a normalised list.
 * RNG drops (chance < 1) contribute their expected value to `quantity`.
 * Both inline `itemYields[].chance` and `lootTableKey` references are handled.
 */
function resolveMethodYields(method, quantity) {
    const results = [];

    for (const yieldDef of (method.itemYields || [])) {
        const chance = yieldDef.chance ?? 1;
        const isRng = chance < 1;
        results.push({
            item: yieldDef.item,
            name: ITEMS[yieldDef.item]?.name ?? yieldDef.item,
            quantity: Math.floor(yieldDef.quantity * quantity * chance),
            chance: isRng ? chance : null,
            chanceLabel: isRng ? formatChance(chance) : null,
            isRng,
        });
    }

    const lootTable = method.lootTableKey ? getLootTable(method.lootTableKey) : null;
    if (lootTable) {
        for (const drop of lootTable.drops) {
            const chance = drop.chance ?? 1;
            const isRng = chance < 1;
            results.push({
                item: drop.item,
                name: ITEMS[drop.item]?.name ?? drop.item,
                quantity: Math.floor(drop.quantity * quantity * chance),
                chance: isRng ? chance : null,
                chanceLabel: isRng ? formatChance(chance) : null,
                isRng,
            });
        }
    }

    return results;
}
const STORAGE_KEY_ROUTES = 'leagues_planner_routes';

export function taskManager() {
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
        combatStyle: "",
        combatCreature: "",
        combatQuantity: 1,
        skillOptions: getSkillOptions(),
        skillExperience: emptySkillExperience(),
        skillLevels: emptySkillLevels(),
        itemRepository: {},
        shopList: SHOP_LIST,
        shopSelection: "",
        shopCart: {},
        questList: QUEST_LIST.map(q => ({
            ...q,
            itemRewards: q.itemRewards.map(ir => ({ ...ir, name: ITEMS[ir.item]?.name || ir.item })),
        })),
        questSearch: "",
        viewStats: null,
        totalLevel: SKILLS.length,
        editingAction: null,
        editFormData: {},
        regions: REGIONS,
        unlockedRegions: [],
        regionFilter: null,
        taskSortField: 'name',
        taskSortDir: 1,
        savedRoutes: [],
        newRouteName: '',
        currentRouteName: '',
        changingRelicTier: null,
        addingGroup: false,
        newGroupName: '',

        init() {
            window.addEventListener("add-task", () => this.openModal());
            window.addEventListener("add-skill", () => this.openModal("skill-list-template"));
            window.addEventListener("add-combat", () => this.openModal("combat-template"));
            window.addEventListener("add-destination", () => this.openModal("destination-template"));
            window.addEventListener("buy-items", () => { this.shopSelection = ""; this.shopCart = {}; this.openModal("shop-template"); });
            window.addEventListener("complete-quest", () => { this.questSearch = ""; this.openModal("quest-list-template"); });
            fetch("http://127.0.0.1:8002/planner/task-list/")
                .then(res => res.json())
                .then(data => {
                    this.taskList = data.tasks || [];
                    this._restoreFromLocalStorage();
                });

            this.unlockedRegions.push(REGIONS.varlamore, REGIONS.karamja);
            this.addTask("open_the_leagues_menu");
            this.addTask("complete_the_leagues_tutorial");
            if (!this.itemRepository || Object.keys(this.itemRepository).length === 0) {
                this.itemRepository = { ...STARTER_ITEMS };
            }
        },

        openModal(content = "task-list-template") {
            this.showModal = true;
            const template = document.getElementById(content);
            const modalContent = document.getElementById("modalContent");
            if (!template || !modalContent) return;
            modalContent.innerHTML = "";
            modalContent.appendChild(template.content.cloneNode(true));
        },

        closeModal() {
            this.showModal = false;
        },

        cancelModal() {
            this.showModal = false;
            window._pendingActionLatlng = null;
        },

        // Insert action after the currently-selected action, or append to end
        _insertAction(action) {
            if (this.selectedTask) {
                const idx = this.actions.findIndex(a => a.key === this.selectedTask.key);
                if (idx !== -1) {
                    this.actions.splice(idx + 1, 0, action);
                    return;
                }
            }
            this.actions.push(action);
        },

        currentExpModifier() {
            return getXpMultiplier(this.totalPoints) || 5;
        },

        filteredTasks() {
            const actionKeys = new Set(this.actions.map(a => a.key));
            if (this.regionFilter == null) {
                return this.taskList.filter(task => {
                    if (actionKeys.has(task.key) || !task.selectable) return false;
                    if (!this.unlockedRegions.some(region => region.key.toLowerCase() === task.region.toLowerCase()) && task.region != "General") return false;
                    return true;
                });
            }
            return this.taskList.filter(task => {
                if (actionKeys.has(task.key) || !task.selectable) return false;
                // Tasks with no region are always available (global)
                if (!task.region) return true;
                // Region-specific tasks require the region to be unlocked
                if ((!this.unlockedRegions.some(region => region.key.toLowerCase() === task.region.toLowerCase())) && task.region.toLowerCase() !== "general") return false;
                // If a region filter is active, only show tasks from that region
                if (this.regionFilter && task.region.toLowerCase() !== this.regionFilter.toLowerCase()) return false;
                return true;
            });
        },

        setRegionFilter(regionKey) {
            this.regionFilter = this.regionFilter === regionKey ? null : regionKey;
        },

        setTaskSort(field) {
            if (this.taskSortField === field) {
                this.taskSortDir *= -1;
            } else {
                this.taskSortField = field;
                this.taskSortDir = 1;
            }
        },

        sortedFilteredTasks() {
            const tasks = this.filteredTasks();
            const field = this.taskSortField;
            const dir = this.taskSortDir;
            return tasks.slice().sort((a, b) => {
                const av = a[field] ?? '';
                const bv = b[field] ?? '';
                if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
                return String(av).localeCompare(String(bv)) * dir;
            });
        },

        getRegionLabel(regionKey) {
            const region = Object.values(REGIONS).find(r => r.key === regionKey);
            return region ? region.name : regionKey;
        },

        addTask(taskKey) {
            const taskTemplate = this.taskList.find(task => task.key === taskKey);
            const canAdd = taskTemplate && (!taskTemplate.is_passive || taskTemplate.selectable);
            if (canAdd) {
                const action = {
                    ...taskTemplate,
                    type: "task",
                    selected: false,
                    currentStats: this.calculateStats(),
                    totalGold: 0,
                };
                this._insertAction(action);
                if (window._pendingActionLatlng && window.registerActionLatLng) {
                    window.registerActionLatLng(action.key, window._pendingActionLatlng, "league_task");
                    window._pendingActionLatlng = null;
                }
                this.recalculateActionState();
            } else {
                window._pendingActionLatlng = null;
            }
            this.closeModal();
        },

        selectTask(taskKey) {
            if (this.selectedTask != null) {
                this.selectedTask.selected = false;
            }
            if (this.selectedTask && this.selectedTask.key === taskKey) {
                this.selectedTask.selected = false;
                this.selectedTask = null;
                if (window.updateActiveMarker) window.updateActiveMarker(null);
                return;
            }
            this.selectedTask = this.actions.find(task => task.key === taskKey);
            this.selectedTask.selected = true;
            if (window.updateActiveMarker) window.updateActiveMarker(taskKey);
        },

        removeTask(taskKey) {
            // Collect all keys to remove (action + any descendants)
            const keysToRemove = new Set([taskKey]);
            let changed = true;
            while (changed) {
                changed = false;
                for (const action of this.actions) {
                    if (action.parentKey && keysToRemove.has(action.parentKey) && !keysToRemove.has(action.key)) {
                        keysToRemove.add(action.key);
                        changed = true;
                    }
                }
            }

            for (const key of keysToRemove) {
                if (window.removeActionLatLng) window.removeActionLatLng(key);
            }
            this.actions = this.actions.filter(task => !keysToRemove.has(task.key));
            this.recalculateActionState();
        },

        addRelic(relicKey) {
            // When changing a relic, remove the existing one from the same tier first
            if (this.changingRelicTier !== null) {
                const existingRelic = this.relicSelection.find(r => RELICS[r] && RELICS[r].tier === this.changingRelicTier);
                if (existingRelic && existingRelic !== relicKey) {
                    this.relicSelection = this.relicSelection.filter(r => r !== existingRelic);
                    // Replace the old relic action in-place with the new one
                    const idx = this.actions.findIndex(a => a.key === existingRelic);
                    if (idx !== -1) {
                        this.actions[idx] = {
                            key: relicKey,
                            name: RELICS[relicKey].name,
                            type: "relic",
                            currentStats: this.calculateStats(),
                        };
                        if (window.removeActionLatLng) window.removeActionLatLng(existingRelic);
                        this.relicSelection.push(relicKey);
                        this.changingRelicTier = null;
                        this.recalculateActionState();
                        this.closeModal();
                        return;
                    }
                }
                this.changingRelicTier = null;
            }

            const action = {
                key: relicKey,
                name: RELICS[relicKey].name,
                type: "relic",
                currentStats: this.calculateStats(),
            };
            this._insertAction(action);
            this.relicSelection.push(relicKey);
            if (window._pendingActionLatlng && window.registerActionLatLng) {
                window.registerActionLatLng(relicKey, window._pendingActionLatlng, "tier_unlock");
                window._pendingActionLatlng = null;
            }
            this.recalculateActionState();
            this.closeModal();
        },

        removeRelic(relicKey) {
            this.relicSelection = this.relicSelection.filter(key => key !== relicKey);
            this.removeTask(relicKey);
        },

        changeRelic(relicKey) {
            const relic = RELICS[relicKey];
            if (!relic) return;
            this.changingRelicTier = relic.tier;
            this.openModal('relic-list-template');
        },

        getCreature() {
            return CREATURES[this.combatCreature] || null;
        },

        getCreatureOptions() {
            console.log(CREATURES);
            return CREATURES;
        },

        getMethodOptions() {
            return getMethodsForSkill(this.skillSelection);
        },

        getSelectedMethod() {
            return getMethod(this.skillSelection, this.methodSelection);
        },

        canAddSkillAction() {
            if (!this.skillSelection || !this.methodSelection || Number(this.skillQuantity) <= 0) return false;
            const preview = this.getSkillActionPreview();
            return !preview?.hasInsufficientItems;
        },

        getSkillActionPreview() {
            const method = this.getSelectedMethod();
            const skill = this.skillSelection;
            const quantity = Number(this.skillQuantity) || 0;
            if (!method || !skill || quantity <= 0) return null;

            const xpGain = method.xpPerAction * quantity * (getXpMultiplier(this.totalPoints) || 5);
            const currentXp = this.skillExperience[skill] || 0;
            const currentLevel = experienceToLevel(currentXp);
            const newLevel = experienceToLevel(currentXp + xpGain);
            const levelGain = newLevel - currentLevel;

            const itemCosts = (method.itemCosts || []).map(costDef => {
                const needed = costDef.quantity * quantity;
                const available = this.itemRepository[costDef.item] || 0;
                return {
                    item: costDef.item,
                    name: ITEMS[costDef.item]?.name || costDef.item,
                    needed,
                    available,
                    sufficient: available >= needed,
                };
            });

            const itemYields = resolveMethodYields(method, quantity);

            const gold = this.getGold(xpGain, quantity);
            const hasInsufficientItems = itemCosts.some(c => !c.sufficient);

            return { xpGain, currentLevel, newLevel, levelGain, itemCosts, itemYields, gold, hasInsufficientItems, skill };
        },

        getEditActionPreview() {
            const skill = this.editFormData.skill;
            const method = getMethod(skill, this.editFormData.method);
            const quantity = Number(this.editFormData.quantity) || 0;
            if (!method || !skill || quantity <= 0) return null;

            const xpGain = method.xpPerAction * quantity * (getXpMultiplier(this.totalPoints) || 5);
            const currentXp = this.skillExperience[skill] || 0;
            const currentLevel = experienceToLevel(currentXp);
            const newLevel = experienceToLevel(currentXp + xpGain);
            const levelGain = newLevel - currentLevel;

            // Use items available just before this action in the plan
            const editAction = this.actions.find(a => a.key === this.editingAction);
            const actionIndex = editAction ? this.actions.indexOf(editAction) : -1;
            const prevAction = actionIndex > 0 ? this.actions[actionIndex - 1] : null;
            const itemsBeforeAction = prevAction ? (prevAction.cumulativeItems || {}) : {};

            const itemCosts = (method.itemCosts || []).map(costDef => {
                const needed = costDef.quantity * quantity;
                const available = itemsBeforeAction[costDef.item] || 0;
                return {
                    item: costDef.item,
                    name: ITEMS[costDef.item]?.name || costDef.item,
                    needed,
                    available,
                    sufficient: available >= needed,
                };
            });

            const itemYields = resolveMethodYields(method, quantity);

            const gold = this.getGold(xpGain, quantity);
            const hasInsufficientItems = itemCosts.some(c => !c.sufficient);

            return { xpGain, currentLevel, newLevel, levelGain, itemCosts, itemYields, gold, hasInsufficientItems, skill };
        },

        canPickRelic() {
            if (this.currentRelicTier === 0 && this.relicSelection.length === 0) {
                return true;
            }
            const totalPoints = this.totalPoints;
            for (let i = 0; i < RELIC_POINTS_TIER.length; i++) {
                if (totalPoints >= RELIC_POINTS_TIER[i] && this.relicSelection.length-1 < i) {
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
            if (!selectedMethod || parsedQuantity <= 0) return;

            const skillLabel = this.skillOptions.find(opt => opt.key === skill)?.label || skill;
            const experience = selectedMethod.xpPerAction * parsedQuantity * (getXpMultiplier(this.totalPoints) || 5);
            const calculatedGold = ((selectedMethod.gold || 0) * parsedQuantity) + this.getGold(experience, quantity);
            const skillAction = {
                key: `${skill}-${method}-${Date.now()}`,
                skill,
                skillLabel,
                method,
                methodLabel: selectedMethod.name,
                quantity: parsedQuantity,
                xpPerAction: selectedMethod.xpPerAction,
                bonusExp: this.getBonusExp(skill, parsedQuantity, experience),
                experience,
                type: "skill",
                totalGold: calculatedGold,
            };
            skillAction.currentStats = this.calculateStats(skillAction);

            this._insertAction(skillAction);
            if (window._pendingActionLatlng && window.registerActionLatLng) {
                window.registerActionLatLng(skillAction.key, window._pendingActionLatlng, "generic_action");
                window._pendingActionLatlng = null;
            }
            this.skillSelection = "";
            this.methodSelection = "";
            this.skillQuantity = 1;
            this.recalculateActionState();
            this.closeModal();
        },

        addCombatAction(skill, creature, quantity) {
            const parsedQuantity = Number(quantity);
            const selectedCreature = CREATURES[creature];
            if (!selectedCreature || parsedQuantity <= 0) return;

            const skillLabel = this.skillOptions.find(opt => opt.key === skill)?.label || skill;
            const experience = selectedCreature.hitpoints * 4 * parsedQuantity * (getXpMultiplier(this.totalPoints) || 5);
            const hitpointsExperience = experience / 4;
            const skillAction = {
                key: `${skill}-${creature}-${Date.now()}`,
                skill,
                skillLabel,
                creature,
                creatureName: selectedCreature.name,
                quantity: parsedQuantity,
                xpPerAction: selectedCreature.hitpoints * 4,
                hitpointsXpPerAction: selectedCreature.hitpoints,
                hitpointsExperience,
                bonusExp: this.getBonusExp(skill, parsedQuantity, experience),
                experience,
                type: "combat",
                totalGold: this.getGold(experience, quantity),
            };
            skillAction.currentStats = this.calculateStats(skillAction);

            this._insertAction(skillAction);
            if (window._pendingActionLatlng && window.registerActionLatLng) {
                window.registerActionLatLng(skillAction.key, window._pendingActionLatlng, "generic_action");
                window._pendingActionLatlng = null;
            }
            this.combatStyle = "";
            this.combatCreature = "";
            this.combatQuantity = 1;
            this.recalculateActionState();
            this.closeModal();
        },

        getBonusExp(skill, quantity, experience) {
            if (this.relicSelection.includes("barbarian_gathering")) {
                if (["mining", "fishing", "woodcutting"].includes(skill)) {
                    return [
                        { key: `agility-bonusexp-${Date.now()}`, skill: "agility", amount: experience * 0.1 },
                        { key: `strength-bonus-${Date.now()}`, skill: "strength", amount: experience * 0.1 },
                    ];
                }
            }
            if (this.relicSelection.includes("abundance")) {
                return [{
                    key: `${skill}-bonusexp-${Date.now()}`,
                    skill,
                    amount: quantity * 2 * getXpMultiplier(this.totalPoints),
                }];
            }
            return 0;
        },

        getGold(experience, quantity = 1) {
            if (this.relicSelection.includes("abundance")) {
                const bonusExp = quantity * 2 * getXpMultiplier(this.totalPoints);
                return (experience + bonusExp) * 2;
            }
            return 0;
        },

        calculateStats(action = null) {
            const stats = {};
            const runningBySkill = { ...emptySkillExperience() };

            for (const existingAction of this.actions) {
                if (existingAction.skill && SKILLS.includes(existingAction.skill)) {
                    runningBySkill[existingAction.skill] += existingAction.experience || 0;
                }
                if (existingAction.type === "combat" && existingAction.hitpointsExperience) {
                    runningBySkill["hitpoints"] += existingAction.hitpointsExperience;
                }
                if (existingAction.bonusExp) {
                    for (const bonus of existingAction.bonusExp) {
                        runningBySkill[bonus.skill] += bonus.amount || 0;
                    }
                }
                if (action && existingAction.key === action.key) break;
            }

            if (action && action.skill && SKILLS.includes(action.skill)) {
                runningBySkill[action.skill] += action.experience || 0;
                if (action.type === "combat" && action.hitpointsExperience) {
                    runningBySkill["hitpoints"] += action.hitpointsExperience;
                }
                if (action.bonusExp) {
                    for (const bonus of action.bonusExp) {
                        runningBySkill[bonus.skill] += bonus.amount || 0;
                    }
                }
            }

            for (const skill of SKILLS) {
                const cumulativeExperience = runningBySkill[skill] || 0;
                const currentLevel = this.skillLevels[skill] || 1;
                const newLevel = experienceToLevel(cumulativeExperience);
                stats[skill] = {
                    cumulativeExperience,
                    experienceGain: action && action.skill === skill ? (action.experience || 0) : 0,
                    level: newLevel,
                    levelGain: newLevel - currentLevel,
                };
            }

            return stats;
        },

        // Evaluate a passive requirement using pre-computed running XP and action counts
        evaluateRequirementAtPoint(requirement, runningXpBySkill, actionCounts) {
            if (!requirement || !requirement.type) return false;

            const levelsBySkill = Object.fromEntries(
                Object.entries(runningXpBySkill).map(([skill, xp]) => [skill, experienceToLevel(xp)])
            );
            const totalLevel = Object.values(levelsBySkill).reduce((sum, lvl) => sum + lvl, 0);
            const targetValue = Number(requirement.value) || 0;

            if (requirement.type === "any_skill_level") {
                return Object.entries(levelsBySkill).some(([skill, level]) =>
                    level >= targetValue && skill !== "hitpoints"
                );
            }
            if (requirement.type === "total_level") {
                return totalLevel >= targetValue;
            }
            if (requirement.type === "combat_level") {
                const statsForCombat = Object.fromEntries(
                    SKILLS.map(skill => [skill, { level: levelsBySkill[skill] || 1 }])
                );
                return getCombatLevel(statsForCombat) >= targetValue;
            }
            if (requirement.type === "skill_action_quantity") {
                const totalQty = actionCounts[requirement.method] || 0;
                return totalQty >= Number(requirement.quantity || 0);
            }
            if (requirement.type === "kill_creature_quantity") {
                const totalKilled = actionCounts[`combat_${requirement.method}`] || 0;
                return totalKilled >= Number(requirement.quantity || 0);
            }
            if (requirement.type === "quest_completion") {
                return (actionCounts[`quest:${requirement.method}`] || 0) > 0;
            }
            return false;
        },

        // Find the first action that causes a passive requirement to be satisfied
        findPassiveParentKey(task) {
            const req = task.passive_requirement;
            if (!req) return null;

            const runningXpBySkill = { ...emptySkillExperience() };
            const actionCounts = {};
            let prevMet = false;

            for (const action of this.actions) {
                if (action.key === task.key) continue;

                if (action.skill && SKILLS.includes(action.skill)) {
                    runningXpBySkill[action.skill] += action.experience || 0;
                }
                if (action.bonusExp && Array.isArray(action.bonusExp)) {
                    for (const bonus of action.bonusExp) {
                        if (SKILLS.includes(bonus.skill)) {
                            runningXpBySkill[bonus.skill] += bonus.amount || 0;
                        }
                    }
                }
                if (action.xp_reward && action.xp_reward.skill && SKILLS.includes(action.xp_reward.skill)) {
                    runningXpBySkill[action.xp_reward.skill] += Number(action.xp_reward.amount || 0);
                }
                if (action.type === "skill" && action.method) {
                    actionCounts[action.method] = (actionCounts[action.method] || 0) + (action.quantity || 0);
                }
                if (action.type === "combat" && action.creature) {
                    const ck = `combat_${action.creature}`;
                    actionCounts[ck] = (actionCounts[ck] || 0) + (action.quantity || 0);
                }
                if (action.type === "quest" && action.questKey) {
                    actionCounts[`quest:${action.questKey}`] = 1;
                }

                const met = this.evaluateRequirementAtPoint(req, runningXpBySkill, actionCounts);
                if (met && !prevMet) {
                    return action.key;
                }
                prevMet = met;
            }
            return null;
        },

        // Returns true if a child (passive) action's requirement is not met at its current position
        isOutOfSync(action) {
            if (!action.isPassiveAward || !action.passive_requirement) return false;

            const index = this.actions.findIndex(a => a.key === action.key);
            if (index <= 0) return true;

            // Use cumulativeExperienceBySkill from the action just before this one
            const prevAction = this.actions[index - 1];
            const prevXpBySkill = prevAction.cumulativeExperienceBySkill || emptySkillExperience();

            // Count action quantities up to (but not including) this action
            const actionCounts = {};
            for (let i = 0; i < index; i++) {
                const a = this.actions[i];
                if (a.type === "skill" && a.method) {
                    actionCounts[a.method] = (actionCounts[a.method] || 0) + (a.quantity || 0);
                }
                if (a.type === "combat" && a.creature) {
                    const ck = `combat_${a.creature}`;
                    actionCounts[ck] = (actionCounts[ck] || 0) + (a.quantity || 0);
                }
                if (a.type === "quest" && a.questKey) {
                    actionCounts[`quest:${a.questKey}`] = 1;
                }
            }

            return !this.evaluateRequirementAtPoint(action.passive_requirement, prevXpBySkill, actionCounts);
        },

        checkPassiveTasks() {
            const passiveTemplates = this.taskList.filter(task => task.is_passive && task.passive_requirement);
            // Include league tasks AND quest-triggered passive tasks already in the plan
            const unlockedKeys = new Set(this.actions.filter(a => a.type === "task").map(a => a.key));

            for (const task of passiveTemplates) {
                if (!unlockedKeys.has(task.key) && this.evaluatePassiveRequirement(task.passive_requirement)) {
                    const parentKey = this.findPassiveParentKey(task);
                    const newAction = {
                        ...task,
                        type: "task",
                        selected: false,
                        isPassiveAward: true,
                        parentKey: parentKey || null,
                    };

                    if (parentKey) {
                        const parentIndex = this.actions.findIndex(a => a.key === parentKey);
                        if (parentIndex !== -1) {
                            // Insert after parent and any existing children of that parent
                            let insertIndex = parentIndex + 1;
                            while (
                                insertIndex < this.actions.length &&
                                this.actions[insertIndex].parentKey === parentKey
                            ) {
                                insertIndex++;
                            }
                            this.actions.splice(insertIndex, 0, newAction);
                            continue;
                        }
                    }
                    this.actions.push(newAction);
                }
            }
        },

        // Returns the inventory of the selected shop with resolved item names
        getShopInventory() {
            if (!this.shopSelection || !SHOPS[this.shopSelection]) return [];
            return SHOPS[this.shopSelection].inventory.map(shopItem => ({
                ...shopItem,
                name: ITEMS[shopItem.item]?.name || shopItem.item,
            }));
        },

        // Running GP available at the current insertion point (after selectedTask, or end of list)
        getAvailableGoldAtPoint() {
            if (!this.selectedTask) return this.totalGold();
            let gold = 0;
            for (const action of this.actions) {
                gold += Number(action.totalGold) || 0;
                if (action.key === this.selectedTask.key) break;
            }
            return gold;
        },

        // Total cost of the current shop cart
        shopCartTotal() {
            if (!this.shopSelection || !SHOPS[this.shopSelection]) return 0;
            return SHOPS[this.shopSelection].inventory.reduce((total, shopItem) => {
                const qty = Number(this.shopCart[shopItem.item] || 0);
                return total + qty * shopItem.price;
            }, 0);
        },

        // True if the cart has items and the user can afford the total at the insertion point
        canAffordShopCart() {
            const total = this.shopCartTotal();
            return total > 0 && total <= this.getAvailableGoldAtPoint();
        },

        addShopPurchase() {
            if (!this.canAffordShopCart()) return;
            const shop = SHOPS[this.shopSelection];
            const purchasedItems = shop.inventory
                .filter(shopItem => Number(this.shopCart[shopItem.item] || 0) > 0)
                .map(shopItem => ({
                    item: shopItem.item,
                    name: ITEMS[shopItem.item]?.name || shopItem.item,
                    quantity: Number(this.shopCart[shopItem.item]),
                    priceEach: shopItem.price,
                    totalPrice: Number(this.shopCart[shopItem.item]) * shopItem.price,
                }));
            if (purchasedItems.length === 0) return;
            const totalCost = purchasedItems.reduce((sum, i) => sum + i.totalPrice, 0);
            const action = {
                key: `purchase-${Date.now()}`,
                type: "purchase",
                shopKey: this.shopSelection,
                shopName: shop.name,
                items: purchasedItems,
                totalCost,
                totalGold: -totalCost,
            };
            this._insertAction(action);
            this.shopSelection = "";
            this.shopCart = {};
            this.recalculateActionState();
            this.closeModal();
        },

        // Returns true if the given quest is already anywhere in the plan
        isQuestInPlan(questKey) {
            return this.actions.some(a => a.type === "quest" && a.questKey === questKey);
        },

        // Returns quest requirements with a `met` flag based on current end-of-plan skill levels
        getQuestRequirements(quest) {
            const requirements = [];
            
            // Handle skill requirements
            if (quest.requirements?.skills) {
            for (const req of quest.requirements.skills) {
                requirements.push({
                type: 'skill',
                skill: req.skill,
                level: req.level,
                met: (this.skillLevels[req.skill] || 1) >= req.level,
                });
            }
            }
            
            // Handle quest requirements
            if (quest.requirements?.quests) {
            for (const questKey of quest.requirements.quests) {
                requirements.push({
                type: 'quest',
                questKey,
                met: this.isQuestInPlan(questKey),
                });
            }
            }
            
            return requirements;
        },

        // Filtered quest list for the modal search box
        filteredQuestList() {
            const search = (this.questSearch || "").toLowerCase();
            if (!search) return this.questList;
            return this.questList.filter(q => q.name.toLowerCase().includes(search));
        },

        addQuest(questKey) {
            const quest = QUESTS[questKey];
            if (!quest || this.isQuestInPlan(questKey)) return;
            const action = {
                key: `quest-${questKey}-${Date.now()}`,
                type: "quest",
                questKey,
                name: quest.name,
                requirements: quest.requirements || {},
                xpRewards: quest.xpRewards || [],
                itemRewards: (quest.itemRewards || []).map(ir => ({
                    ...ir,
                    name: ITEMS[ir.item]?.name || ir.item,
                })),
            };
            this._insertAction(action);
            this.questSearch = "";
            this.recalculateActionState();
            this.closeModal();
        },

        // Returns display-friendly item deltas for an action (positive = yield, negative = cost)
        getActionItemDeltas(action) {
            if (!action.itemDeltas) return [];
            return Object.entries(action.itemDeltas)
                .filter(([, qty]) => qty !== 0)
                .map(([key, qty]) => ({
                    item: key,
                    name: ITEMS[key]?.name || key,
                    quantity: qty,
                }));
        },

        // Returns all items in the repository with non-zero counts
        totalItemRepository() {
            return Object.entries(this.itemRepository)
                .filter(([, qty]) => qty !== 0)
                .map(([key, qty]) => ({
                    key,
                    name: ITEMS[key]?.name || key,
                    quantity: qty,
                }));
        },

        recalculateActionState() {
            this.checkPassiveTasks();

            let runningPoints = 0;
            let runningExperience = 0;
            let runningGold = 0;
            const runningBySkill = emptySkillExperience();
            const runningItems = {};

            this.actions.forEach(action => {
                const currentMultiplier = getXpMultiplier(runningPoints);
                runningPoints += Number(action.league_points || 0);
                action.cumulativePoints = runningPoints;

                const actionExperienceBySkill = Object.fromEntries(SKILLS.map(skill => [skill, 0]));

                if (action.skill && SKILLS.includes(action.skill)) {
                    const baseXp = (Number(action.quantity) || 0) * (Number(action.xpPerAction) || 0) * (getXpMultiplier(runningPoints) || 5);
                    actionExperienceBySkill[action.skill] = baseXp;
                    action.experience = baseXp;
                    action.currentMultiplier = currentMultiplier;
                    action.effectiveExperience = baseXp * currentMultiplier;

                    // Recompute bonusExp dynamically from current relic selection
                    const qty = Number(action.quantity) || 0;
                    const actionMultiplier = getXpMultiplier(runningPoints) || 5;
                    let recomputedBonusExp = [];
                    if (this.relicSelection.includes('barbarian_gathering') && ['mining', 'fishing', 'woodcutting'].includes(action.skill)) {
                        recomputedBonusExp = [
                            { skill: 'agility', amount: baseXp * 0.1 },
                            { skill: 'strength', amount: baseXp * 0.1 },
                        ];
                    } else if (this.relicSelection.includes('abundance')) {
                        recomputedBonusExp = [{ skill: action.skill, amount: qty * 2 * actionMultiplier }];
                    }
                    action.bonusExp = recomputedBonusExp;
                    for (const bonus of recomputedBonusExp) {
                        if (SKILLS.includes(bonus.skill)) {
                            actionExperienceBySkill[bonus.skill] = (actionExperienceBySkill[bonus.skill] || 0) + bonus.amount;
                        }
                    }

                    // Recompute totalGold dynamically
                    const baseMethodGold = (getMethod(action.skill, action.method)?.gold || 0) * qty;
                    if (this.relicSelection.includes('abundance')) {
                        const abundanceBonusXp = qty * 2 * actionMultiplier;
                        action.totalGold = baseMethodGold + (baseXp + abundanceBonusXp) * 2;
                    } else {
                        action.totalGold = baseMethodGold;
                    }
                }

                if (action.type === "combat" && action.hitpointsXpPerAction) {
                    const hpXp = (Number(action.quantity) || 0) * (Number(action.hitpointsXpPerAction) || 0) * (getXpMultiplier(runningPoints) || 5);
                    actionExperienceBySkill["hitpoints"] += hpXp;

                    // Recompute combat bonusExp and totalGold
                    const qty = Number(action.quantity) || 0;
                    const actionMultiplier = getXpMultiplier(runningPoints) || 5;
                    const combatBaseXp = qty * (Number(action.xpPerAction) || 0) * actionMultiplier;
                    let recomputedBonusExp = [];
                    if (this.relicSelection.includes('abundance') && action.skill) {
                        recomputedBonusExp = [{ skill: action.skill, amount: qty * 2 * actionMultiplier }];
                    }
                    action.bonusExp = recomputedBonusExp;
                    for (const bonus of recomputedBonusExp) {
                        if (SKILLS.includes(bonus.skill)) {
                            actionExperienceBySkill[bonus.skill] = (actionExperienceBySkill[bonus.skill] || 0) + bonus.amount;
                        }
                    }
                    if (this.relicSelection.includes('abundance')) {
                        const abundanceBonusXp = qty * 2 * actionMultiplier;
                        action.totalGold = (combatBaseXp + abundanceBonusXp) * 2;
                    } else {
                        action.totalGold = 0;
                    }
                }

                if (action.xp_reward && action.xp_reward.skill && SKILLS.includes(action.xp_reward.skill)) {
                    const xp = Number(action.xp_reward.amount || 0) * currentMultiplier;
                    actionExperienceBySkill[action.xp_reward.skill] += xp;
                    action.currentMultiplier = currentMultiplier;
                }

                if (action.type === "quest") {
                    // Check skill level requirements against XP accumulated BEFORE this quest
                    const requirementWarnings = [];
                    for (const [skill, requiredLevel] of Object.entries(action.requirements || {})) {
                        const currentLevel = experienceToLevel(runningBySkill[skill] || 0);
                        if (currentLevel < requiredLevel) {
                            requirementWarnings.push({ skill, required: requiredLevel, current: currentLevel });
                        }
                    }
                    action.requirementWarnings = requirementWarnings;
                    // Apply XP rewards before updating runningBySkill so they count toward cumulative totals
                    for (const reward of (action.xpRewards || [])) {
                        if (SKILLS.includes(reward.skill)) {
                            const xp = Number(reward.amount || 0) * currentMultiplier;
                            actionExperienceBySkill[reward.skill] = (actionExperienceBySkill[reward.skill] || 0) + xp;
                            action.currentMultiplier = currentMultiplier;
                        }
                    }
                }

                Object.entries(actionExperienceBySkill).forEach(([skill, xp]) => {
                    runningBySkill[skill] += xp;
                });

                action.experienceBySkill = actionExperienceBySkill;
                action.totalExperienceGain = Object.values(actionExperienceBySkill).reduce((sum, xp) => sum + xp, 0);
                runningExperience += action.totalExperienceGain;
                action.cumulativeExperience = runningExperience;
                action.cumulativeExperienceBySkill = { ...runningBySkill };

                // Item repository tracking
                const actionItemDeltas = {};
                const itemWarnings = [];

                if (action.type === "skill") {
                    const method = getMethod(action.skill, action.method);
                    if (method) {
                        const qty = Number(action.quantity) || 0;

                        for (const yieldEntry of resolveMethodYields(method, qty)) {
                            actionItemDeltas[yieldEntry.item] = (actionItemDeltas[yieldEntry.item] || 0) + yieldEntry.quantity;
                        }

                        if (method.itemCosts) {
                            for (const costDef of method.itemCosts) {
                                const total = costDef.quantity * qty;
                                const available = (runningItems[costDef.item] || 0) + (actionItemDeltas[costDef.item] || 0);
                                if (total > available) {
                                    itemWarnings.push({
                                        item: costDef.item,
                                        name: ITEMS[costDef.item]?.name || costDef.item,
                                        needed: total,
                                        available: Math.max(0, available),
                                    });
                                }
                                actionItemDeltas[costDef.item] = (actionItemDeltas[costDef.item] || 0) - total;
                            }
                        }
                    }
                }

                if (action.type === "purchase") {
                    for (const purchasedItem of (action.items || [])) {
                        actionItemDeltas[purchasedItem.item] = (actionItemDeltas[purchasedItem.item] || 0) + purchasedItem.quantity;
                    }
                }

                if (action.type === "quest") {
                    // Apply item rewards
                    for (const ir of (action.itemRewards || [])) {
                        actionItemDeltas[ir.item] = (actionItemDeltas[ir.item] || 0) + ir.quantity;
                    }
                }

                for (const [item, delta] of Object.entries(actionItemDeltas)) {
                    runningItems[item] = (runningItems[item] || 0) + delta;
                }

                action.itemDeltas = actionItemDeltas;
                action.cumulativeItems = { ...runningItems };
                action.itemWarnings = itemWarnings;

                // GP tracking
                const goldBeforeAction = runningGold;
                runningGold += Number(action.totalGold) || 0;
                action.cumulativeGold = runningGold;
                runningItems.coins = runningGold;

                if (action.type === "purchase") {
                    const cost = action.totalCost || 0;
                    action.gpWarning = goldBeforeAction < cost
                        ? { needed: cost, available: Math.max(0, goldBeforeAction) }
                        : null;
                }
            });

            this.totalPoints = runningPoints;
            this.skillExperience = { ...runningBySkill };
            this.skillLevels = Object.fromEntries(
                Object.entries(runningBySkill).map(([skill, xp]) => [skill, experienceToLevel(xp)])
            );
            this.totalLevel = Object.values(this.skillLevels).reduce((sum, lvl) => sum + lvl, 0);
            this.totalTasks = this.actions.filter(action => action.type === "task").length;
            this.itemRepository = { ...runningItems };
            this.checkPassiveTasks();
            if (window.refreshMapPolylines) window.refreshMapPolylines(this.actions);
            this._saveState();
        },

        addDestination(destination) {
            if (!destination) {
                this.closeModal();
                return;
            }
            const action = {
                key: `destination_${this.actions.length}`,
                type: "destination",
                description: destination,
            };
            this._insertAction(action);
            if (window._pendingActionLatlng && window.registerActionLatLng) {
                window.registerActionLatLng(action.key, window._pendingActionLatlng, "note");
                window._pendingActionLatlng = null;
            }
            this.recalculateActionState();
            this.closeModal();
        },

        showStats(skillKey) {
            this.viewStats = this.actions.find(action => action.key === skillKey);
            if (!this.viewStats) return;
            this.openModal("stats-template");
        },

        totalGold() {
            const tg = this.actions.reduce((total, action) => total + (action.totalGold || 0), 0);
            this.itemRepository.coins = tg;
            return tg;
        },

        evaluatePassiveRequirement(requirement) {
            if (!requirement || !requirement.type) return false;

            const levelsBySkill = this.skillLevels;
            const totalLevel = Object.values(levelsBySkill).reduce((sum, lvl) => sum + lvl, 0);
            const targetValue = Number(requirement.value) || 0;

            if (requirement.type === "any_skill_level") {
                return Object.entries(levelsBySkill).some(([skill, level]) =>
                    level >= targetValue && skill !== "hitpoints"
                );
            }
            if (requirement.type === "total_level") {
                return totalLevel >= targetValue;
            }
            if (requirement.type === "combat_level") {
                return this.getCurrentCombatLevel() >= targetValue;
            }
            if (requirement.type === "skill_action_quantity") {
                const totalQuantity = this.actions
                    .filter(a => a.type === "skill" && a.method === requirement.method)
                    .reduce((sum, a) => sum + (a.quantity || 0), 0);
                return totalQuantity >= Number(requirement.quantity || 0);
            }
            if (requirement.type === "kill_creature_quantity") {
                const totalKilled = this.actions
                    .filter(a => a.type === "combat" && a.creature === requirement.method)
                    .reduce((sum, a) => sum + (a.quantity || 0), 0);
                return totalKilled >= Number(requirement.quantity || 0);
            }
            if (requirement.type === "quest_completion") {
                return this.actions.some(a => a.type === "quest" && a.questKey === requirement.method);
            }
            return false;
        },

        getCurrentCombatLevel() {
            const currentStats = this.calculateStats();
            return getCombatLevel(currentStats);
        },

        // Edit action methods
        startEdit(actionKey) {
            const action = this.actions.find(a => a.key === actionKey);
            if (!action) return;
            this.editingAction = actionKey;
            this.editFormData = {
                skill: action.skill || "",
                method: action.method || "",
                quantity: action.quantity || 1,
                description: action.description || "",
                name: action.name || "",
            };
        },

        cancelEdit() {
            this.editingAction = null;
            this.editFormData = {};
        },

        getEditMethodOptions() {
            return getMethodsForSkill(this.editFormData.skill || "");
        },

        saveEdit() {
            const action = this.actions.find(a => a.key === this.editingAction);
            if (!action) { this.cancelEdit(); return; }

            if (action.type === "skill") {
                const selectedMethod = getMethod(this.editFormData.skill, this.editFormData.method);
                if (!selectedMethod || Number(this.editFormData.quantity) <= 0) {
                    this.cancelEdit();
                    return;
                }
                const editPreview = this.getEditActionPreview();
                if (editPreview?.hasInsufficientItems) return;
                const parsedQuantity = Number(this.editFormData.quantity);
                const experience = selectedMethod.xpPerAction * parsedQuantity * (getXpMultiplier(this.totalPoints) || 5);

                action.skill = this.editFormData.skill;
                action.skillLabel = this.skillOptions.find(opt => opt.key === this.editFormData.skill)?.label || this.editFormData.skill;
                action.method = this.editFormData.method;
                action.methodLabel = selectedMethod.name;
                action.quantity = parsedQuantity;
                action.xpPerAction = selectedMethod.xpPerAction;
                action.experience = experience;
                action.bonusExp = this.getBonusExp(this.editFormData.skill, parsedQuantity, experience);
                action.totalGold = ((selectedMethod.gold || 0) * parsedQuantity) + this.getGold(experience, parsedQuantity);
            }
            if (action.type === "destination") {
                action.description = this.editFormData.description;
            }

            if (action.type === "group") {
                const trimmed = (this.editFormData.name || '').trim();
                if (trimmed) action.name = trimmed;
            }

            this.editingAction = null;
            this.editFormData = {};
            this.recalculateActionState();
        },

        // -----------------------------------------------------------------------
        // Persistence helpers
        // -----------------------------------------------------------------------

        // -----------------------------------------------------------------------
        // Task groups
        // -----------------------------------------------------------------------

        addGroup(name) {
            const groupName = (name || this.newGroupName || '').trim();
            if (!groupName) return;
            const action = {
                key: `group-${Date.now()}`,
                name: groupName,
                type: 'group',
                collapsed: false,
            };
            this._insertAction(action);
            this.newGroupName = '';
            this.addingGroup = false;
            this.recalculateActionState();
        },

        toggleGroup(key) {
            const group = this.actions.find(a => a.key === key && a.type === 'group');
            if (group) {
                group.collapsed = !group.collapsed;
                this._saveState();
            }
        },

        removeGroup(key) {
            // Remove only the group header; member actions remain ungrouped
            this.actions = this.actions.filter(a => a.key !== key);
            this.recalculateActionState();
        },

        getGroupMemberCount(groupKey) {
            let counting = false;
            let count = 0;
            for (const action of this.actions) {
                if (action.type === 'group') {
                    if (action.key === groupKey) { counting = true; continue; }
                    if (counting) break;
                }
                if (counting) count++;
            }
            return count;
        },

        visibleActions() {
            const visible = [];
            let collapsed = false;
            for (const action of this.actions) {
                if (action.type === 'group') {
                    collapsed = action.collapsed;
                    visible.push(action);
                } else if (!collapsed) {
                    visible.push(action);
                }
            }
            return visible;
        },

        _saveState() {
            try {
                const state = {
                    actions: this.actions,
                    relicSelection: this.relicSelection,
                    actionLatLngs: window.getActionLatLngs ? window.getActionLatLngs() : {},
                    currentRouteName: this.currentRouteName,
                };
                localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(state));
            } catch (e) {
                console.warn('Could not auto-save state', e);
            }
        },

        _restoreFromLocalStorage() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
                if (!raw) return;
                const state = JSON.parse(raw);
                if (!state.actions || !Array.isArray(state.actions) || state.actions.length === 0) return;
                this._applyState(state);
            } catch (e) {
                console.warn('Could not restore session state', e);
            }
        },

        _applyState(state) {
            this.actions = state.actions || [];
            this.relicSelection = state.relicSelection || [];
            this.currentRouteName = state.currentRouteName || state.name || '';
            const savedLatLngs = state.actionLatLngs || {};
            const actions = this.actions;
            const doRestore = () => {
                if (window.restoreActionLatLngs) {
                    window.restoreActionLatLngs(savedLatLngs, actions);
                    this.recalculateActionState();
                } else {
                    setTimeout(doRestore, 50);
                }
            };
            setTimeout(doRestore, 0);
        },

        // -----------------------------------------------------------------------
        // Route management
        // -----------------------------------------------------------------------

        openRouteModal() {
            this.savedRoutes = this._listRoutes();
            this.newRouteName = '';
            this.openModal("route-manager-template");
        },

        createNewRoute(name) {
            const routeName = (name || this.newRouteName || '').trim();
            if (!routeName) return;
            if (!confirm(`Create new route "${routeName}"? The current plan will be cleared.`)) return;
            this.actions = [];
            this.relicSelection = [];
            this.currentRouteName = routeName;
            if (window.restoreActionLatLngs) window.restoreActionLatLngs({}, []);
            this.newRouteName = '';
            this.recalculateActionState();
            this.closeModal();
        },

        saveRoute(asNewName) {
            const name = asNewName
                ? (this.newRouteName || '').trim()
                : (this.currentRouteName || this.newRouteName || '').trim();
            if (!name) return;
            try {
                const routes = this._loadRoutesStore();
                routes[name] = {
                    name,
                    savedAt: Date.now(),
                    totalTasks: this.totalTasks,
                    totalPoints: this.totalPoints,
                    totalLevel: this.totalLevel,
                    actions: this.actions,
                    relicSelection: this.relicSelection,
                    actionLatLngs: window.getActionLatLngs ? window.getActionLatLngs() : {},
                    currentRouteName: name,
                };
                localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
                this.currentRouteName = name;
                this.savedRoutes = this._listRoutes();
                this.newRouteName = '';
            } catch (e) {
                console.warn('Could not save route', e);
            }
        },

        loadRoute(name) {
            try {
                const routes = this._loadRoutesStore();
                const route = routes[name];
                if (!route) return;
                this._applyState(route);
            } catch (e) {
                console.warn('Could not load route', e);
            }
            this.closeModal();
        },

        deleteRoute(name) {
            try {
                const routes = this._loadRoutesStore();
                delete routes[name];
                localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
                this.savedRoutes = this._listRoutes();
            } catch (e) {
                console.warn('Could not delete route', e);
            }
        },

        clearPlan() {
            if (!confirm('Clear the current plan? This cannot be undone.')) return;
            this.actions = [];
            this.relicSelection = [];
            this.currentRouteName = '';
            if (window.restoreActionLatLngs) window.restoreActionLatLngs({}, []);
            this.recalculateActionState();
        },

        _listRoutes() {
            const routes = this._loadRoutesStore();
            return Object.values(routes).sort((a, b) => b.savedAt - a.savedAt);
        },

        _loadRoutesStore() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_ROUTES);
                return raw ? JSON.parse(raw) : {};
            } catch (e) {
                console.log(e);
                return {};
            }
        },

        formatSavedAt(ts) {
            return new Date(ts).toLocaleString();
        },

        getRelicName(relicKey) {
            return RELICS[relicKey]?.name || relicKey;
        },

        getItemName(item) {
            const itemData = ITEMS[item];
            return itemData ? itemData.name : item[0].toUpperCase() + item.slice(1).toLowerCase();
        },

        getItemPicture(item) {
            const itemName = this.getItemName(item.key).replace(' ', '_');
            let scale = null;
            if (item.key == "coins") {
                scale = [1,2,3,4,5,25,100,250,1000,10000].filter(t => item.quantity >= t).pop();
            }
            if (item.key.includes("arrow") || item.key.includes("keys")) {
                scale = [1,2,3,4,5].filter(t => item.quantity >= t).pop();
            }
            if(scale == null) {
                return 'https://oldschool.runescape.wiki/images/' + itemName + '.png?6dc61';
            }
            return "https://oldschool.runescape.wiki/images/" + itemName + "_" + scale + ".png?6dc61";
        },

        formatItemQuantity(quantity) {
            if (quantity > 99_999) {
                return (quantity / 1000).toFixed(0) + "K";
            } else if (quantity > 9_999_999) {
                return (quantity / 1_000_000).toFixed(0) + "M";
            }
            return quantity;
        }
    };
}
