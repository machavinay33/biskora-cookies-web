import { getDb } from "./db";
    import { adminUsers, products } from "../drizzle/schema";
    import bcrypt from "bcryptjs";
    import { eq } from "drizzle-orm";

    export async function seedAdminUser() {
    const db = await getDb();
    if (!db) { console.error("Database not available for seeding."); return; }

    const email = "admin@biskora.com";
    const password = "biskora2024";
    const name = "Admin User";

    try {
      const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
      if (existing.length === 0) {
        const passwordHash = await bcrypt.hash(password, 10);
        await db.insert(adminUsers).values({ email, passwordHash, name, role: "admin" });
        console.log("Default admin user seeded.");
      }
    } catch (error) {
      console.error("Error seeding admin user:", error);
    }
    }

    const SEED_PRODUCTS = [
    {
      name: "Classic Butter Cookies",
      description: "Melt-in-your-mouth butter cookies made with pure desi ghee and the finest flour. A timeless classic loved by all ages.",
      category: "Classic",
      price: 25000,
      highlights: ["Pure Ghee", "No Preservatives", "Crispy & Light"],
      inStock: true,
    },
    {
      name: "Chocolate Chip Cookies",
      description: "Rich, indulgent cookies loaded with premium dark chocolate chips. Perfect for chocolate lovers.",
      category: "Premium",
      price: 32000,
      highlights: ["Dark Chocolate", "Soft Baked", "Premium Ingredients"],
      inStock: true,
    },
    {
      name: "Almond Dry Cake",
      description: "A nutty, fragrant dry cake studded with whole almonds and subtly spiced with cardamom.",
      category: "Dry Cakes",
      price: 40000,
      highlights: ["Whole Almonds", "Cardamom Infused", "Festive Favourite"],
      inStock: true,
    },
    {
      name: "Coconut Cookies",
      description: "Lightly sweet cookies with real desiccated coconut — crispy on the outside, tender inside.",
      category: "Classic",
      price: 28000,
      highlights: ["Real Coconut", "Egg-Free", "Crunchy Texture"],
      inStock: true,
    },
    {
      name: "Oat & Raisin Cookies",
      description: "Hearty whole-oat cookies packed with plump raisins. A wholesome treat for any time of day.",
      category: "Healthy",
      price: 30000,
      highlights: ["Whole Oats", "No Refined Sugar", "High Fibre"],
      inStock: true,
    },
    {
      name: "Cashew Cookies",
      description: "Buttery, crumbly cookies topped with whole cashews. A popular pick for gift boxes.",
      category: "Premium",
      price: 35000,
      highlights: ["Whole Cashews", "Gift-Worthy", "Handcrafted"],
      inStock: true,
    },
    {
      name: "Jeera Cookies",
      description: "Savoury-sweet cookies with roasted cumin — a uniquely Indian twist on the classic tea-time biscuit.",
      category: "Specialty",
      price: 22000,
      highlights: ["Roasted Cumin", "Savoury-Sweet", "Tea-Time Favourite"],
      inStock: true,
    },
    {
      name: "Pista Dry Cake",
      description: "A soft, golden dry cake studded with pistachios and rose petals. Perfect for celebrations.",
      category: "Dry Cakes",
      price: 45000,
      highlights: ["Pistachios", "Rose Water", "Celebration Special"],
      inStock: true,
    },
    ];

    export async function seedProducts() {
    const db = await getDb();
    if (!db) { console.error("Database not available for product seeding."); return; }

    try {
      const existing = await db.select().from(products).limit(1);
      if (existing.length > 0) {
        console.log("Products already seeded, skipping.");
        return;
      }
      await db.insert(products).values(SEED_PRODUCTS);
      console.log(`Seeded ${SEED_PRODUCTS.length} products.`);
    } catch (error) {
      console.error("Error seeding products:", error);
    }
    }
    