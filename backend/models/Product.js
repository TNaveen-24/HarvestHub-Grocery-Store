import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subcategory: {
      type: String,
      required: true,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["kg", "gram", "liter", "ml", "piece", "dozen", "packet"],
    },
    unitSize: {
      type: String,
      required: [true, "Unit size is required"], // e.g., "1", "500", "2.5"
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    minStock: {
      type: Number,
      default: 10, // Minimum stock level for alerts
    },
    maxStock: {
      type: Number,
      default: 1000,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    barcode: String,
    tags: [String],
    nutrition: {
      calories: Number,
      protein: Number, // in grams
      carbs: Number, // in grams
      fat: Number, // in grams
      fiber: Number, // in grams
      sugar: Number, // in grams
    },
    attributes: {
      organic: { type: Boolean, default: false },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: false },
      locallySourced: { type: Boolean, default: false },
      seasonal: { type: Boolean, default: false },
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxLength: [500, "Review cannot exceed 500 characters"],
        },
        images: [
          {
            public_id: String,
            url: String,
          },
        ],
        helpful: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiryDate: Date,
    manufacturingDate: Date,
    origin: String, // Country/state of origin
    storageInstructions: String,
    preparationTime: Number, // in minutes for ready-to-cook items
    shelfLife: Number, // in days

    // SEO fields
    slug: {
      type: String,
      unique: true,
    },
    metaTitle: String,
    metaDescription: String,

    // Pricing and offers
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    saleStartDate: Date,
    saleEndDate: Date,

    // Status flags
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },

    // Delivery info
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    deliveryTime: {
      min: Number, // minimum delivery time in hours
      max: Number, // maximum delivery time in hours
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "ratings.average": -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for discount amount
productSchema.virtual("discountAmount").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Virtual for calculated discount percentage
productSchema.virtual("calculatedDiscountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "out-of-stock";
  if (this.stock <= this.minStock) return "low-stock";
  return "in-stock";
});

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  // Calculate discount percentage if not set
  if (
    this.originalPrice &&
    this.originalPrice > this.price &&
    !this.discountPercentage
  ) {
    this.discountPercentage = this.calculatedDiscountPercentage;
  }

  next();
});

// Method to add review
productSchema.methods.addReview = function (
  userId,
  rating,
  comment,
  images = []
) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  this.reviews.push({
    user: userId,
    rating,
    comment,
    images,
  });

  // Recalculate average rating
  this.calculateAverageRating();

  return this.save();
};

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.ratings.average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.ratings.count = this.reviews.length;
};

// Method to update stock
productSchema.methods.updateStock = function (
  quantity,
  operation = "decrease"
) {
  if (operation === "decrease") {
    if (this.stock < quantity) {
      throw new Error("Insufficient stock");
    }
    this.stock -= quantity;
  } else {
    this.stock += quantity;
  }

  return this.save();
};

// Static method to find low stock products
productSchema.statics.findLowStock = function () {
  return this.find({
    $expr: { $lte: ["$stock", "$minStock"] },
  });
};

// Static method to find featured products
productSchema.statics.findFeatured = function () {
  return this.find({ isFeatured: true, isActive: true })
    .populate("category")
    .sort({ createdAt: -1 });
};

export default mongoose.model("Product", productSchema);
