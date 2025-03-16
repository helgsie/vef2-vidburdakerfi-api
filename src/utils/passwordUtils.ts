import bcrypt from 'bcrypt';

// Salta lykilorð
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};

// Sannreyna lykilorð gegn saltinu
export const verifyPassword = async (
    password: string, 
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};