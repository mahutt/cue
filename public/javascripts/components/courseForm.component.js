class CourseForm extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        document.querySelector('#newCourseFormButton').addEventListener('click', () => {
            this.modal.show();
        });
        this.form = this.querySelector('form');
        this.initializeCreateCourseButton();
    }

    initializeCreateCourseButton() {
        this.createCourseButton = this.querySelector('#createCourseButton');
        this.createCourseButton.addEventListener('click', this.createCourse.bind(this));
    }

    async createCourse() {
        const formData = new FormData(this.form);
        const response = await fetch('/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        if (response.ok) {
            const html = await response.text();
            document.querySelectorAll('.courses').forEach((div) => {
                div.insertAdjacentHTML('beforeend', html);
            });
            this.modal.hide();
            customElements.get('notification-banner').instance.notify('Course created.');
        } else {
            this.modal.hide();
            customElements.get('notification-banner').instance.notify('Could not create course.');
        }
    }
}
customElements.define('course-form', CourseForm);
