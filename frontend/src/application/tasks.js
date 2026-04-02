import { getMethod, getMethodsForSkill, getSkillOptions } from "./skill-methods.js";
import { SKILLS, RELIC_LIST, RELICS, RELIC_POINTS_TIER } from "./constants.js";
import {
    experienceToLevel,
    emptySkillExperience,
    emptySkillLevels,
    getXpMultiplier,
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

        filteredTasks() {
            const actionKeys = new Set(this.actions.map(a => a.key));
            return this.taskList.filter(task => !actionKeys.has(task.key));
        },

        addTask(taskKey) {
            const taskTemplate = this.taskList.find(task => task.key === taskKey);
            const canAdd = taskTemplate && (!taskTemplate.is_passive || taskTemplate.selectable);
            if (canAdd) {
                this.actions.push({
                    ...taskTemplate,
                    type: "task",
                    selected: false,
                    currentStats: this.calculateStats(),
                    totalGold: 0,
                });
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
            this.recalculateActionState();
        },

        addRelic(relicKey) {
            this.actions.push({
                key: relicKey,
                name: RELICS[relicKey].name,
                type: "relic",
                currentStats: this.calculateStats(),
            });
            this.relicSelection.push(relicKey);
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

            this.actions.push(skillAction);
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

        checkPassiveTasks() {
            const passiveTemplates = this.taskList.filter(task => task.is_passive && task.passive_requirement);
            const unlockedKeys = new Set(this.actions.filter(a => a.type === "task").map(a => a.key));

            for (const task of passiveTemplates) {
                if (!unlockedKeys.has(task.key) && this.evaluatePassiveRequirement(task.passive_requirement)) {
                    this.actions.push({ ...task, type: "task", selected: false, isPassiveAward: true });
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
            if (requirement.type === "skill_action_quantity") {
                const totalQuantity = this.actions
                    .filter(a => a.type === "skill" && a.method === requirement.method)
                    .reduce((sum, a) => sum + (a.quantity || 0), 0);
                return totalQuantity >= Number(requirement.quantity || 0);
            }
            return false;
        },
    };
}
