import { DataTypes, Model, UUIDV4 } from "sequelize";
import { getDb } from "../data-access";
import { Group, Permission } from "../types/group";

export class GroupModel extends Model implements Group {
  id!: string;
  name!: string;
  permissions!: Array<Permission>;
}

const GROUP_FIELDS = {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false,
    unique: true,
    references: 'usergroup',
    referencesKey: 'group_id',
    onDelete: 'cascade'
  },
  name: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: false
  },
};

export function initGroupModel(): void {
  GroupModel.init(
    GROUP_FIELDS,
    {
      sequelize: getDb(),
      modelName: "Groups",
      tableName: "groups",
      timestamps: false,
      freezeTableName: true
    }
  );
}

