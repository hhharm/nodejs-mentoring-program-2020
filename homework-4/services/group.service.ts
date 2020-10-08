import { Group, GroupCreation } from "../types/group";
import { GroupModel } from "../models/group.model";
import { UserGroupModel } from "../models/usergroup.model";
import { getDb } from "../../homework-4/data-access";

export class GroupService {

  public async exists(id: string): Promise<boolean> {
    const group = await GroupModel.findOne({ where: { id } });
    return group !== null;
  }

  public async getAll(): Promise<Array<Group>> {
    return await GroupModel.findAll();
  }

  public async getOneById(id: string): Promise<Group | null> {
    return await GroupModel.findOne({ where: { id } });
  }

  public async update(
    user: Partial<Group>,
    id: string
  ): Promise<boolean> {
    const updatedModel: [number, Group[]] = await GroupModel.update(user, {
        where: { id },
      });
    
    // GroupModel.update returns [number of affecred rows]
    return updatedModel[0] === 1;
  }

  public async create(group: GroupCreation): Promise<Group> {
      const groupBuild = GroupModel.build(group);
      const res = await groupBuild.save();
      return res;
  }

  public async delete(id: string): Promise<number> {
      return await GroupModel.destroy({ where: { id } });
  }

  public async addUsers(groupId: string, users: Array<string>): Promise<boolean> {
    try {
      // todo: store DB in the class (save it only after DB init)
      const result = await getDb().transaction(
        async (t: any) => await Promise.all(
          users.map((userId: string) => 
            UserGroupModel.create({userId, groupId}, { transaction: t })
          )
        )
      );
      return true;
    } catch (err) {
      console.error("cannot add users to group", err, groupId, users);  
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      return false;
    }
  }
}
