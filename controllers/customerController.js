import cloudinary from "../config/cloudinary.js";
import Customer from "../models/Customer.js";
import AsyncWrapper from "../utils/asyncWrapper.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import ErrorHandler from "../utils/errorHandler.js";
import  SuccessMessage  from "../utils/SuccessMessage.js";



export const addCustomer = AsyncWrapper(async (req, res, next) => {
  const { full_name, nick_name, phone, address, kameez, shalwar, style, notes } = req.body;

  let image = null;
  let imagePublicId = null;

  // Handle image upload
  if (req.file) {
    try {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "customers");
      image = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    } catch (error) {
      return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }
  }

  // Parse JSON objects safely
  let kameezObj = null;
  let shalwarObj = null;
  let styleObj = null;

  if (kameez) {
    try {
      kameezObj = typeof kameez === "string" ? JSON.parse(kameez) : kameez;
    } catch (error) {
      return next(new ErrorHandler("Invalid kameez format. Must be valid JSON.", 400));
    }
  }

  if (shalwar) {
    try {
      shalwarObj = typeof shalwar === "string" ? JSON.parse(shalwar) : shalwar;
    } catch (error) {
      return next(new ErrorHandler("Invalid shalwar format. Must be valid JSON.", 400));
    }
  }

  if (style) {
    try {
      styleObj = typeof style === "string" ? JSON.parse(style) : style;
    } catch (error) {
      return next(new ErrorHandler("Invalid style format. Must be valid JSON.", 400));
    }
  }

  // Create customer
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
  const { id } = req.params;
  const { full_name, nick_name, phone, address, kameez, shalwar, style, notes } = req.body;

  const customer = await Customer.findByPk(id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  // Update image if new file is uploaded
  if (req.file) {
    try {
      // Delete old image from Cloudinary if exists
      if (customer.imagePublicId) {
        await cloudinary.uploader.destroy(customer.imagePublicId);
      }
      
      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer, "customers");
      customer.image = uploadResult.secure_url;
      customer.imagePublicId = uploadResult.public_id;
    } catch (error) {
      return next(new ErrorHandler("Failed to upload image to Cloudinary", 500));
    }
  }

  // Parse and update JSON fields safely
  if (kameez) {
    try {
      customer.kameez = typeof kameez === "string" ? JSON.parse(kameez) : kameez;
    } catch (error) {
      return next(new ErrorHandler("Invalid kameez format. Must be valid JSON.", 400));
    }
  }

  if (shalwar) {
    try {
      customer.shalwar = typeof shalwar === "string" ? JSON.parse(shalwar) : shalwar;
    } catch (error) {
      return next(new ErrorHandler("Invalid shalwar format. Must be valid JSON.", 400));
    }
  }

  if (style) {
    try {
      customer.style = typeof style === "string" ? JSON.parse(style) : style;
    } catch (error) {
      return next(new ErrorHandler("Invalid style format. Must be valid JSON.", 400));
    }
  }

  // Update other fields (only if provided)
  if (full_name) customer.full_name = full_name;
  if (nick_name) customer.nick_name = nick_name;
  if (phone) customer.phone = phone;
  if (address) customer.address = address;
  if (notes !== undefined) customer.notes = notes; // Allow empty string

  await customer.save();

  return SuccessMessage(res, "Customer updated successfully.", customer);
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
