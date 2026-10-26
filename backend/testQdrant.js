
require("dotenv").config();

const { QdrantClient } = require("@qdrant/js-client-rest");

async function testConnection() {
  try {
    if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
      throw new Error("QDRANT_URL or QDRANT_API_KEY is missing in .env");
    }

    const client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const result = await client.getCollections();

    console.log("✅ Qdrant connection successful!");
    console.log("Available collections:", result.collections);
  } catch (error) {
    console.error("❌ Qdrant connection failed:", error.message);
  }
}

testConnection();
