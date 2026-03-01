import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthPayload = {
  sub: string;
  email: string;
  status: 'UNVERIFIED' | 'VERIFIED' | 'LOCKED';
  jti?: string;
};

export const signJwt = (payload: AuthPayload, expiresIn: string | number = '1h'): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn });

export const verifyJwt = (token: string): AuthPayload => jwt.verify(token, env.jwtSecret) as AuthPayload;

