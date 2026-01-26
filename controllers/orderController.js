import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import AsyncWrapper from "../utils/asyncWrapper.js";
import ErrorHandler from "../utils/errorHandler.js";
import  SuccessMessage  from "../utils/SuccessMessage.js";


export const addOrder = AsyncWrapper(async (req, res, next) => {
  try {
    const { customerId, quantity, price, first_payment, payments, delivery_date, notes, status } = req.body;

    const customer = await Customer.findByPk(customerId);

    if (!customer) return next(new ErrorHandler("Customer not found", 404));

    // Use JSON objects from customer directly
    const order = await Order.create({
      customerId,
      kameez: customer.kameez,
      shalwar: customer.shalwar,
      style: customer.style,
      quantity,
      price,
      first_payment,
      payments: payments ? JSON.parse(payments) : [],
      delivery_date,
      notes,
      status,
    });

    return SuccessMessage(res, "Order created successfully.", order);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});









export const getAllOrders = AsyncWrapper(async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    return SuccessMessage(res, "Orders retrieved successfully.", orders);
    } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});
export const getOrderById = AsyncWrapper(async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }   
        return SuccessMessage(res, "Order retrieved successfully.", order);
    } catch (error) {
        console.error("Error occurred:", error);
        return next(new ErrorHandler(error.message, 500));
    }   
});
export const updateOrder = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, price, first_payment, payments, delivery_date, notes, status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return next(new ErrorHandler("Order not found", 404));

    // Update JSON fields if needed
    order.payments = payments
      ? typeof payments === "string"
        ? JSON.parse(payments)
        : payments
      : order.payments;

    // Update other fields
    order.quantity = quantity || order.quantity;
    order.price = price || order.price;
    order.first_payment = first_payment || order.first_payment;
    order.delivery_date = delivery_date || order.delivery_date;
    order.notes = notes || order.notes;
    order.status = status || order.status;

    await order.save();

    return SuccessMessage(res, "Order updated successfully.", order);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});



export const deleteOrder = AsyncWrapper(async (req, res, next) => {
    try {   
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }
        await order.destroy();
        return SuccessMessage(res, "Order deleted successfully.", null);
    } catch (error) {
        console.error("Error occurred:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});