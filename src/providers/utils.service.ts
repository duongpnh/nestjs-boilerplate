import { createHash, pbkdf2, randomBytes } from 'crypto';

import { IResponseHashPassword } from './interfaces/IResponseHashPassword';

export const hashPassword = (password: string): Promise<IResponseHashPassword> => {
  const salt = randomBytes(16).toString('hex');

  return new Promise((rs, rj) => {
    pbkdf2(password, salt, 1000, 64, 'sha512', (error, derivedKey) => {
      if (error) {
        return rj(error);
      }

      return rs({ hash: derivedKey.toString('hex'), salt });
    });
  });
};

export const comparePassword = async (password: string, salt: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, 'sha512', (error, derivedKey) => {
      if (error) {
        return reject(error);
      }
      return resolve(hash === derivedKey.toString('hex'));
    });
  });
};

export const md5hash = (text: string): string => {
  return createHash('md5').update(text).digest('hex');
};
