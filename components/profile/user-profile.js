import { useState } from 'react';

import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handlePasswordUpdate = async (passwordData) => {
        const result = await fetch('/api/user/change-password', {
            method: 'PATCH',
            body: JSON.stringify(passwordData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await result.json();

        if (data.error) {
            setError(data.error);
            return;
        }
        setResponse(data.message);
        return;
    };

    const messageClass = response
        ? classes.success
        : error
        ? classes.error
        : null;

    const handleResponse = () => {
        if (response) {
            return <p className={classes.success}>{response}</p>;
        }

        if (error) {
            return <p className={classes.error}>{error}</p>;
        }
        return;
    };

    return (
        <section className={classes.profile}>
            <h1>Your User Profile</h1>
            <ProfileForm handlePasswordUpdate={handlePasswordUpdate} />
            {handleResponse()}
        </section>
    );
}

export default UserProfile;
