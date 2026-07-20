import "dotenv/config";
import supabase from "./config/supabase.js";

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .limit(1);

    if (error) throw error;

    console.log("✅ Supabase connected successfully");
    console.log("Bookings data:", data);
  } catch (error) {
    console.error("❌ Supabase connection failed:");
    console.error(error.message);
  }
}

testConnection();