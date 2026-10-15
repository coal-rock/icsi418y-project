import { useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [saving, setSaving] = useState(false);

    async function login(event) {
        event.preventDefault();
        setSaving(true);
        setFeedback(null);

        try {
            const data = await request('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            setFeedback({ message: data.message });
            setPassword('');
        } catch (error) {
            setFeedback({ message: error.message, error: true });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="page center-children">
            <p className="title"> Please Sign In </p>

            <div className="card">
                <form className="form" onSubmit={login}>

                    <label className="field">Username
                        <input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required />
                    </label>

                    <label className="field">Password
                        <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
                    </label>

                    <button className="primary" disabled={saving}>{saving ? 'Logging in…' : 'Log in'}</button>
                </form>
            </div>
        </div>
    );
}
