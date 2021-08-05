import crypto from 'crypto';

const encryptPassword = async (email: string, plainPassword: string) => {
    return new Promise<string>((resolve) => crypto.pbkdf2(plainPassword, email, 9999, 64, 'sha512', (err, derivedKey) => {
        resolve(derivedKey.toString('base64'));
    }));
}

export default encryptPassword;