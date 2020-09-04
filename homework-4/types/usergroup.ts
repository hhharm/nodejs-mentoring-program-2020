import { Optional } from "sequelize";
export interface UserGroup {
  id: string;
  userId: string;
  groupId: string;
}

// export interface UserUpdate extends Optional<User, "isDeleted"> {}
// export interface UserCreation extends Optional<UserUpdate, "id"> {}

// export type UserResponse =
  // | UsersModel
  // | {
      // message: string;
      // errors?: string[];
    // };

// export type UserSearchReq = {
  // loginSubStr?: string;
  // limit?: number;
// };
