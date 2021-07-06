import { useRef } from 'react';
import classes from './profile-form.module.css';

function ProfileForm(props) {
    const oldPasswordInputRef = useRef();
    const newPasswordInputRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const oldPassword = oldPasswordInputRef.current.value;
        const newPassword = newPasswordInputRef.current.value;

        const passwordData = {
            oldPassword,
            newPassword,
        };

        props.handlePasswordUpdate(passwordData);
    };

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.control}>
                <label htmlFor="old-password">Old Password</label>
                <input
                    type="password"
                    id="old-password"
                    ref={oldPasswordInputRef}
                />
            </div>
            <div className={classes.control}>
                <label htmlFor="new-password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    ref={newPasswordInputRef}
                />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
