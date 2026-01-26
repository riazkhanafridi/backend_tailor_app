import cloudinary from "../config/cloudinary.js";
import Customer from "../models/Customer.js";
import AsyncWrapper from "../utils/asyncWrapper.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import ErrorHandler from "../utils/errorHandler.js";
import  SuccessMessage  from "../utils/SuccessMessage.js";


export const addCustomer = AsyncWrapper(async (req, res, next) => {
  try {
    const { full_name, nick_name, phone, address, kameez, shalwar, style, notes } = req.body;

  

    let image = null;
    let imagePublicId = null;

    if (req.file) {
      
      const uploadResult = await uploadToCloudinary(req.file.buffer, "customers");
      image = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
      
    }

    // Ensure JSON objects (parse only if string) 
    const kameezObj = typeof kameez === "string" ? JSON.parse(kameez) : kameez;
    const shalwarObj = typeof shalwar === "string" ? JSON.parse(shalwar) : shalwar;
    const styleObj = typeof style === "string" ? JSON.parse(style) : style;

    const customer = await Customer.create({
      full_name,
      nick_name,
      phone,
      address,
      image,
      imagePublicId,
      kameez: kameezObj,
      shalwar: shalwarObj,
      style: styleObj,
      notes,
    });

    return SuccessMessage(res, "Customer created successfully.", customer);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});





export const getAllCustomers = AsyncWrapper(async (req, res, next) => {
  try {
    const customers = await Customer.findAll(); 
    return SuccessMessage(res, "Customers retrieved successfully.", customers);
    } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getCustomerById = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }
    return SuccessMessage(res, "Customer retrieved successfully.", customer);
    } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});
export const updateProfile = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, nick_name } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return next(new ErrorHandler("Customer not found", 404));
    }

    // 🔹 Update image if provided
    if (req.file) {
      if (customer.imagePublicId) {
        await cloudinary.uploader.destroy(customer.imagePublicId);
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer, "customers");
      customer.image = uploadResult.secure_url;
      customer.imagePublicId = uploadResult.public_id;
    }

    // 🔹 Update only allowed fields
    if (full_name) customer.full_name = full_name;
    if (nick_name) customer.nick_name = nick_name;

    await customer.save();

    return SuccessMessage(
      res,
      "Customer profile updated successfully.",
      customer
    );
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updateCustomer = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, nick_name, phone, address, kameez, shalwar, style, notes } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) return next(new ErrorHandler("Customer not found", 404));

    // Update image if new file is uploaded
    if (req.file) {
      if (customer.imagePublicId) {
        await cloudinary.uploader.destroy(customer.imagePublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, "customers");
      customer.image = uploadResult.secure_url;
      customer.imagePublicId = uploadResult.public_id;
    }

    // Only parse if string, otherwise use object directly
    // customer.kameez = kameez
    //   ? typeof kameez === "string"
    //     ? JSON.parse(kameez)
    //     : kameez
    //   : customer.kameez;

    // customer.shalwar = shalwar
    //   ? typeof shalwar === "string"
    //     ? JSON.parse(shalwar)
    //     : shalwar
    //   : customer.shalwar;

    // customer.style = style
    //   ? typeof style === "string"
    //     ? JSON.parse(style)
    //     : style
    //   : customer.style;
       // Ensure JSON objects (parse only if string)
    customer.kameez = kameez ? (typeof kameez === "string" ? JSON.parse(kameez) : kameez) : customer.kameez;
    console.log(typeof customer.kameez);

    customer.shalwar = shalwar ? (typeof shalwar === "string" ? JSON.parse(shalwar) : shalwar) : customer.shalwar;
    customer.style = style ? (typeof style === "string" ? JSON.parse(style) : style) : customer.style;

    // Update other fields
    customer.full_name = full_name || customer.full_name;
    customer.nick_name = nick_name || customer.nick_name;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.notes = notes || customer.notes;

    await customer.save();

    return SuccessMessage(res, "Customer updated successfully.", customer);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});


export const deleteCustomer = AsyncWrapper(async (req, res, next) => {  
    try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
        return next(new ErrorHandler("Customer not found", 404));
    }
    await customer.destroy();
    return SuccessMessage(res, "Customer deleted successfully.", null);
    } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});
