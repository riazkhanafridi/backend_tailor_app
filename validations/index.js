import Joi from "joi";
import {




  USER_ROLES, 
  USER_STATUS,
 
} from "../config/Constants.js";

const phoneSchema = Joi.string()
  .pattern(/^(\+923\d{9}|03\d{9})$/)
  .required()
  .messages({
    "string.pattern.base":
      "Phone number must start with +923 or 03 and contain 10 digits after it.",
    "string.empty": "Phone number is required.",
    "any.required": "Phone number is required.",
  });

const emailSchema = Joi.string()
  .email({ tlds: { allow: true } }) // Disable strict TLD validation
  .required()
  .messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  });

const passwordSchema = Joi.string()
  .pattern(
    new RegExp(
      '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$'
    )
  )
  .required()
  .messages({
    "string.pattern.base":
      "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-15 characters long",
  });

// const stringValidation = (fieldName) =>
//   Joi.string()
//     .required()
//     .messages({
//       "string.empty": `${fieldName} is required.`,
//       "any.required": `${fieldName} is required.`,
//     });

const fullNameSchema = Joi.string().required().max(100);

export const loginSchema = Joi.object({
  phone: Joi.string()
    .required()
    .messages({
      "string.empty": "Phone is required",
      "any.required": "Phone is required",
    }),
  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});




export const addUpdateUserSchema = Joi.object({
  full_name: fullNameSchema,
  
  email: emailSchema,
  phone: phoneSchema,
  password: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!value) {
        return helpers.error("any.required");
      }

      const pattern =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/;
      if (!pattern.test(value)) {
        return helpers.message(
          "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8–15 characters long"
        );
      }

      return value;
    })
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  profile_image: Joi.string()
    .allow(null, "")
    .optional()
    .messages({
      "string.base": "Profile image must be a valid string",
    }),
  login_provider: Joi.string()
    .valid("local", "google", "apple")
    .optional()
    .messages({
      "any.only": "Login provider must be one of local, google, apple",
    }),
  status: Joi.string()
    .valid(...Object.values(USER_STATUS))
    .optional()
    .messages({
      "any.only": `Status must be one of ${Object.values(USER_STATUS).join(", ")}`,
      "string.empty": "Status is required",
    }),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .optional()
    .messages({
      "any.only": `Role must be one of ${Object.values(USER_ROLES).join(", ")}`,
    }),
});
export const addUpdateCustomerSchema = Joi.object({
  full_name: fullNameSchema,
  
  nick_name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Nick name is required",
      "string.min": "Nick name must be at least 2 characters long",
      "string.max": "Nick name must not exceed 50 characters",
      "any.required": "Nick name is required",
    }),

  phone: phoneSchema,

  address: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "Address is required",
      "any.required": "Address is required",
      "string.min": "Address must be at least 3 characters long",
    }),

  image: Joi.string()
    .allow(null, "")
    .optional(),

  imagePublicId: Joi.string()
    .allow(null, "")
    .optional(),

  // ✅ ACCEPT BOTH STRING AND OBJECT
  kameez: Joi.alternatives()
    .try(
      Joi.object().unknown(true),
      Joi.string().custom((value, helpers) => {
        try {
          JSON.parse(value);
          return value;
        } catch (error) {
          return helpers.error('any.invalid');
        }
      })
    )
    .allow(null, "")
    .optional()
    .messages({
      "any.invalid": "Kameez must be a valid JSON string or object",
    }),

  shalwar: Joi.alternatives()
    .try(
      Joi.object().unknown(true),
      Joi.string().custom((value, helpers) => {
        try {
          JSON.parse(value);
          return value;
        } catch (error) {
          return helpers.error('any.invalid');
        }
      })
    )
    .allow(null, "")
    .optional()
    .messages({
      "any.invalid": "Shalwar must be a valid JSON string or object",
    }),

  style: Joi.alternatives()
    .try(
      Joi.object().unknown(true),
      Joi.string().custom((value, helpers) => {
        try {
          JSON.parse(value);
          return value;
        } catch (error) {
          return helpers.error('any.invalid');
        }
      })
    )
    .allow(null, "")
    .optional()
    .messages({
      "any.invalid": "Style must be a valid JSON string or object",
    }),

  notes: Joi.string()
    .allow(null, "")
    .optional(),
});

export const addUpdateOrderSchema = Joi.object({
  customerId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Customer ID must be a number",
      "number.integer": "Customer ID must be an integer",
      "number.positive": "Customer ID must be positive",
      "any.required": "Customer ID is required",
    }),

  quantity: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.positive": "Quantity must be positive",
      "any.required": "Quantity is required",
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be positive",
      "any.required": "Price is required",
    }),

  first_payment: Joi.number()
    .min(0)
    .optional()
    .messages({
      "number.base": "First payment must be a number",
      "number.min": "First payment cannot be negative",
    }),

  payments: Joi.alternatives()
    .try(
      Joi.array().items(
        Joi.object({
          amount: Joi.number().positive().required(),
          date: Joi.date().required(),
          method: Joi.string().optional(),
        })
      ),
      Joi.string().custom((value, helpers) => {
        try {
          JSON.parse(value);
          return value;
        } catch (error) {
          return helpers.error('any.invalid');
        }
      })
    )
    .allow(null, "")  // ✅ FIXED: Removed [] from allow
    .optional()
    .messages({
      "any.invalid": "Payments must be a valid JSON array",
    }),

  delivery_date: Joi.date()
    .required()
    .messages({
      "date.base": "Delivery date must be a valid date",
      "any.required": "Delivery date is required",
    }),

  notes: Joi.string()
    .allow(null, "")
    .optional(),

  status: Joi.string()
    .valid("Pending", "In Progress", "Completed", "Cancelled")
    .optional()
    .messages({
      "any.only": "Status must be one of: Pending, In Progress, Completed, Cancelled",
    }),
});

















// export const addUpdateOrderSchema = Joi.object({
//   customerId: Joi.number().integer().required().messages({
//     "any.required": "Customer ID is required",
//     "number.base": "Customer ID must be a number",
//     "number.integer": "Customer ID must be an integer",
//   }),

//   items: Joi.array()
//     .items(
//       Joi.object({
//         itemId: Joi.number().integer().required().messages({
//           "any.required": "Item ID is required",
//           "number.base": "Item ID must be a number",
//           "number.integer": "Item ID must be an integer",
//         }),

//         varientId: Joi.number().integer().required().messages({
//           "any.required": "Variant ID is required",
//           "number.base": "Variant ID must be a number",
//           "number.integer": "Variant ID must be an integer",
//         }),

//         quantity: Joi.number().integer().min(1).required().messages({
//           "any.required": "Quantity is required",
//           "number.base": "Quantity must be a number",
//           "number.min": "Quantity must be at least 1",
//         }),
//       })
//     )
//     .min(1)
//     .required()
//     .messages({
//       "array.base": "Items must be an array",
//       "array.min": "At least one item is required",
//       "any.required": "Items field is required",
//     }),

//   tableNo: Joi.string().allow(null, "").optional(),

//   description: Joi.string()
//     .allow(null, "")
//     .max(1000)
//     .messages({
//       "string.max": "Description must not exceed 1000 characters",
//     }),

//   discount: Joi.number()
//     .precision(2)
//     .min(0)
//     .optional()
//     .messages({
//       "number.base": "Discount must be a number",
//       "number.min": "Discount cannot be negative",
//     }),

//   date: Joi.date().optional(),

//   time: Joi.string()
//     .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//     .required()
//     .messages({
//       "any.required": "Time is required",
//       "string.pattern.base": "Time must be in HH:mm format",
//     }),

//   status: Joi.string()
//     .valid(...Object.values(ORDER_STATUS))
//     .default(ORDER_STATUS.new),

//   paymentMethod: Joi.string()
//     .valid(...Object.values(PAYMENT_METHOD))
//     .required()
//     .messages({
//       "any.required": "Payment method is required",
//     }),
// });


// export const orderStatusSchema = Joi.object({
//   status: Joi.string()
//     .valid(...Object.values(ORDER_STATUS))
//     .default("pending")
//     .messages({
//       "any.only": `Status must be one of: ${Object.values(ORDER_STATUS).join(
//         ", "
//       )}`,
//     }),
// });

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "current password is required",
    "any.required": "current password is required",
  }),
  newPassword: passwordSchema.label("New Password"),
});






