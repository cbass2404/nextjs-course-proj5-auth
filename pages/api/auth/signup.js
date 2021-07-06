import { connectToDatabase } from '../../../helpers/db';
import {
    isValidEmail,
    isValidPassword,
    isValidInput,
} from '../../../helpers/validateInput';
import { hashPassword } from '../../../helpers/auth';

const handler = async (req, res) => {
    const data = req.body;

    const { email, password } = data;

    const validatedEmail =
        isValidInput(email) || isValidEmail(email) ? true : false;

    const validatedPassword =
        isValidInput(password) || isValidPassword(password) ? true : false;

    if (!validatedEmail || !validatedPassword) {
        if (!validatedEmail && !validatedPassword) {
            res.status(422).json({
                message: 'Must enter valid email and password',
            });
        } else if (!validatedEmail) {
            res.status(422).json({ message: 'Must enter valid email' });
        } else {
            res.status(422).json({ message: 'Must enter valid password' });
        }
        return;
    }

    let client;
    try {
        client = await connectToDatabase();
    } catch (error) {
        res.status(500).json({ message: 'Failed to connect to database...' });
        return;
    }

    const db = client.db();

    const hashedPassword = hashPassword(password);

    const newUser = {
        email,
        password: hashedPassword,
    };

    let result;

    try {
        result = await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: 'Created user!', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to make user account...' });
    }

    client.close();
    return;
};

export default handler;
