import { getMethod, getMethodsForSkill, getSkillOptions } from "./skill-methods.js";

export function taskManager() {
    const SKILLS = [
        "attack", "hitpoints", "mining", "strength", "agility", "smithing",
        "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
        "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
        "runecraft", "slayer", "farming", "construction", "hunter",
    ];

    const STARTING_LEVEL = 1;
    const emptySkillExperience = () => Object.fromEntries(SKILLS.map(skill => [skill, 0]));
    const emptySkillLevels = () => Object.fromEntries(SKILLS.map(skill => [skill, STARTING_LEVEL]));

    const RELIC_LIST = [
        ["Endless Harvest", "Barbarian Gathering", "Abundance"],
        ["Woodsman",],
        ["Evil Eye"],
        ["Conniving Clues"],
        ["Nature's Accord"],
        ["Culling Spree"],
        ["Minion", "Flask of Fervour"],
    ];
    const RELIC_POINTS_TIER = [0, 750, 1500, 2500, 3500, 5000, 10000, 15000];

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
            return Object.values(skillLevels).some(level => level >= targetValue);
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
            fetch("http://127.0.0.1:8002/planner/task-list/")
                .then(res => res.json())
                .then(data => {
                    this.taskList = data.tasks || [];
                    console.log(this.taskList);
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
                name: relicKey,
                type: "relic",
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
            const experience = selectedMethod.xpPerAction * parsedQuantity;
            const skillAction = {
                key: `${skill}-${method}-${Date.now()}`,
                skill,
                skillLabel,
                method,
                methodLabel: selectedMethod.name,
                quantity: parsedQuantity,
                quantityLabel: selectedMethod.actionLabel,
                xpPerAction: selectedMethod.xpPerAction,
                experience,
                type: "skill"
            };
            this.actions.push(skillAction);
            this.skillSelection = "";
            this.methodSelection = "";
            this.skillQuantity = 1;
            this.closeModal();
        },
        syncPassiveTasks() {
            const manualActions = this.actions.filter(action => !action.isPassiveAward);
            const runningBySkill = emptySkillExperience();

            manualActions.forEach(action => {
                if (action.skillKey && SKILLS.includes(action.skillKey)) {
                    const gain = (Number(action.quantity) || 0) * (Number(action.xpPerAction || action.base_xp_per_action) || 0);
                    runningBySkill[action.skillKey] += gain;
                }
            });

            const levelsBySkill = Object.fromEntries(
                Object.entries(runningBySkill).map(([skill, xp]) => [skill, experienceToLevel(xp)]),
            );
            const totalLevel = Object.values(levelsBySkill).reduce((sum, lvl) => sum + lvl, 0);
            const passiveTemplates = this.taskList.filter(task => task.is_passive && task.passive_requirement);
            const unlockedPassiveKeys = new Set(
                passiveTemplates
                    .filter(task => evaluatePassiveRequirement(task.passive_requirement, levelsBySkill, totalLevel))
                    .map(task => task.key),
            );

            const preservedPassiveActions = this.actions.filter(
                action => action.isPassiveAward && unlockedPassiveKeys.has(action.key),
            );

            const existingPassiveKeys = new Set(preservedPassiveActions.map(action => action.key));
            const newlyUnlockedPassiveActions = passiveTemplates
                .filter(task => unlockedPassiveKeys.has(task.key) && !existingPassiveKeys.has(task.key))
                .map(task => ({
                    ...task,
                    type: "task",
                    selected: false,
                    isPassiveAward: true,
                }));

            this.actions = [
                ...manualActions,
                ...preservedPassiveActions,
                ...newlyUnlockedPassiveActions,
            ];
        },
        recalculateActionState() {
            this.syncPassiveTasks();

            let runningPoints = 0;
            let runningExperience = 0;
            const runningBySkill = emptySkillExperience();

            this.actions.forEach(action => {
                runningPoints += Number(action.league_points || 0);
                action.cumulativePoints = runningPoints;

                const actionExperienceBySkill = emptySkillExperience();
                if (action.skillKey && SKILLS.includes(action.skillKey)) {
                    actionExperienceBySkill[action.skillKey] =
                        (Number(action.quantity) || 0) * (Number(action.xpPerAction || action.base_xp_per_action) || 0);
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

    };
}
