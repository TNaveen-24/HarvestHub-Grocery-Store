import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    image: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: null,
    },

    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: null,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    metaTitle: {
      type: String,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },

    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    commission: {
      type: Number,
      min: [0, "Commission cannot be negative"],
      max: [100, "Commission cannot exceed 100%"],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subcategories
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Virtual for products in this category
categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

// Create slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Index for better query performance
categorySchema.index({ name: 1, parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ displayOrder: 1 });

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function () {
  const categories = await this.find({ isActive: true })
    .populate("subcategories")
    .sort({ displayOrder: 1, name: 1 });

  return categories.filter((cat) => !cat.parent);
};

// Static method to get all subcategories of a category
categorySchema.statics.getSubcategories = async function (parentId) {
  const subcategories = [];

  const findSubcategories = async (parentId) => {
    const children = await this.find({ parent: parentId, isActive: true });
    subcategories.push(...children);

    for (const child of children) {
      await findSubcategories(child._id);
    }
  };

  await findSubcategories(parentId);
  return subcategories;
};

// Instance method to get full category path
categorySchema.methods.getFullPath = async function () {
  const path = [this.name];
  let currentCategory = this;

  while (currentCategory.parent) {
    currentCategory = await this.constructor.findById(currentCategory.parent);
    if (currentCategory) {
      path.unshift(currentCategory.name);
    } else {
      break;
    }
  }

  return path.join(" > ");
};

// Instance method to check if category has products
categorySchema.methods.hasProducts = async function () {
  const Product = mongoose.model("Product");
  const productCount = await Product.countDocuments({
    category: this._id,
    isActive: true,
  });
  return productCount > 0;
};

// Instance method to check if category has subcategories
categorySchema.methods.hasSubcategories = async function () {
  const subcategoryCount = await this.constructor.countDocuments({
    parent: this._id,
    isActive: true,
  });
  return subcategoryCount > 0;
};

// Pre-remove hook to handle cascading
categorySchema.pre("remove", async function (next) {
  // Check for subcategories
  const hasSubcategories = await this.hasSubcategories();
  if (hasSubcategories) {
    return next(new Error("Cannot delete category with subcategories"));
  }

  // Check for products
  const hasProducts = await this.hasProducts();
  if (hasProducts) {
    return next(new Error("Cannot delete category with products"));
  }

  next();
});

export default mongoose.model("Category", categorySchema);
