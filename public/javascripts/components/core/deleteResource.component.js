class DeleteResource extends HTMLElement {
    connectedCallback() {
        this.style.cursor = 'pointer';
        this.addEventListener('click', () => {
            if (window.confirm('Are you sure you want to proceed?')) {
                this.delete();
            }
        });
    }
    delete() {
        fetch(`/${this.getAttribute('resource')}/${this.getAttribute('id')}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    window.location.href = window.location.href.replace(/[^/]*$/, '');
                } else {
                    customElements.get('notification-banner').instance.notify('Could not delete resource.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
customElements.define('delete-resource', DeleteResource);
