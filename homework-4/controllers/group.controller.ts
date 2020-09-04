import { GroupService } from "../services/group.service";
import { Group, GroupCreation } from "../types/group";

const groupService = new GroupService();

export class GroupController {
  public async update(group: Group): Promise<boolean | null> {
    return groupService.update(group, group.id);
  }
  public async get(id: string): Promise<Group | null> {
    return groupService.getOneById(id);
  }
  public async getAll(): Promise<Array<Group> | null> {
    return groupService.getAll();
  }
  public async create(group: GroupCreation): Promise<Group | null> {
    return groupService.create(group);
  }
  public async delete(id: string): Promise<number | null> {
    return groupService.delete(id);
  }
  public async exists(id: string): Promise<boolean | null> {
    return groupService.exists(id);
  }
  public async addUsers(id: string, users: Array<string>): Promise<boolean | null> {
    return groupService.addUsers(id, users);
  }
}
