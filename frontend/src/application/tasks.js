export function taskManager() {
    return {
        showModal: false,
        tasks: [{name: 'Open the Leagues Menu', points: 10, id: 1}],
        init() {
            window.addEventListener('add-task', (event) => {
                console.log("Adding task", event);
                this.openModal();
            });
        },
        openModal() {
            this.showModal = true;
            const template = document.getElementById('task-list-template');
            const modalContent = document.getElementById('modalContent');

            if (!template || !modalContent) return;

            modalContent.innerHTML = '';
            modalContent.appendChild(template.content.cloneNode(true));

            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        addTask(task) {
            this.tasks.push(task);
        },
        removeTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        },
    };
}
