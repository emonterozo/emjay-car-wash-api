export type AuthToken = string;

export type TokenExpiration = number; // In Seconds (example 60 = 1min)

export interface ITokenService {
    generate(payload: any, expiration?: TokenExpiration): Promise<string>;
}