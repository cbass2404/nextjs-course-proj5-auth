import { hash } from 'brcyptjs';

export const hashPassword = async (password) => {
    // hash takes two arguments, the password and how many times to hash it
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
};
