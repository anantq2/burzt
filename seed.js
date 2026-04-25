import { Pool } from "pg";
import { betterAuth } from "better-auth";

/*
 * Seed script to:
 * 1. Create the transcript table
 * 2. Create the admin account
 *
 * Run: npx tsx seed.js
 */

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:akjha123@localhost:5432/burzt";

async function seed() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  console.log("🔗 Connecting to database...");

  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected!");

    // Create transcript table
    console.log("📦 Creating transcript table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transcript (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Transcript table ready!");

    // Create admin user via Better Auth
    console.log("👤 Creating admin account...");

    const auth = betterAuth({
      database: pool,
      emailAndPassword: { enabled: true },
    });

    // Check if admin already exists
    const existingUser = await pool.query(
      'SELECT id FROM "user" WHERE email = $1',
      ["admin@test.com"]
    );

    if (existingUser.rows.length > 0) {
      console.log("ℹ️  Admin account already exists, skipping...");
    } else {
      const response = await auth.api.signUpEmail({
        body: {
          email: "admin@test.com",
          password: "admin@123",
          name: "Admin",
        },
      });

      if (response) {
        console.log("✅ Admin account created!");
        console.log("   📧 Email: admin@test.com");
        console.log("   🔑 Password: admin@123");
      }
    }

    console.log("\n🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
