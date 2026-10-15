import { useState } from 'react';
import { signup } from '../api';

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState(null);

    async function tryLogin(event) {
        event.preventDefault();
        setResponse(null);

        try {
            const data = await signup(username, password);
            setResponse({ message: data.message });
            setPassword('');
        } catch (error) {
            setResponse({ message: error.message });
        }
    }

    return (
        <div className="page center-children">
            <p className="title"> Please Create an Account </p>

            <div className="card">
                <form className="form" onSubmit={tryLogin}>

                    <label className="field">First Name
                        <input autoComplete="firstname" value={firstName} onChange={event => setFirstName(event.target.value)} required />
                    </label>

                    <label className="field">Last Name
                        <input autoComplete="lastname" value={lastName} onChange={event => setLastName(event.target.value)} required />
                    </label>

                    <label className="field">Username
                        <input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required />
                    </label>

                    <label className="field">Password
                        <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
                    </label>

                    <button className="primary">Sign Up</button>
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
