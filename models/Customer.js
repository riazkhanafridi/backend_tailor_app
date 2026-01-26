import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";

const Customer = sequelize.define(
  "Customers",
  {
    customerId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 

    nick_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // 🔹 Measurements & styles (JSON)
    kameez: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    shalwar: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    style: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Optional: link customer to logged-in user
    // userId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },
  },
  {
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
);

export default Customer;
