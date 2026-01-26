

import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";




const dbInit = async () => {
  try {
    // console.log("🕐 Syncing database...");

    // Disable foreign key checks temporarily (safe for development)
    // await User.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await Customer.sync({ alter: true });
    await User.sync({ alter: true });
    await Order.sync({ alter: true });
 
    
   

    // await User.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ All models synced successfully!");
  } catch (err) {
    console.error("❌ Database sync failed:", err);
  }
};

export default dbInit;
