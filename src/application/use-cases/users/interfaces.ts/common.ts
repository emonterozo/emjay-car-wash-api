export type UserId = string;

export interface UserDetails {
    name: string;
    email: string;
    lastname: string;
}

export interface UserObject extends UserDetails {
    id: UserId;
    password: string;
}

export interface CreateUserInput extends UserDetails {
    password: string;
}

export interface UpdateUserInput extends Partial<UserDetails> {
    id: UserId;
}

