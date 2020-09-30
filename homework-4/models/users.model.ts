import { DataTypes, Model, UUIDV4 } from "sequelize";
import { idText } from "typescript";
import { getDb } from "../data-access";
import { User } from "../types/user";

export class UsersModel extends Model implements User {
  id!: string;
  login!: string;
  password!: string;
  age!: number;
  isDeleted!: boolean;
}

const USER_FIELDS = {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: UUIDV4,
    references: 'usergroup',
    referencesKey: 'user_id',
    onDelete: 'cascade'
  },
  login: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: new DataTypes.STRING(50),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 2, max: 200 },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: "is_deleted",
  },
};

export function initUserModel(): void {
  UsersModel.init(
    USER_FIELDS,
    {
      sequelize: getDb(),
      modelName: "Users",
      tableName: "users",
      timestamps: false,
      freezeTableName: true
    }
  );
}
