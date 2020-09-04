import { Op } from "sequelize";
import { UsersModel } from "../models/users.model";
import { User, UserCreation, UserSearchReq as UserSearch } from "../types/user";

export class UserService {
  public async exists(id: string): Promise<boolean> {
    try {
      const user = await UsersModel.findOne({ where: { id } });
      return user !== null;
    } catch(err) {
      console.error("Error in userExists: ", err);
      return false;
    };
  }

  public async search(searchObj: UserSearch): Promise<UsersModel[] | null> {
    const loginCond = searchObj.loginSubStr
      ? { where: { login: { [Op.iLike]: "%" + searchObj.loginSubStr + "%" } } }
      : {};
      try {
        const res = await UsersModel.findAll({
          ...loginCond,
          limit: searchObj.limit || 0,
          order: [["login", "ASC"]],
        });
        return res;
      } catch (err) {
        console.error("error in getSuggestString: ", err);
        return null;

      }
  }

  public async getOneById(id: string): Promise<UsersModel | null> {
    try {
      return await UsersModel.findOne({ where: { id } })
    } catch (err) {
      console.error("findOne failed: ", err);
      return null;
    }
  }

  public async update(
    user: Partial<User>,
    id: string
  ): Promise<boolean | null> {
    try {
      const updatedModel: [number, UsersModel[]] = await UsersModel.update(user,
         {where: { id },});
      // UsersModels.update returns [number of affecred rows]
      return !!updatedModel ? updatedModel[0] === 1 : null;
    } catch (err) {
      console.error("update user failed: ", err);
      return null;
    }
  }

  public async create(user: UserCreation): Promise<UsersModel | null> {
    try {
    const userBuild = UsersModel.build(user);
    return await userBuild.save()
    } catch (err) {
      console.error("cannot create", err);
      return null;
    };
  }

  public async delete(id: string): Promise<number | null> {
    try {
    return await UsersModel.destroy({ where: { id } })
    } catch (err) {
      console.error(err);
      return null;
    };
  }

  public async softDelete(id: string): Promise<number | null> {
    const res: boolean | null = await this.update({ isDeleted: true }, id);
    return !!res ? null : 1;
  }
}
