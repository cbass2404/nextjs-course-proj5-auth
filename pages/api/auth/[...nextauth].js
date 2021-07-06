import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { connectToDatabase } from '../../../helpers/db';
import { verifyPassword } from '../../../helpers/auth';

export default NextAuth({
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                let client;
                try {
                    client = await connectToDatabase();
                } catch (error) {
                    client.close();
                    throw new Error('Could not connect to database...');
                }

                const usersCollection = client.db().collection('users');

                let user;
                try {
                    user = await usersCollection.findOne({
                        email: credentials.email,
                    });
                } catch (error) {
                    client.close();
                    throw new Error('Unable to query database...');
                }

                if (!user) {
                    client.close();
                    throw new Error('No user found!');
                }

                let isValid;
                try {
                    isValid = await verifyPassword(
                        credentials.password,
                        user.password
                    );
                } catch (error) {
                    client.close();
                    throw new Error('Could not verify password...');
                }

                if (!isValid) {
                    client.close();
                    throw new Error('Could not log in...');
                }

                client.close();
                return { email: user.email };
            },
        }),
    ],
});
