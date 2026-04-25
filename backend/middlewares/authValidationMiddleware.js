import { body, validationResult } from "express-validator";

// For express-validator (array of rules)
export const validate = (req, res, next) => {
  console.log("Validate middleware called");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// For Joi schema validation
export const validateJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};

// Product validation rules
export const productValidationRules = [
  body("name").trim().notEmpty().withMessage("Product name required").isLength({ min: 3, max: 100 }),
  body("price").isFloat({ min: 0, max: 1000000 }).withMessage("Valid price required"),
  body("stock").isInt({ min: 0, max: 100000 }).withMessage("Valid stock required"),
  body("category").isMongoId().withMessage("Valid category ID required"),
  body("description").optional().trim().isLength({ max: 2000 }),
];

// User validation rules as arrays (not objects)
export const registerValidationRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("name").optional().trim().isLength({ min: 2, max: 50 }),
];

export const loginValidationRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const addressValidationRules = [
  body("name").trim().notEmpty().withMessage("Name required"),
  body("phone").matches(/^\d{10}$/).withMessage("Valid 10-digit phone required"),
  body("addressLine").trim().notEmpty().withMessage("Address line required"),
  body("city").trim().notEmpty().withMessage("City required"),
  body("state").trim().notEmpty().withMessage("State required"),
  body("pincode").matches(/^\d{6}$/).withMessage("Valid 6-digit pincode required"),
];

// OTP validation
export const otpValidationRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
];

export const verifyOtpValidationRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("Valid 6-digit OTP required"),
];

export const resetPasswordValidationRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("Valid 6-digit OTP required"),
  body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];