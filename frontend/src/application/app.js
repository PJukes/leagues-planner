// This is the style entry file
import "../styles/app.css";
import 'htmx.org';
import { taskManager } from "./tasks.js";
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

window.htmx = require('htmx.org');
window.Alpine = Alpine;
Alpine.plugin(focus);
Alpine.store('modal', {
    show: false,
    toggle() {
        this.show = !this.show;
    }
});

Alpine.data("taskManager", taskManager);
Alpine.start();
