import { UsersModel } from "../models/users.model";
import { UserService } from "../services/user.service";
import {
  UserCreation,
  UserSearchReq as UserSearchData,
  UserUpdate
} from "../types/user";

const userService = new UserService();

export class UserController {
  public async userExists(id: string): Promise<boolean> {
    return userService.exists(id);
  }

  public async getSuggestString(
    loginSubStr: string,
    limit: number
  ): Promise<UsersModel[] | null> {
    const searchData: UserSearchData = { loginSubStr, limit };
    return userService.search(searchData);
  }

  public async getUser(id: string): Promise<UsersModel | null> {
    return userService.getOneById(id);
  }

  public async updateUser({
    id,
    login,
    password,
    age,
  }: UserUpdate): Promise<boolean | null> {
    const updateData = { login, password, age };
    return userService.update(updateData, id);
  }

  public async createUser({
    login,
    password,
    age,
  }: UserCreation): Promise<UsersModel | null> {
    const userToCreate: UserCreation = {
      login,
      password,
      age,
    };
    return userService.create(userToCreate);
  }

  public async deleteUser(id: string): Promise<number | null> {
    return userService.softDelete(id);
  }
}
