'use strict';
const GROUP_FIELDS = {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false,
    unique: true
  },
  name: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  permissions: {
    type: new DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
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
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('groups', GROUP_FIELDS);  
      await queryInterface.createTable('usergroup', USERGROUP_FIELDS);  
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('groups');
     await queryInterface.dropTable('usergroup');
  }
};
