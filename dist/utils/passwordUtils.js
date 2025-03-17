import bcrypt from 'bcrypt';
// Salta lykilorð
export const hashPassword = async (password) => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};
// Sannreyna lykilorð gegn saltinu
export const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
//# sourceMappingURL=passwordUtils.js.map