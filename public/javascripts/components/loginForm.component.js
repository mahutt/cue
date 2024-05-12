class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.loginAttempts = 0;
    }
    connectedCallback() {
        this.classList.add('needs-validation');
        this.innerHTML =
            /*html*/
            `
            <div class="alert alert-danger d-none" role="alert"></div>
            <div class="has-validation mb-3">
                <label for="name" class="form-label">Name</label>
                <input id="name" class="form-control" type="text" required />
                <div class="invalid-feedback">
                    Required.
                </div>
            </div>
            <div class="has-validation mb-3">
                <label for="password" class="form-label">Password</label>
                <input id="password" class="form-control" type="password" required />
                <div class="invalid-feedback">
                    Required.
                </div>
            </div>
            <button id="submit" class="btn btn-dark w-100">
                <span class="spinner-border spinner-border-sm d-none" aria-hidden="true"></span>
                Login
            </button>
        `;
        this.alert = this.querySelector('.alert');
        this.username = this.querySelector('#name');
        this.password = this.querySelector('#password');
        this.submit = this.querySelector('#submit');
        this.spinner = this.querySelector('.spinner-border');
        this.username.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.password.focus();
            }
        });
        this.password.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.login();
            }
        });
        this.querySelector('#submit').addEventListener('click', this.login.bind(this));
    }

    async login() {
        this.disableSubmit();
        if (this.loginAttempts === 0) {
            this.addEventListener('keyup', this.validate.bind(this));
        }
        this.loginAttempts++;

        if (!this.validate()) {
            this.enableSubmit();
            return;
        }

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
            body: JSON.stringify({ name: this.username.value, password: this.password.value }),
        });

        const data = await response.json();
        if (data.error !== undefined) {
            this.warn(data.error);
            this.enableSubmit();
        } else {
            window.location.href = window.location.origin + `/${this.username.value}`;
        }
    }

    validate() {
        let valid = true;

        for (let input of [this.username, this.password]) {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        }

        return valid;
    }

    disableSubmit() {
        this.username.disabled = true;
        this.password.disabled = true;
        this.submit.disabled = true;
        this.spinner.classList.remove('d-none');
    }

    enableSubmit() {
        this.username.disabled = false;
        this.password.disabled = false;
        this.submit.disabled = false;
        this.spinner.classList.add('d-none');
    }

    warn(message) {
        this.alert.textContent = message;
        this.alert.classList.remove('d-none');
    }

    hideAlert() {
        this.alert.classList.add('d-none');
    }
}
customElements.define('login-form', LoginForm);
