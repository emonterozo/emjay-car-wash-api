
interface UserEntityParams {
    id?: string,
    type: string,
    username: string;
    password: string;
}

export class UserEntity {
    private constructor(
        private id: string,
        private type: string,
        private username: string,
        private password: string
    ) { }

    public static create({ id = '', type = '', username = '', password = '' }: UserEntityParams) {
        return new UserEntity(id, type, username, password);
    }

    public getUserType(): string {
        return this.type;
    }

    public getPassword(): string {
        return this.password;
    }

    public getUsername(): string {
        return this.username;
    }

    public validateEmail() {
        // Validation about email here.


        return true;
    }
}