class ConfirmPopup extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.modal = new bootstrap.Modal(this);
        this.modalTitle = this.querySelector('#modalTitle');
        this.modalMessage = this.querySelector('#modalMessage');
        this.cancelButton = this.querySelector('#cancelButton');
        this.confirmButton = this.querySelector('#confirmButton');
    }

    async ask({ title, message, cancelButtonText, confirmButtonText } = {}) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.cancelButton.textContent = cancelButtonText || 'Cancel';
        this.confirmButton.textContent = confirmButtonText || 'Confirm';

        return new Promise((resolve) => {
            let promiseFlag = false;

            const confirmHandler = () => {
                resolve(true);
                promiseFlag = true;
                this.modal.hide();
            };
            this.confirmButton.addEventListener('click', confirmHandler);

            const modalHiddenHandler = () => {
                this.confirmButton.removeEventListener('click', confirmHandler);
                this.removeEventListener('hidden.bs.modal', modalHiddenHandler);
                if (!promiseFlag) {
                    resolve(false);
                }
            };
            this.addEventListener('hidden.bs.modal', modalHiddenHandler);

            this.modal.show();
        });
    }
}

customElements.define('confirm-popup', ConfirmPopup);
