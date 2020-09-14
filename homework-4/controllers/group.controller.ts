import { GroupService } from "../services/group.service";
import { Group, GroupCreation } from "../types/group";
import { logger } from "../utils/logger.util";

const groupService = new GroupService();

export class GroupController {
  public async update(group: Group): Promise<boolean> {
    try {
      return await groupService.update(group, group.id);
    } catch(err) {
      const args = {group};
      logger.error("Cannot update group", args);
      throw(err);
    }  
  }
  public async get(id: string): Promise<Group | null> {
    try {
      return await groupService.getOneById(id);
    } catch(err) {
      const args = {id};
      logger.error("Cannot get group", args);
      throw(err);
    }  
  }
  public async getAll(): Promise<Array<Group>> {
    try {
      return await groupService.getAll();
    } catch(err) {
      const args = {};
      logger.error("Cannot get all groups", args);
      throw(err);
    }
  }
  public async create(group: GroupCreation): Promise<Group> {
    try {
      return await groupService.create(group);
    } catch(err) {
      const args = {group};
      logger.error("Cannot create group", args);
      throw(err);
    }
  }
  public async delete(id: string): Promise<number> {
    try {
      return await groupService.delete(id);
    } catch(err) {
      const args = {id};
      logger.error("Cannot delete group", args);
      throw(err);
    }
  }
  public async exists(id: string): Promise<boolean> {
    try {
      return await groupService.exists(id);
    } catch(err) {
      const args = {id};
      logger.error("Could not check if group exists", args);
      throw(err);
    }
  }
  public async addUsers(id: string, users: Array<string>): Promise<boolean> {
    try {
      return await groupService.addUsers(id, users);
    } catch(err) {
      const args = {id, users};
      logger.error("Could not add users to group", args);
      throw(err);
    }
  }
}
