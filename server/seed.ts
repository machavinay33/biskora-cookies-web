import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { adminUsers, products } from "../drizzle/schema";
import bcrypt from "bcryptjs";

export async function seedAdminUser() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available for seeding admin user.");
    return;
  }

  const email = "admin@biskora.com";
  const password = "biskora2024";
  const name = "Admin User";

  try {
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(adminUsers).values({
        email,
        passwordHash,
        name,
        role: "admin",
      });
      console.log("Default admin user seeded successfully.");
    } else {
      console.log("Default admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

export async function seedProducts() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available for seeding products.");
    return;
  }

  try {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) {
      console.log("Products already seeded, skipping.");
      return;
    }

    const initialProducts = [
      {
        name: "Classic Butter Cookies",
        description: "Melt-in-your-mouth traditional butter cookies made with pure dairy butter, lightly sweetened and baked to golden perfection.",
        category: "Butter Cookies",
        price: 25000, // ₹250
        imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop",
        highlights: ["Pure Dairy Butter", "No Preservatives", "Traditional Recipe"],
        inStock: true,
      },
      {
        name: "Chocolate Chip Cookies",
        description: "Loaded with premium dark chocolate chips, these chewy cookies are a crowd favourite for all ages.",
        category: "Chocolate Cookies",
        price: 30000, // ₹300
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop",
        highlights: ["Dark Chocolate Chips", "Chewy Centre", "Crisp Edges"],
        inStock: true,
      },
      {
        name: "Cashew & Almond Cookies",
        description: "Premium nut cookies packed with whole cashews and slivered almonds, delivering a rich and satisfying crunch.",
        category: "Nut Cookies",
        price: 35000, // ₹350
        imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop",
        highlights: ["Whole Cashews", "Slivered Almonds", "High Protein"],
        inStock: true,
      },
      {
        name: "Nankhatai (Traditional Indian Shortbread)",
        description: "A beloved Indian classic — crumbly, cardamom-spiced shortbread cookies that pair perfectly with tea or coffee.",
        category: "Traditional",
        price: 20000, // ₹200
        imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop",
        highlights: ["Cardamom Flavour", "Crumbly Texture", "Pairs with Tea"],
        inStock: true,
      },
      {
        name: "Coconut Macaroon Cookies",
        description: "Light and chewy coconut macaroons with a golden crust and a soft, fragrant coconut centre.",
        category: "Coconut Cookies",
        price: 28000, // ₹280
        imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&auto=format&fit=crop",
        highlights: ["Desiccated Coconut", "Light & Chewy", "Egg-Free Option"],
        inStock: true,
      },
      {
        name: "Chocolate Brownie Cookies",
        description: "The best of both worlds — fudgy brownie texture baked into a cookie, with a crackly top and rich cocoa flavour.",
        category: "Chocolate Cookies",
        price: 32000, // ₹320
        imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&auto=format&fit=crop",
        highlights: ["Fudgy Texture", "Rich Cocoa", "Crackly Top"],
        inStock: true,
      },
      {
        name: "Peanut Butter Cookies",
        description: "Thick, soft cookies made with creamy peanut butter, delivering a deeply nutty flavour with a satisfying bite.",
        category: "Nut Cookies",
        price: 26000, // ₹260
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop",
        highlights: ["Creamy Peanut Butter", "High Protein", "Gluten-Free Option"],
        inStock: true,
      },
      {
        name: "Tutti Frutti Dry Cake",
        description: "A festive dry cake studded with colourful tutti frutti, vanilla essence, and a hint of rose water — a bakery classic.",
        category: "Dry Cakes",
        price: 18000, // ₹180
        imageUrl: "https://images.unsplash.com/photo-1568051243858-533a607809a5?w=600&auto=format&fit=crop",
        highlights: ["Colourful Tutti Frutti", "Rose Water", "Bakery Classic"],
        inStock: true,
      },
      {
        name: "Walnut & Date Cookies",
        description: "Wholesome cookies made with chopped walnuts and natural dates — naturally sweetened and packed with nutrients.",
        category: "Healthy Bakes",
        price: 38000, // ₹380
        imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop",
        highlights: ["Natural Dates", "Chopped Walnuts", "Naturally Sweetened"],
        inStock: true,
      },
      {
        name: "Jeera (Cumin) Cookies",
        description: "A unique savoury-sweet cookie with the warm, earthy flavour of roasted cumin seeds — perfect with afternoon tea.",
        category: "Traditional",
        price: 22000, // ₹220
        imageUrl: "https://images.unsplash.com/photo-1573021274769-c44efb2e6e8d?w=600&auto=format&fit=crop",
        highlights: ["Roasted Cumin", "Savoury-Sweet", "Tea Time Favourite"],
        inStock: true,
      },
    ];

    await db.insert(products).values(initialProducts);
    console.log(`Seeded ${initialProducts.length} products successfully.`);
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}
