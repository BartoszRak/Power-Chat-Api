import * as serviceAccountDevJson from './power-chat-dev.json';
// TODO: add prod service account prod

export const stage: string = process.env.STAGE || 'dev';

// TODO: exchange prod service account to real prod service account
export const serviceAccount: any =
  stage !== 'prod'
    ? { ...serviceAccountDevJson }
    : { ...serviceAccountDevJson };

// TODO: exchange prod url to real prod url
export const firebaseConfig: { [key: string]: string } = {
  databaseUrl:
    stage !== 'prod'
      ? 'https://power-chat-dev.firebaseio.com'
      : 'https://power-chat-dev.firebaseio.com',
};

export const nodemailerCredentials: { email: string; password: string } = {
  email:
    process.env.NODEMAILER_EMAIL || 'potezne.podlaskie.konto.testowe@gmail.com',
  password: process.env.NODEMAILER_PASSWORD || '123!@#abcABC',
};

export const jwtSecret: string = serviceAccount.private_key;
export const jwtSignOptions: any = {
  algorithm: 'RS256',
  expiresIn: 3600,
};
