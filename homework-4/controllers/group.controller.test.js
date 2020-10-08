import { GroupModel } from "../models/group.model";
import { UserGroupModel } from "../models/usergroup.model";
import { GroupController } from "./group.controller";
import * as _ from "lodash";

const permissions = ["READ"];
const newGroup = {
    id: "newid",
    name: "newgroupname",
    permissions
};

const saveObj = {
    save: () => newGroup
};
const groups = [newGroup];

jest.spyOn(GroupModel, "build").mockReturnValueOnce(saveObj);
jest.spyOn(GroupModel, "update").mockImplementation(({id}) => {if (id === "id") return [1];if (!id) throw "id is undefined";return [0];});
jest.spyOn(GroupModel, "findAll").mockImplementation(() => groups);
jest.spyOn(GroupModel, "destroy").mockImplementation(({where: {id}}) => {if (!id) throw new Error;return id === "newid" ? 1 : 0;});
jest.spyOn(GroupModel, "findOne").mockImplementation(({where: {id}}) => {if (!id) throw new Error;return id === "newid" ? 1 : null;});
jest.spyOn(UserGroupModel, "create").mockImplementation(({userId, groupId}) => {if (groupId !== "id") throw new Error(`group with id ${id} does not exist`);});

const groupController = new GroupController();

describe("group update", () => {

    test("should return true on existing value update",  async () => {
           const updateGroup = {
                id: "id",
                name: "name",
                permissions
            };
            expect(await groupController.update(updateGroup)).toEqual(true);
    });
  
    test("should return false on non existing value",  async () => {
            const updateGroup = {
                id: "nonexistingid",
                name: "newgroupname",
                permissions
            };
            expect(await groupController.update(updateGroup)).toEqual(false);
    });
    
    test("should throw error on invalid input",  async () => {
         try {
            await groupController.update({})
         } catch(e) {
             expect(e).toBeTruthy();
         }
    });
});

describe("group create", () => {    
    test("should return new group object on create",  async () => {
          expect(await groupController.create(newGroup)).toEqual(newGroup);
    });
    
    test("should throw error on invalid input",  async () => {
         try {
            await groupController.create({});
         } catch(e) {
             expect(e).toBeTruthy();
         }
    });
});

describe("group get one", () => {
    test("should return 1 on existing id",  async () => {
          expect(await groupController.get("newid")).toEqual(1);
    });
    test("should return null on non existing id",  async () => {
           expect(await groupController.get("someid")).toEqual(null);
    });
    
    test("should throw error on invalid input",  async () => {
         try {
            await groupController.get({});
         } catch(e) {
             expect(e).toBeTruthy();
         }
    });
});

describe("group get all", () => {
    test(" should return array of groups",  async () => {
          expect(await groupController.getAll()).toEqual(groups);
    });
});

describe("group delete", () => {    
    test(" should delete if id exists",  async () => {
          expect(await groupController.delete("newid")).toEqual(1);
    });
    test(" should return 0 if id doesn't exist",  async () => {
          expect(await groupController.delete("ssdfd")).toEqual(0);
    });
    test(" should throw if id is not provided",  async () => {
          try {
            await groupController.delete()
          } catch (e) {
              expect(e).toBeTruthy();
          }
    });
});


describe("group exists", () => {
    test("should return true if exists", async () => {
          expect(await groupController.exists("newid")).toEqual(true);
    });

    test("should return false if not exists", async () => {
           expect(await groupController.exists("someid")).toEqual(false);
    });
});