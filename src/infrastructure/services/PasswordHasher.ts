import { IPasswordHasher } from "src/application/ports/services/IPasswordHasher";

export class MockPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        return Promise.resolve(password);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        return Promise.resolve(true);
    }
    async generate(): Promise<string> {
        return Promise.resolve("password");
    }
}