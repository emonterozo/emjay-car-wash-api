interface UserEntityParams { 
    id?: string, 
    name: string, 
    lastname: string, 
    email: string, 
    username: string;
    password: string;
}

export class UserEntity {
    private constructor(
        private id: string,
        private name: string,
        private lastname: string,
        private email: string,
        private username: string,
        private password: string
    ) {}

    public static create({ id = '', name = '', email = '', lastname = '', username = '', password = '' }: UserEntityParams) {
        return new UserEntity(id, name, lastname, email, username, password);
    }
    

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getLastName(): string {
        return this.lastname;
    }

    public getUsername(): string {
        return this.username;
    }

    public validateEmail() {
        // Validation about email here.
        

        return true;
    }
}