interface UserEntityParams { 
    id?: string, 
    name: string, 
    lastname: string, 
    email: string, 
    password: string 
}

export class UserEntity {
    private constructor(
        private id: string,
        private name: string,
        private lastname: string,
        private email: string,
        private password: string
    ) {}

    public static create({ id = '', name = '', email = '', lastname = '', password = '' }: UserEntityParams) {
        return new UserEntity(id, name, lastname, email, password);
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

    public validateEmail() {
        // Validation about email here.
        

        return true;
    }
}