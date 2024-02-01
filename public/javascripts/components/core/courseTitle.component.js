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
            <form
                hx-patch="/courses/${this.getAttribute('id')}"
                hx-trigger="keydown[event.key==='Enter']"
                hx-on::after-request="window.location.href = window.location.href.replace(/[^/]*$/, event.detail.xhr.response);"
            >
                <input type="text" name="name" class="course-name" value="${this.getAttribute('name')}" />
                <br />
                <input
                    type="text"
                    name="code"
                    class="course-code"
                    value="${this.getAttribute('department').toUpperCase()} ${this.getAttribute('number')}"
                />
            </form>
        `;
    }
}
customElements.define('course-title', CourseTitle);
