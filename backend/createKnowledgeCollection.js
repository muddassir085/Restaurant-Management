
require("dotenv").config();

const { QdrantClient } = require("@qdrant/js-client-rest");

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "biryaniking_knowledge";

async function createKnowledgeCollection() {
  try {
    const collections = await client.getCollections();

    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (exists) {
      console.log(`Collection "${COLLECTION_NAME}" already exists.`);
      return;
    }

    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });

    console.log(`✅ Collection "${COLLECTION_NAME}" created!`);
  } catch (error) {
    console.error("❌ Collection creation failed:", error.message);
  }
}

createKnowledgeCollection();
