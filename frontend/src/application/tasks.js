export function taskManager() {
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
                this.totalPoints += task.league_points;
                task.cumulativePoints = this.totalPoints;
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
                this.totalPoints -= removedTask.league_points;
            }
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
        addSkillAction(skill, method, quantity) {
            console.log("Adding skill action", skill, method, quantity);
            const skillAction = {
                key: `${skill}-${method}-${quantity}`,
                name: skill,
                method: method,
                quantity: quantity,
                type: "skill"
            };
            this.actions.push(skillAction);
            this.closeModal();
        }

    };
}
