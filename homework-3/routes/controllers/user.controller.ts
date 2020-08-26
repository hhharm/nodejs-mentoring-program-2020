import { v4 as uuidv4 } from "uuid";
import { User, UserCreation } from "../../types/user";
import { sortBy, slice, filter, find, findIndex } from "lodash";
import { CODE_NOT_FOUND, CODE_OK, ResultCode } from "../../types/results";

export class UserController {
  public getSuggestString(loginSubStr: string, limit: number): User[] {
    const findUserByLoginSubstr = (user: User) =>
      user.login.toLowerCase().includes(loginSubStr);
    const users: User[] = sortBy(
      slice(filter(USER_COLLECTION, findUserByLoginSubstr), 0, limit),
      "login"
    ) as User[];
    return users;
  }

  public getUser(id: string): User | undefined {
    return find(USER_COLLECTION, { id });
  }

  public updateUser({
    id,
    login,
    password,
    age,
  }: UserCreation): User | undefined {
    const userIndex: number = findIndex(USER_COLLECTION, { id });
    if (userIndex === -1) {
      return;
    } else {
      return {
        ...USER_COLLECTION[userIndex],
        age,
        login,
        password,
      };
    }
  }

  /**
   * create user
   */
  public createUser({ login, password, age }: UserCreation): User {
    const user: User = {
      id: uuidv4(),
      login,
      password,
      age,
      isDeleted: false,
    };
    USER_COLLECTION.push(user);
    return user;
  }

  /**
   * deleteUser
   * 0 if deleted, 1 if not found
   */
  public deleteUser(id: string): ResultCode {
    const userIndex = findIndex(USER_COLLECTION, { id });
    if (userIndex === -1) {
      return { code: CODE_NOT_FOUND };
    }
    USER_COLLECTION[userIndex] = {
      ...USER_COLLECTION[userIndex],
      isDeleted: true,
    };
    return { code: CODE_OK };
  }
}

// todo: delete
const ADMIN: User = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  login: "admin",
  password: "password",
  age: 25,
  isDeleted: false,
};
const MODERATOR: User = {
  id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  login: "moderator",
  password: "password",
  age: 23,
  isDeleted: false,
};
const USER_COLLECTION: User[] = [ADMIN, MODERATOR];
