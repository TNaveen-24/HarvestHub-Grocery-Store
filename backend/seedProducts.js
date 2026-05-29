import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

// ─── Category Data ───────────────────────────────────────────────────────────
const categories = [
  {
    name: "Fruits & Vegetables",
    description: "Fresh fruits and vegetables delivered daily",
    icon: "🥬",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    name: "Dairy & Eggs",
    description: "Fresh milk, cheese, butter, eggs and more",
    icon: "🥛",
    isFeatured: true,
    displayOrder: 2,
  },
  {
    name: "Bakery & Breads",
    description: "Freshly baked breads, cakes, and pastries",
    icon: "🍞",
    isFeatured: true,
    displayOrder: 3,
  },
  {
    name: "Beverages",
    description: "Juices, soft drinks, tea, coffee and more",
    icon: "🥤",
    isFeatured: true,
    displayOrder: 4,
  },
  {
    name: "Snacks & Packaged Foods",
    description: "Chips, biscuits, noodles, and ready-to-eat meals",
    icon: "🍿",
    isFeatured: false,
    displayOrder: 5,
  },
  {
    name: "Staples & Grains",
    description: "Rice, atta, dal, pulses, and cooking essentials",
    icon: "🌾",
    isFeatured: true,
    displayOrder: 6,
  },
  {
    name: "Spices & Condiments",
    description: "Masalas, sauces, oils, and seasonings",
    icon: "🌶️",
    isFeatured: false,
    displayOrder: 7,
  },
  {
    name: "Personal Care",
    description: "Shampoo, soap, skincare, and hygiene essentials",
    icon: "🧴",
    isFeatured: false,
    displayOrder: 8,
  },
];

// ─── Product Data ────────────────────────────────────────────────────────────
// Products will reference categories by index (resolved to ObjectId at seed time)
const products = [
  // ── Fruits & Vegetables (index 0) ──
  {
    catIdx: 0, name: "Fresh Bananas", description: "Sweet and ripe Cavendish bananas, perfect for smoothies and snacking. Rich in potassium and natural energy.",
    price: 45, originalPrice: 55, brand: "Farm Fresh", unit: "dozen", unitSize: "1",
    subcategory: "Fruits", stock: 200, sku: "FV-BAN-001",
    nutrition: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 },
    attributes: { organic: false, locallySourced: true, seasonal: false },
    tags: ["banana", "fruit", "potassium", "healthy"],
    isFeatured: true, isNewArrival: false,
  },
  {
    catIdx: 0, name: "Organic Red Apples", description: "Crisp and juicy organic Himalayan red apples. No pesticides, naturally grown at high altitude.",
    price: 180, originalPrice: 220, brand: "Organic India", unit: "kg", unitSize: "1",
    subcategory: "Fruits", stock: 120, sku: "FV-APL-002",
    nutrition: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10 },
    attributes: { organic: true, locallySourced: false, seasonal: true },
    tags: ["apple", "organic", "fruit", "healthy"],
    isFeatured: true, isNewArrival: true,
  },
  {
    catIdx: 0, name: "Fresh Tomatoes", description: "Vine-ripened farm tomatoes, perfect for curries, salads, and sauces.",
    price: 35, originalPrice: 45, brand: "Farm Fresh", unit: "kg", unitSize: "1",
    subcategory: "Vegetables", stock: 300, sku: "FV-TOM-003",
    nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 },
    attributes: { organic: false, locallySourced: true },
    tags: ["tomato", "vegetable", "cooking"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 0, name: "Baby Spinach", description: "Tender baby spinach leaves, pre-washed and ready to use. Great for salads and smoothies.",
    price: 60, originalPrice: 75, brand: "Green Harvest", unit: "gram", unitSize: "200",
    subcategory: "Vegetables", stock: 150, sku: "FV-SPN-004",
    nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
    attributes: { organic: true, locallySourced: true },
    tags: ["spinach", "leafy", "salad", "healthy"],
    isFeatured: false, isNewArrival: true,
  },
  {
    catIdx: 0, name: "Fresh Mangoes (Alphonso)", description: "Premium Ratnagiri Alphonso mangoes. Known as the 'King of Mangoes' for their rich aroma and taste.",
    price: 450, originalPrice: 550, brand: "Ratnagiri Select", unit: "dozen", unitSize: "1",
    subcategory: "Fruits", stock: 80, sku: "FV-MNG-005",
    attributes: { organic: false, locallySourced: true, seasonal: true },
    tags: ["mango", "alphonso", "seasonal", "premium"],
    isFeatured: true, isNewArrival: true,
  },

  // ── Dairy & Eggs (index 1) ──
  {
    catIdx: 1, name: "Full Cream Milk", description: "Farm-fresh full cream pasteurized milk. Rich and creamy, sourced from healthy cattle.",
    price: 68, originalPrice: 72, brand: "Amul", unit: "liter", unitSize: "1",
    subcategory: "Milk", stock: 500, sku: "DE-MLK-001",
    nutrition: { calories: 65, protein: 3.3, carbs: 4.7, fat: 3.5, sugar: 4.7 },
    attributes: { organic: false, locallySourced: true },
    tags: ["milk", "dairy", "amul", "fresh"],
    isFeatured: true, isNewArrival: false,
  },
  {
    catIdx: 1, name: "Farm Eggs (Free Range)", description: "Free-range eggs from healthy hens raised in open pastures. Rich in protein and omega-3.",
    price: 95, originalPrice: 110, brand: "Country Farms", unit: "dozen", unitSize: "1",
    subcategory: "Eggs", stock: 250, sku: "DE-EGG-002",
    nutrition: { calories: 72, protein: 6.3, carbs: 0.4, fat: 5, sugar: 0.2 },
    attributes: { organic: true, locallySourced: true },
    tags: ["eggs", "free-range", "protein", "breakfast"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 1, name: "Greek Yogurt (Plain)", description: "Thick and creamy Greek-style yogurt. High in protein, perfect for breakfast bowls and dips.",
    price: 120, originalPrice: 150, brand: "Epigamia", unit: "gram", unitSize: "400",
    subcategory: "Yogurt", stock: 180, sku: "DE-YOG-003",
    nutrition: { calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, sugar: 3.2 },
    attributes: { organic: false, glutenFree: true },
    tags: ["yogurt", "greek", "protein", "healthy"],
    isFeatured: true, isNewArrival: true,
  },
  {
    catIdx: 1, name: "Paneer (Cottage Cheese)", description: "Fresh, soft, and creamy paneer made from full cream milk. Perfect for curries and grills.",
    price: 90, originalPrice: 100, brand: "Amul", unit: "gram", unitSize: "200",
    subcategory: "Cheese", stock: 200, sku: "DE-PNR-004",
    nutrition: { calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, sugar: 1.2 },
    attributes: { organic: false, glutenFree: true, locallySourced: true },
    tags: ["paneer", "cheese", "protein", "indian"],
    isFeatured: false, isNewArrival: false,
  },

  // ── Bakery & Breads (index 2) ──
  {
    catIdx: 2, name: "Whole Wheat Bread", description: "100% whole wheat bread, freshly baked with no preservatives. Perfect for healthy sandwiches.",
    price: 45, originalPrice: 50, brand: "Harvest Gold", unit: "packet", unitSize: "1",
    subcategory: "Breads", stock: 300, sku: "BB-WBR-001",
    nutrition: { calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, sugar: 6 },
    attributes: { organic: false, vegan: true },
    tags: ["bread", "wheat", "healthy", "breakfast"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 2, name: "Butter Croissants", description: "Flaky, golden French-style croissants made with premium European butter. Pack of 4.",
    price: 180, originalPrice: 220, brand: "La Boulangerie", unit: "packet", unitSize: "4",
    subcategory: "Pastries", stock: 100, sku: "BB-CRS-002",
    nutrition: { calories: 406, protein: 8.2, carbs: 45, fat: 21, sugar: 10 },
    attributes: {},
    tags: ["croissant", "bakery", "breakfast", "french"],
    isFeatured: true, isNewArrival: true,
  },
  {
    catIdx: 2, name: "Multigrain Cookies", description: "Crunchy multigrain cookies with oats, ragi, and honey. A guilt-free snack for all ages.",
    price: 99, originalPrice: 120, brand: "NutriCrunch", unit: "packet", unitSize: "1",
    subcategory: "Cookies", stock: 220, sku: "BB-COK-003",
    nutrition: { calories: 150, protein: 3, carbs: 22, fat: 6, fiber: 3, sugar: 8 },
    attributes: { organic: false },
    tags: ["cookies", "multigrain", "healthy", "snack"],
    isFeatured: false, isNewArrival: false,
  },

  // ── Beverages (index 3) ──
  {
    catIdx: 3, name: "Darjeeling Green Tea", description: "Premium single-estate Darjeeling green tea. Light, floral, and packed with antioxidants.",
    price: 250, originalPrice: 320, brand: "Twinings", unit: "packet", unitSize: "100",
    subcategory: "Tea", stock: 150, sku: "BV-GTE-001",
    nutrition: { calories: 1, protein: 0, carbs: 0, fat: 0, sugar: 0 },
    attributes: { organic: true, vegan: true },
    tags: ["tea", "green-tea", "darjeeling", "antioxidant"],
    isFeatured: true, isNewArrival: false,
  },
  {
    catIdx: 3, name: "Cold Press Orange Juice", description: "100% cold-pressed orange juice with no added sugar. Made from fresh Nagpur oranges.",
    price: 150, originalPrice: 180, brand: "RAW Pressery", unit: "ml", unitSize: "1000",
    subcategory: "Juices", stock: 120, sku: "BV-OJC-002",
    nutrition: { calories: 45, protein: 0.7, carbs: 10, fat: 0.2, sugar: 8.4 },
    attributes: { organic: false, vegan: true },
    tags: ["juice", "orange", "cold-pressed", "fresh"],
    isFeatured: true, isNewArrival: true,
  },
  {
    catIdx: 3, name: "Arabica Coffee Beans", description: "Single-origin Arabica coffee beans from Coorg. Medium roast with chocolatey and nutty notes.",
    price: 450, originalPrice: 550, brand: "Blue Tokai", unit: "gram", unitSize: "250",
    subcategory: "Coffee", stock: 90, sku: "BV-COF-003",
    attributes: { organic: true, locallySourced: true },
    tags: ["coffee", "arabica", "beans", "premium"],
    isFeatured: false, isNewArrival: true,
  },

  // ── Snacks & Packaged Foods (index 4) ──
  {
    catIdx: 4, name: "Classic Salted Chips", description: "Crispy, thinly sliced potato chips with just the right amount of salt. The perfect party snack.",
    price: 30, originalPrice: 35, brand: "Lay's", unit: "gram", unitSize: "130",
    subcategory: "Chips", stock: 400, sku: "SP-CHP-001",
    nutrition: { calories: 536, protein: 6.6, carbs: 53, fat: 33, sugar: 0.3 },
    attributes: { vegan: true, glutenFree: true },
    tags: ["chips", "snack", "potato", "party"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 4, name: "Masala Oats", description: "Instant masala oats with real vegetable flakes and Indian spices. Ready in just 3 minutes.",
    price: 45, originalPrice: 50, brand: "Saffola", unit: "gram", unitSize: "500",
    subcategory: "Instant Foods", stock: 250, sku: "SP-OAT-002",
    nutrition: { calories: 377, protein: 11, carbs: 66, fat: 7, fiber: 10, sugar: 1 },
    attributes: {},
    tags: ["oats", "healthy", "instant", "breakfast"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 4, name: "Trail Mix (Nuts & Berries)", description: "Premium trail mix with almonds, cashews, dried cranberries, and pumpkin seeds. Energy on the go.",
    price: 320, originalPrice: 400, brand: "Happilo", unit: "gram", unitSize: "200",
    subcategory: "Dry Fruits", stock: 130, sku: "SP-TRL-003",
    nutrition: { calories: 520, protein: 15, carbs: 45, fat: 34, fiber: 5, sugar: 28 },
    attributes: { organic: false, glutenFree: true, vegan: true },
    tags: ["trail-mix", "nuts", "berries", "healthy-snack"],
    isFeatured: true, isNewArrival: true,
  },

  // ── Staples & Grains (index 5) ──
  {
    catIdx: 5, name: "Basmati Rice (Aged)", description: "Premium aged basmati rice with extra-long grains. Perfect for biryani and pulao.",
    price: 350, originalPrice: 420, brand: "India Gate", unit: "kg", unitSize: "5",
    subcategory: "Rice", stock: 180, sku: "SG-RCE-001",
    nutrition: { calories: 356, protein: 6.7, carbs: 79, fat: 0.6, fiber: 0.4 },
    attributes: { organic: false, locallySourced: true },
    tags: ["rice", "basmati", "aged", "biryani"],
    isFeatured: true, isNewArrival: false,
  },
  {
    catIdx: 5, name: "Whole Wheat Atta", description: "Stone-ground whole wheat flour (atta). Makes soft and nutritious rotis every time.",
    price: 260, originalPrice: 300, brand: "Aashirvaad", unit: "kg", unitSize: "5",
    subcategory: "Flour", stock: 250, sku: "SG-ATT-002",
    nutrition: { calories: 340, protein: 12, carbs: 72, fat: 1.7, fiber: 11, sugar: 0.4 },
    attributes: { organic: false, locallySourced: true },
    tags: ["atta", "wheat", "flour", "roti"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 5, name: "Toor Dal (Arhar)", description: "Premium quality split pigeon pea dal. Cooks soft and tastes great in traditional dal recipes.",
    price: 160, originalPrice: 190, brand: "Tata Sampann", unit: "kg", unitSize: "1",
    subcategory: "Pulses", stock: 200, sku: "SG-DAL-003",
    nutrition: { calories: 343, protein: 22, carbs: 63, fat: 1.5, fiber: 15, sugar: 5 },
    attributes: { organic: false, vegan: true, glutenFree: true },
    tags: ["dal", "toor", "pulses", "protein"],
    isFeatured: false, isNewArrival: false,
  },

  // ── Spices & Condiments (index 6) ──
  {
    catIdx: 6, name: "Kashmiri Red Chilli Powder", description: "Vibrant red Kashmiri chilli powder. Adds rich color and mild heat to curries and marinades.",
    price: 85, originalPrice: 100, brand: "Everest", unit: "gram", unitSize: "200",
    subcategory: "Spices", stock: 300, sku: "SC-CHL-001",
    attributes: { organic: false, vegan: true, glutenFree: true },
    tags: ["chilli", "kashmiri", "spice", "masala"],
    isFeatured: false, isNewArrival: false,
  },
  {
    catIdx: 6, name: "Extra Virgin Olive Oil", description: "Cold-pressed extra virgin olive oil imported from Italy. Perfect for salads, pasta, and healthy cooking.",
    price: 550, originalPrice: 650, brand: "Figaro", unit: "ml", unitSize: "500",
    subcategory: "Oils", stock: 100, sku: "SC-OIL-002",
    attributes: { organic: true, vegan: true, glutenFree: true },
    tags: ["olive-oil", "cooking-oil", "italian", "healthy"],
    isFeatured: true, isNewArrival: false,
  },
  {
    catIdx: 6, name: "Garam Masala", description: "Aromatic blend of 13 whole spices, roasted and ground fresh. The soul of Indian cooking.",
    price: 110, originalPrice: 130, brand: "MDH", unit: "gram", unitSize: "100",
    subcategory: "Spices", stock: 350, sku: "SC-GAR-003",
    attributes: { vegan: true, glutenFree: true },
    tags: ["garam-masala", "spice", "indian", "masala"],
    isFeatured: false, isNewArrival: false,
  },

  // ── Personal Care (index 7) ──
  {
    catIdx: 7, name: "Natural Aloe Vera Shampoo", description: "Sulfate-free shampoo with pure aloe vera and tea tree oil. Gentle on scalp, strong on cleansing.",
    price: 299, originalPrice: 399, brand: "Mamaearth", unit: "ml", unitSize: "250",
    subcategory: "Hair Care", stock: 150, sku: "PC-SHP-001",
    attributes: { organic: true, vegan: true },
    tags: ["shampoo", "aloe-vera", "natural", "hair-care"],
    isFeatured: false, isNewArrival: true,
  },
  {
    catIdx: 7, name: "Charcoal Face Wash", description: "Activated charcoal face wash that deep cleanses pores and removes excess oil. For all skin types.",
    price: 199, originalPrice: 250, brand: "Man Things", unit: "ml", unitSize: "100",
    subcategory: "Skin Care", stock: 180, sku: "PC-FCW-002",
    attributes: { organic: false, vegan: true },
    tags: ["face-wash", "charcoal", "skin-care", "men"],
    isFeatured: false, isNewArrival: false,
  },
];

// ─── Helper: generate slug ───────────────────────────────────────────────────
const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ─── Seed Function ───────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📂 Connected to MongoDB for seeding");

    // Drop stale indexes to avoid duplicate-key issues on first run
    try {
      await mongoose.connection.db.collection("categories").dropIndexes();
      await mongoose.connection.db.collection("products").dropIndexes();
    } catch (_) {
      /* collections may not exist yet */
    }

    // ── 1. Seed Categories ──
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    // Generate slugs ourselves (insertMany skips pre-save hooks)
    const categoriesWithSlugs = categories.map((c) => ({
      ...c,
      slug: toSlug(c.name),
    }));

    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(`✅ Inserted ${createdCategories.length} categories`);

    // ── 2. Seed Products ──
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Map catIdx → actual ObjectId and generate slugs
    const productsWithRefs = products.map((p) => {
      const { catIdx, ...productData } = p;
      return {
        ...productData,
        category: createdCategories[catIdx]._id,
        slug: toSlug(productData.name),
        images: [
          {
            public_id: `product_${productData.sku}`,
            url: `https://placehold.co/400x400/2d5016/white?text=${encodeURIComponent(productData.name)}`,
          },
        ],
        discountPercentage:
          productData.originalPrice && productData.originalPrice > productData.price
            ? Math.round(
                ((productData.originalPrice - productData.price) /
                  productData.originalPrice) *
                  100
              )
            : 0,
        isOnSale: productData.originalPrice > productData.price,
      };
    });

    await Product.insertMany(productsWithRefs);
    console.log(`✅ Inserted ${productsWithRefs.length} products`);

    // ── 3. Summary ──
    const catCount = await Category.countDocuments();
    const prodCount = await Product.countDocuments();
    console.log("\n🎉 Seeding complete!");
    console.log(`   📁 Categories: ${catCount}`);
    console.log(`   📦 Products:   ${prodCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

