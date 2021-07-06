import { getSession } from 'next-auth/client';

import { connectToDatabase } from '../../../helpers/db';
import { isValidInput, isValidPassword } from '../../../helpers/validateInput';
import { verifyPassword, hashPassword } from '../../../helpers/auth';

const handler = async (req, res) => {
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req: req });

    if (!session) {
        res.status(401).json({ message: 'Not authenticated!' });
        return;
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (oldPassword === newPassword) {
        res.status(422).json({
            error: 'Old and New password should not match',
        });
        return;
    }

    const validatedPassword =
        isValidInput(newPassword) && isValidPassword(newPassword)
            ? true
            : false;

    if (!validatedPassword) {
        res.status(422).json({ error: 'Must enter valid password..' });
        return;
    }

    let client;
    try {
        client = await connectToDatabase();
    } catch (error) {
        res.status(500).json({ error: 'Could not connect to database' });
    }

    const db = client.db().collection('users');

    let user;
    try {
        user = await db.findOne({ email: userEmail });
    } catch (error) {
        res.status(500).json({ error: 'Could not search database' });
        client.close();
        return;
    }

    if (!user) {
        res.status(404).json({ error: 'User not found.' });
        client.close();
        return;
    }

    const currentPassword = user.password;

    let passwordsAreEqual;
    try {
        passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong comparing your passwords.',
        });
        client.close();
        return;
    }

    if (!passwordsAreEqual) {
        res.status(422).json({ error: 'Invalid password.' });
        client.close();
        return;
    }

    let hashedPassword;
    try {
        hashedPassword = await hashPassword(newPassword);
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong encrypting your password',
        });
        client.close();
        return;
    }

    try {
        await db.updateOne(
            { email: userEmail },
            { $set: { password: hashedPassword } }
        );
        res.status(200).json({ message: 'Password updated!' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong updating your password.',
        });
    }

    client.close();
};

export default handler;
