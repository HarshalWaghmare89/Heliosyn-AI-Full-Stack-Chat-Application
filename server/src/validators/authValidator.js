import Joi from "joi";

//--->> COMMON EMAIL VALIDATION

const email = Joi.string()
  .trim()
  .lowercase()
  .email({
    tlds: {
      allow: false,
    },
  })
  .max(254)
  .required()
  .messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "string.max": "Email must be less than 254 characters.",
    "any.required": "Email is required.",
  });

//--->>> REGISTER VALIDATION

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name must be less than 50 characters.",
    "any.required": "Name is required.",
  }),

  email,

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password must be less than 128 characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      "any.required": "Password is required.",
    }),
});

//--->>> LOGIN VALIDATION

export const loginSchema = Joi.object({
  email,

  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password must be less than 128 characters.",
    "any.required": "Password is required.",
  }),
});
