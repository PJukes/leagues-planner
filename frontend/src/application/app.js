// This is the style entry file
import "../styles/app.css";
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

window.Alpine = Alpine;
Alpine.plugin(focus);
Alpine.store('modal', {
    show: false,
    toggle() {
        this.show = !this.show;
    }
});

Alpine.start();
