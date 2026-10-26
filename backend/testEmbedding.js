
const { pipeline } = require("@huggingface/transformers");

async function testEmbedding() {
  try {
    console.log("Loading embedding model...");

    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const result = await extractor(
      "Chicken biryani with aromatic spices",
      {
        pooling: "mean",
        normalize: true,
      }
    );

    const embedding = Array.from(result.data);

    console.log("Embedding generated successfully!");
    console.log("Vector dimensions:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
  } catch (error) {
    console.error("Embedding error:", error.message);
  }
}

testEmbedding();
