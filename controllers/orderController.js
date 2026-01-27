import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import AsyncWrapper from "../utils/asyncWrapper.js";
import ErrorHandler from "../utils/errorHandler.js";
import  SuccessMessage  from "../utils/SuccessMessage.js";




export const addOrder = AsyncWrapper(async (req, res, next) => {
  const { customerId, quantity, price, first_payment, payments, delivery_date, notes, status } = req.body;

  // Find customer
  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  // Validate that customer has measurements
  if (!customer.kameez || !customer.shalwar || !customer.style) {
    return next(new ErrorHandler("Customer measurements are incomplete. Please update customer profile first.", 400));
  }

  // Parse payments if it's a string
  let paymentsArray = [];
  if (payments) {
    try {
      paymentsArray = typeof payments === "string" ? JSON.parse(payments) : payments;
    } catch (error) {
      return next(new ErrorHandler("Invalid payments format. Must be valid JSON.", 400));
    }
  }

  // Create order with customer's measurements
  const order = await Order.create({
    customerId,
    kameez: customer.kameez,
    shalwar: customer.shalwar,
    style: customer.style,
    quantity,
    price,
    first_payment: first_payment || 0,
    payments: paymentsArray,
    delivery_date,
    notes: notes || null,
    status: status || "Pending",
  });

  return SuccessMessage(res, "Order created successfully.", order);
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


export const updateOrderStatus = AsyncWrapper(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);
        if (!order) return next(new ErrorHandler("Order not found", 404));

        order.status = status;
        await order.save();

        return SuccessMessage(res, "Order status updated successfully.", order);
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