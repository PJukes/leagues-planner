export function taskManager() {
    const SKILLS = [
        "attack", "hitpoints", "mining", "strength", "agility", "smithing",
        "defence", "herblore", "fishing", "ranged", "thieving", "cooking",
        "prayer", "crafting", "firemaking", "magic", "fletching", "woodcutting",
        "runecraft", "slayer", "farming", "construction", "hunter",
    ];

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
        skillExperience: emptySkillExperience(),
        init() {
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
                this.recalculateActionState();
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
            this.actions = this.actions.filter(task => task.key !== taskKey);
            const removedTask = this.taskList.find(task => task.key === taskKey);
            if (removedTask) {
                this.totalTasks -= 1;
            }
            this.recalculateActionState();
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
        getSkillExperience(action, skill) {
            if (!action?.cumulativeExperienceBySkill) return 0;
            return action.cumulativeExperienceBySkill[skill] || 0;
        },
        canPickRelic() {
            if (this.currentRelicTier === 0 && this.relicSelection.length === 0) {
                return true;
            }
            const totalPoints = this.totalPoints;
            for(let i=0; i<RELIC_POINTS_TIER.length; i++) {
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
            this.recalculateActionState();
            this.closeModal();
        },
        recalculateActionState() {
            let runningPoints = 0;
            let runningExperience = 0;
            const runningBySkill = emptySkillExperience();

            this.actions.forEach(action => {
                runningPoints += Number(action.league_points || 0);
                action.cumulativePoints = runningPoints;

                const actionExperienceBySkill = emptySkillExperience();
                if (action.type === "skill" && action.skillKey && SKILLS.includes(action.skillKey)) {
                    actionExperienceBySkill[action.skillKey] =
                        (Number(action.quantity) || 0) * (Number(action.xpPerAction) || 0);
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
        },

    };
}
