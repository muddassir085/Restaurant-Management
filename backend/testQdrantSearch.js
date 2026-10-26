
require("dotenv").config();

const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline } = require("@huggingface/transformers");

const COLLECTION_NAME = "biryaniking_knowledge";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function testSearch() {
  try {
    console.log("Loading embedding model...");

    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const question = "Which vegetarian dishes can I recommend?";

    const result = await extractor(question, {
      pooling: "mean",
      normalize: true,
    });

    const vector = Array.from(result.data);

    console.log("Searching Qdrant...");

    const searchResult = await qdrant.query(COLLECTION_NAME, {
      query: vector,
      limit: 3,
      with_payload: true,
    });

    if (!searchResult.points.length) {
      console.log("No matching knowledge found.");
      return;
    }

    console.log("\nRelevant knowledge:");

    for (const point of searchResult.points) {
      console.log("\n-------------------------");
      console.log("Score:", point.score);
      console.log("Source:", point.payload.source);
      console.log("Content:\n", point.payload.content);
    }
  } catch (error) {
    console.error("Search failed:", error.message);
  }
}

testSearch();
