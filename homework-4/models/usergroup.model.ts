import { DataTypes, Model, UUIDV4 } from "sequelize";
import { getDb } from "../data-access";
import { UserGroup } from "../types/usergroup";

export class UserGroupModel extends Model implements UserGroup {
  id!: string;
  userId!: string;
  groupId!: string;
}

const USERGROUP_FIELDS = {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    field: "user_id",
    references: 'users',
    referencesKey: 'id'
  }, 
  groupId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    field: "group_id",
    references: 'groups',
    referencesKey: 'id'
  }, 
}

export function initUserGroupModel(): void {
  UserGroupModel.init(
    USERGROUP_FIELDS,
    {
      sequelize: getDb(),
      modelName: "UserGroup",
      tableName: "usergroup",
      timestamps: false,
      freezeTableName: true
    }
  );
}
