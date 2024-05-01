import { NotificationBanner } from '../notificationBanner.component.js';

class CourseTitle extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            .course-name, .course-code {
                border: none;
                outline: none;
                margin: 0;
                padding: 0;
                font: inherit;
                color: inherit;
                background-color: transparent;
            }
        </style>
        `;

        this.name = document.createElement('input');
        this.name.type = 'text';
        this.name.classList.add('course-name');
        this.name.value = this.getAttribute('name');

        this.code = document.createElement('input');
        this.code.type = 'text';
        this.code.classList.add('course-code');
        this.code.value = `${this.getAttribute('department').toUpperCase()} ${this.getAttribute('number')}`;

        const form = document.createElement('form');
        form.appendChild(this.name);
        form.appendChild(this.code);
        this.appendChild(form);

        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.updateCourse();
            }
        });
    }
    updateCourse() {
        fetch(`/courses/${this.getAttribute('id')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.name.value,
                code: this.code.value,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    NotificationBanner.instance.notify('Could not update course.');
                }
            })
            .then((code) => {
                if (code) {
                    window.location.href = window.location.href.replace(/[^/]*$/, code);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
customElements.define('course-title', CourseTitle);
