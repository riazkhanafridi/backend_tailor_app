import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";
import Customer from "./Customer.js";

const Order = sequelize.define(
  "Orders",
  {
    orderId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    customerId: {
      type: DataTypes.BIGINT,
      references: {
        model: Customer,
        key: "customerId",
      },
      allowNull: false,
    },

 

 

    // Measurements snapshot (JSON)
    kameez: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    shalwar: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    style: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    first_payment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },

    payments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },

    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
);

Customer.hasMany(Order, { foreignKey: "customerId" ,  onDelete: "CASCADE",});
Order.belongsTo(Customer, { foreignKey: "customerId" });



export default Order;
