import { DataTypes, Model, UUIDV4 } from "sequelize";
import { getDb } from "../data-access";

export class UsersModel extends Model {}

const USER_FIELDS = {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: UUIDV4,
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
