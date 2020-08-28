import { Op } from "sequelize";
import { UsersModel } from "../models/users.model";
import { User, UserCreation, UserSearchReq as UserSearch } from "../types/user";

export class UserService {
  public async exists(id: string): Promise<boolean> {
    const user = await UsersModel.findOne({ where: { id } }).catch((err) => {
      console.error("Error in userExists: ", err);
      return null;
    });
    return user !== null;
  }

  public async search(searchObj: UserSearch): Promise<UsersModel[] | null> {
    const loginCond = searchObj.loginSubStr
      ? { where: { login: { [Op.iLike]: "%" + searchObj.loginSubStr + "%" } } }
      : {};
    return UsersModel.findAll({
      ...loginCond,
      limit: searchObj.limit || 0,
      order: [["login", "ASC"]],
    }).catch((err) => {
      console.error("error in getSuggestString: ", err);
      return null;
    });
  }

  public async getOneById(id: string): Promise<UsersModel | null> {
    return UsersModel.findOne({ where: { id } }).catch((err) => {
      console.error("findOne failed: ", err);
      return null;
    });
  }

  public async update(
    user: Partial<User>,
    id: string
  ): Promise<boolean | null> {
    const updatedModel: [number, UsersModel[]] = await UsersModel.update(user, {
      where: { id },
    }).catch((err) => {
      console.error("findOne failed: ", err);
      return [0, []];
    });
    // UsersModels.update returns [number of affecred rows]
    return !!updatedModel ? updatedModel[0] === 1
      : null;
  }

  public async create(user: UserCreation): Promise<UsersModel | null> {
    const userBuild = UsersModel.build(user);
    return userBuild.save().catch((err) => {
      console.error("cannot create", err);
      return null;
    });
  }

  public async delete(id: string): Promise<number | null> {
    return UsersModel.destroy({ where: { id } }).catch((err) => {
      console.error(err);
      return null;
    });
  }

  public async softDelete(id: string): Promise<number | null> {
    const res: boolean | null = await this.update({ isDeleted: true }, id);
    return !!res ? null : 1;
  }
}
