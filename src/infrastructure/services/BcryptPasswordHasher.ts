import { IPasswordHasher } from "src/application/ports/services/IPasswordHasher";
import bcrypt from "bcrypt"

export class BCryptPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
       return bcrypt.hash(password, +process.env.SALT_ROUNDS!);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
    async generate(): Promise<string> {
        return Promise.resolve("password");
    }
}