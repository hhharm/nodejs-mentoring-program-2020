import { Group, GroupCreation } from "../types/group";
import { GroupModel } from "../models/group.model";
import { UserGroupModel } from "../models/usergroup.model";
import { getDb } from "../../homework-4/data-access";

export class GroupService {

  public async exists(id: string): Promise<boolean | null> {
    let group;
    try {
      group = await GroupModel.findOne({ where: { id } });
    } catch (err) {
      console.error("Error in groupExists: ", err);
      return null;
    }
    return group !== null;
  }

  public async getAll(): Promise<Array<Group> | null> {
    try {
      return await GroupModel.findAll();
    } catch (err) {
      console.error("find all groups failed: ", err);
      return null;      
    }
  }

  public async getOneById(id: string): Promise<Group | null> {
    try {
      return await GroupModel.findOne({ where: { id } })
    } catch(err) {
      console.error("findOne failed: ", err);
      return null;
    };
  }

  public async update(
    user: Partial<Group>,
    id: string
  ): Promise<boolean | null> {
    let updatedModel: [number, Group[]];
    try {
       updatedModel = await GroupModel.update(user, {
        where: { id },
      });
    } catch(err) {
      console.error("update failed: ", err);
      return null;
    };
    // GroupModel.update returns [number of affecred rows]
    return !!updatedModel ? updatedModel[0] === 1
      : null;
  }

  public async create(group: GroupCreation): Promise<Group | null> {
    const groupBuild = GroupModel.build(group);
    try {
      const res = await groupBuild.save();
      return res;
    } catch (err) {
      console.error("cannot create group", err);
      return null;
    }
  }

  public async delete(id: string): Promise<number | null> {
    try {
      const res = await GroupModel.destroy({ where: { id } })
      return res;
    } catch (err) {
      console.error("cannot delete group", err);
      return null;
    }
  }

  public async addUsers(groupId: string, users: Array<string>): Promise<boolean | null> {
    try {
      // todo: store it in the class (init after DB init)
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
      return null;
    }
  }
}
