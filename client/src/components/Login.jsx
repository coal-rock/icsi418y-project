import { useState } from 'react';
import { login } from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState(null);

    async function tryLogin(event) {
        event.preventDefault();
        setResponse(null);

        try {
            const data = await login(username, password);
            setResponse({ message: data.message });
            setPassword('');
        } catch (error) {
            setResponse({ message: error.message });
        }
    }

    return (
        <div className="page center-children">
            <p className="title"> Please Sign In </p>

            <div className="card">
                <form className="form" onSubmit={tryLogin}>

                    <label className="field">Username
                        <input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required />
                    </label>

                    <label className="field">Password
                        <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
                    </label>

                    <button className="primary">Login</button>
                </form>
            </div>

            {response && (
                <p className="field">
                    {response.message}
                </p>
            )}
        </div >
    );
}
