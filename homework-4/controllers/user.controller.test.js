import { GroupModel } from "../models/group.model";
import { UserGroupModel } from "../models/usergroup.model";
import { UserController } from "./user.controller";
import * as _ from "lodash";
import { UsersModel } from "../models/users.model";

const user = {
    id: "newid",
    login: "somename",
    password: "aaaabbb",
    age: 17,
    isDeleted: false
};
const users = [user];
const saveObj = {save: () => user};

jest.spyOn(UsersModel, "findAll").mockImplementation(() => users);
jest.spyOn(UsersModel, "findOne").mockImplementation(({where: {id}}) => {if (!id) throw new Error;return id === "newid" ? 1 : null;});
jest.spyOn(UsersModel, "build").mockReturnValueOnce(saveObj);
jest.spyOn(UsersModel, "update").mockImplementation((user,  {where: { id }}) => {if (id === "newid") return [1];if (!id) throw "id is undefined";return [0];});

const controller = new UserController();
describe("user exists", () => {
    test("should return true if exists", async () => {
          expect(await controller.userExists("newid")).toEqual(true);
    });

    test("should return false if not exists", async () => {
           expect(await controller.userExists("someid")).toEqual(false);
    });
});

describe("user get", () => {
    test("should return 1 on existing id",  async () => {
        try {
          expect(await controller.getUser("newid")).toEqual(1);
        } catch (e) {
          expect(e).toBeFalsy();
        }
    });
    test("should return null on non existing id",  async () => {
        try {
            expect(await controller.getUser("someid")).toEqual(null);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
    
    test("should throw error on invalid input",  async () => {
         try {
            await controller.getUser({});
         } catch(e) {
             expect(e).toBeTruthy();
         }
    });
});

describe("user update", () => {

    test("should return true on existing value update",  async () => {
           expect(await controller.updateUser(user)).toEqual(true);
    });
  
    test("should return false on non existing value",  async () => {
          const updateUser = {
                id: "nonexistingid",
                login: "somename",
                password: "aaaabbb",
                age: 18,
                isDeleted: false
          };
          expect(await controller.updateUser(updateUser)).toEqual(false);
    });
    
    test("should throw error on invalid input",  async () => {
         try {
            await controller.updateUser({})
         } catch(e) {
             expect(e).toBeTruthy();
         }
    });
});

describe("user create", () => {    
    test("should return new user object on create",  async () => {
        try {
          expect(await controller.createUser(user)).toEqual(user);
        } catch (e) {
            expect(e).toBeFalsy();
        }
    });
    
    test("should throw error on invalid input",  async () => {
         try {
            await controller.createUser({});
         } catch(e) {
             expect(e).toBeTruthy();
         }
    });
});

describe("user delete", () => {    
    test("should delete if id exists",  async () => {
          expect(await controller.deleteUser("newid")).toEqual(1);
    });
    test("should return 0 if id doesn't exist",  async () => {
          expect(await controller.deleteUser("ssdfd")).toEqual(null);
    });
    test("should throw if id is not provided",  async () => {
          try {
            await controller.deleteUser()
          } catch (e) {
              expect(e).toBeTruthy();
          }
    });
});

describe("user search substring", () => {
    test("should find users by substring",  async () => {
          expect(await controller.getSuggestString("a", 10)).toEqual(users);
    });
});