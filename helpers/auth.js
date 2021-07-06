import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password) => {
    // hash takes two arguments, the password and how many times to hash it
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
    const isValid = await compare(password, hashedPassword);

    return isValid;
};
