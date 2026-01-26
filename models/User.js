import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";
import { USER_ROLES, USER_STATUS } from "../config/Constants.js";

const User = sequelize.define(
  "Users",
  {
    userId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [3, 100] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: true, len: [3, 254] },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    

    
    login_provider: {
      type: DataTypes.ENUM('local', 'google', 'apple'),
      defaultValue: 'local',
    },
    passwordRetries: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    },
    lockUntil: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    status: {
      type: DataTypes.ENUM(...Object.values(USER_STATUS)),
      allowNull: false,
      defaultValue: USER_STATUS.active,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(USER_ROLES)),
      allowNull: true,
      defaultValue: USER_ROLES.user,
    },
    accessToken: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    refreshToken: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
);

export default User;