import { getMethod, getMethodsForSkill, getSkillOptions } from "./skill-methods.js";
import { SKILLS, RELIC_LIST, RELICS, RELIC_POINTS_TIER } from "./constants.js";
import {
    experienceToLevel,
    emptySkillExperience,
    emptySkillLevels,
    getXpMultiplier,
    getCombatLevel
} from "./experience.js";

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
        skillOptions: getSkillOptions(),
        skillExperience: emptySkillExperience(),
        skillLevels: emptySkillLevels(),
        viewStats: null,
        totalLevel: SKILLS.length,
        editingAction: null,
        editFormData: {},

        init() {
            window.addEventListener("add-task", () => this.openModal());
            window.addEventListener("add-skill", () => this.openModal("skill-list-template"));
            window.addEventListener("add-destination", () => this.openModal("destination-template"));
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
            return this.taskList.filter(task => !actionKeys.has(task.key));
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
            if (this.selectedTask === taskKey) {
                this.selectedTask.selected = false;
                this.selectedTask = null;
                return;
            }
            this.selectedTask = this.actions.find(task => task.key === taskKey);
            this.selectedTask.selected = true;
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
            if (!selectedMethod || parsedQuantity <= 0) return;

            const skillLabel = this.skillOptions.find(opt => opt.key === skill)?.label || skill;
            const experience = selectedMethod.xpPerAction * parsedQuantity * (getXpMultiplier(this.totalPoints) || 5);
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
                totalGold: ((selectedMethod.gold || 0) * parsedQuantity) + this.getGold(experience, quantity),
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
                if (existingAction.bonusExp) {
                    for (const bonus of existingAction.bonusExp) {
                        runningBySkill[bonus.skill] += bonus.amount || 0;
                    }
                }
                if (action && existingAction.key === action.key) break;
            }

            if (action && action.skill && SKILLS.includes(action.skill)) {
                runningBySkill[action.skill] += action.experience || 0;
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
            }

            return !this.evaluateRequirementAtPoint(action.passive_requirement, prevXpBySkill, actionCounts);
        },

        checkPassiveTasks() {
            const passiveTemplates = this.taskList.filter(task => task.is_passive && task.passive_requirement);
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

        recalculateActionState() {
            this.checkPassiveTasks();

            let runningPoints = 0;
            let runningExperience = 0;
            const runningBySkill = emptySkillExperience();

            this.actions.forEach(action => {
                const currentMultiplier = getXpMultiplier(runningPoints);
                runningPoints += Number(action.league_points || 0);
                action.cumulativePoints = runningPoints;

                const actionExperienceBySkill = Object.fromEntries(SKILLS.map(skill => [skill, 0]));

                if (action.skill && SKILLS.includes(action.skill)) {
                    const baseXp = (Number(action.quantity) || 0) * (Number(action.xpPerAction) || 0) * (getXpMultiplier(runningPoints) || 5);
                    actionExperienceBySkill[action.skill] = baseXp;
                    action.currentMultiplier = currentMultiplier;
                    action.effectiveExperience = baseXp * currentMultiplier;
                }

                if (action.xp_reward && action.xp_reward.skill && SKILLS.includes(action.xp_reward.skill)) {
                    const xp = Number(action.xp_reward.amount || 0) * currentMultiplier;
                    actionExperienceBySkill[action.xp_reward.skill] += xp;
                    action.currentMultiplier = currentMultiplier;
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
                Object.entries(runningBySkill).map(([skill, xp]) => [skill, experienceToLevel(xp)])
            );
            this.totalLevel = Object.values(this.skillLevels).reduce((sum, lvl) => sum + lvl, 0);
            this.totalTasks = this.actions.filter(action => action.type === "task").length;
            this.checkPassiveTasks();
            if (window.refreshMapPolylines) window.refreshMapPolylines(this.actions);
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
            return this.actions.reduce((total, action) => total + (action.totalGold || 0), 0);
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
                console.log("Checking combat level", this.getCurrentCombatLevel());
                return this.getCurrentCombatLevel() >= targetValue;
            }
            if (requirement.type === "skill_action_quantity") {
                const totalQuantity = this.actions
                    .filter(a => a.type === "skill" && a.method === requirement.method)
                    .reduce((sum, a) => sum + (a.quantity || 0), 0);
                return totalQuantity >= Number(requirement.quantity || 0);
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

            this.editingAction = null;
            this.editFormData = {};
            this.recalculateActionState();
        },
    };
}
