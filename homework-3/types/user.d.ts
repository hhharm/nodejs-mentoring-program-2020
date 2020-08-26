import { Optional } from 'sequelize';
export interface User {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export interface UserCreation extends Optional<User, 'id' | 'isDeleted'> {}