import { body } from "express-validator";

// Validation for user registration
export const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid Indian mobile number"),
];

// Validation for user login
export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

// Validation for forgot password
export const validateForgotPassword = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

// Validation for reset password
export const validateResetPassword = [
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Validation for update password
export const validateUpdatePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Validation for updating user profile
export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid Indian mobile number"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .toDate()
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 13) {
        throw new Error("You must be at least 13 years old");
      }
      return true;
    }),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
];

// Validation for adding address
export const validateAddress = [
  body("type")
    .isIn(["home", "work", "other"])
    .withMessage("Address type must be home, work, or other"),

  body("fullName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters"),

  body("phone")
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid Indian mobile number"),

  body("addressLine1")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address line 1 must be between 5 and 200 characters"),

  body("addressLine2")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address line 2 cannot exceed 200 characters"),

  body("city")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("pincode")
    .matches(/^\d{6}$/)
    .withMessage("Pincode must be a 6-digit number"),

  body("landmark")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Landmark cannot exceed 100 characters"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean value"),
];

// Validation for product creation/update
export const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number"),

  body("originalPrice")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Original price must be a positive number")
    .custom((value, { req }) => {
      if (value && value <= req.body.price) {
        throw new Error("Original price must be greater than current price");
      }
      return true;
    }),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID"),

  body("brand")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Brand must be between 1 and 50 characters"),

  body("unit")
    .isIn(["kg", "gram", "liter", "ml", "piece", "dozen", "packet"])
    .withMessage("Invalid unit"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("minQuantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Minimum quantity must be at least 1"),

  body("maxQuantityPerOrder")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum quantity per order must be at least 1"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("nutritionalInfo")
    .optional()
    .isObject()
    .withMessage("Nutritional info must be an object"),

  body("storageInstructions")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Storage instructions cannot exceed 500 characters"),

  body("shelfLife")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Shelf life must be a positive number of days"),
];

// Validation for category creation/update
export const validateCategory = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Category description cannot exceed 500 characters"),

  body("parent")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID"),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
];

// Validation for order creation
export const validateOrder = [
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isMongoId()
    .withMessage("Invalid shipping address ID"),

  body("paymentMethod")
    .isIn(["cod", "razorpay", "stripe"])
    .withMessage("Invalid payment method"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.product").isMongoId().withMessage("Invalid product ID"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("couponCode")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters"),
];

// Validation for review creation
export const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Review title must be between 5 and 100 characters"),

  body("comment")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review comment must be between 10 and 1000 characters"),
];
