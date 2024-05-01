import { NotificationBanner } from "./notificationBanner.component.js";

class CourseSettings extends HTMLElement {
    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        document.querySelector('#courseSettingsButton').addEventListener('click', () => {
            this.modal.show();
        });
        this.initializeDeleteCourseButton();
    }

    initializeDeleteCourseButton() {
        this.deleteCourseButton = this.querySelector('#deleteCourseButton');
        this.deleteCourseButton.addEventListener('click', this.deleteCourse.bind(this));
    }

    async deleteCourse() {
        this.modal.hide();
        const confirmPopup = document.querySelector('confirm-popup');
        const confirmDeletion = await confirmPopup.ask({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this course? This action cannot be undone.',
            confirmButtonText: 'Delete',
        });

        if (!confirmDeletion) {
            return;
        }

        const response = await fetch(`/courses/${this.courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            NotificationBanner.instance.notify('Course deleted.');
            document.querySelector('cue-app').navigateBack();
        } else {
            NotificationBanner.instance.notify('Could not delete course.');
        }
    }

    get courseId() {
        return this.getAttribute('course-id');
    }
}
customElements.define('course-settings', CourseSettings);
