import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api';
import { useAuth } from '../hooks/auth-hook';

export default function LoginForm() {
    const navigate = useNavigate();
    const { setLoading: setAuthLoading } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [firstAttempt, setFirstAttempt] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        let valid = true;
        if (!username.trim()) {
            valid = false;
            setInvalidUsername(true);
        } else {
            setInvalidUsername(false);
        }
        if (!password.trim()) {
            valid = false;
            setInvalidPassword(true);
        } else {
            setInvalidPassword(false);
        }
        return valid;
    };

    const login = async () => {
        setFirstAttempt(false);
        if (!validate()) {
            return;
        }
        setLoading(true);

        const response = await api('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
            body: JSON.stringify({ name: username, password }),
        });

        const data = await response.json();
        if (data.error !== undefined) {
            setError(data.error);
            setLoading(false);
        } else {
            const token = data.token;
            document.cookie = `jwt=${token}; path=/; max-age=86400`;
            setAuthLoading(true);
            navigate(`/${username}`);
        }
    };

    useEffect(() => {
        if (firstAttempt) return;
        validate();
    }, [username, password, firstAttempt]);

    return (
        <div className="mt-4 container d-flex justify-content-center">
            <div className="bg-light p-4 rounded-4 needs-validation" style={{ width: 300 }}>
                <div className={`alert alert-danger ${error ? '' : 'd-none'}`} role="alert">
                    {error}
                </div>
                <div className="has-validation mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        id="name"
                        className={`form-control ${invalidUsername ? 'is-invalid' : ''}`}
                        type="text"
                        required
                        disabled={loading}
                    />
                    <div className="invalid-feedback">Required.</div>
                </div>
                <div className="has-validation mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        className={`form-control ${invalidPassword ? 'is-invalid' : ''}`}
                        type="password"
                        required
                        disabled={loading}
                    />
                    <div className="invalid-feedback">Required.</div>
                </div>
                <button id="submit" className="btn btn-dark w-100" onClick={login} disabled={loading}>
                    <span
                        className={`spinner-border spinner-border-sm ${loading ? '' : 'd-none'}`}
                        aria-hidden="true"
                    ></span>
                    Login
                </button>
            </div>
        </div>
    );
}
