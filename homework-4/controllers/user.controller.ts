import { UsersModel } from "../models/users.model";
import { UserService } from "../services/user.service";
import {
  UserCreation,
  UserSearchReq as UserSearchData,
  UserUpdate
} from "../types/user";
import { logger } from "../utils/logger.util";

const userService = new UserService();

export class UserController {
  public async userExists(id: string): Promise<boolean> {
    try {
      return await userService.exists(id);
    } catch(err) {
      const args = {id};
      logger.error("Could not check if user exists", args);
      throw(err);
    }
  }

  public async getSuggestString(
    loginSubStr: string,
    limit: number
  ): Promise<UsersModel[]> {
    const searchData: UserSearchData = { loginSubStr, limit };
    try {
      return await userService.search(searchData);
    } catch(err) {
      const args = {loginSubStr, limit};
      logger.error("Could get users by login substring", args);
      throw(err);
    }
  }

  public async getUser(id: string): Promise<UsersModel | null> {
    try {
      return await userService.getOneById(id);
    } catch(err) {
      const args = {id};
      logger.error("Could get user by id", args);
      throw(err);
    }
  }

  public async updateUser({
    id,
    login,
    password,
    age,
  }: UserUpdate): Promise<boolean> {
    try {
      const updateData = { login, password, age };
      return await userService.update(updateData, id);
    } catch(err) {
      const args = {id, login, password, age};
      logger.error("Could update user", args);
      throw(err);
    }
  }

  public async createUser({
    login,
    password,
    age,
  }: UserCreation): Promise<UsersModel> {
    try {
      const userToCreate: UserCreation = {
        login,
        password,
        age,
      };
      return await userService.create(userToCreate);
    } catch(err) {
      const args = {login, password, age};
      logger.error("Could create user", args);
      throw(err);
    }
  }

  public async deleteUser(id: string): Promise<number | null> {
    try {
      return userService.softDelete(id);
    } catch(err) {
      const args = {id};
      logger.error("Could delete user by id", args);
      throw(err);
    }
  }
}
