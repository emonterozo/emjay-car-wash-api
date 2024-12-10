export type UserId = string;

export type UserType = 'ADMIN' | 'SUPERVISOR';

export interface UserDetails {
    type: UserType;
    username: string;
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

