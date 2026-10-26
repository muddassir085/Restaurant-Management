
require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline } = require("@huggingface/transformers");

const COLLECTION_NAME = "biryaniking_knowledge";

const KNOWLEDGE_DIR = path.join(
  __dirname,
  "knowledge-base"
);

const FILES = [
  "restaurant_faq.md",
  "food_recommendations.md",
];

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Split Markdown into small, meaningful chunks.
function splitIntoChunks(text, maxLength = 900) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxLength) {
      if (current) {
        chunks.push(current);
        current = "";
      }

      for (let i = 0; i < paragraph.length; i += maxLength) {
        chunks.push(paragraph.slice(i, i + maxLength));
      }

      continue;
    }

    if (
      current &&
      (current.length + paragraph.length + 2 > maxLength)
    ) {
      chunks.push(current);
      current = paragraph;
    } else {
      current += current ? "\n\n" + paragraph : paragraph;
    }
  }

  if (current) chunks.push(current);

  return chunks;
}

function stableId(source, index, content) {
  const hash = crypto
    .createHash("sha256")
    .update(`${source}:${index}:${content}`)
    .digest("hex");

  // Qdrant point IDs support UUIDs.
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "5" + hash.slice(13, 16),
    "a" + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

async function main() {
  if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
    throw new Error("QDRANT_URL or QDRANT_API_KEY is missing.");
  }

  console.log("Loading embedding model...");

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  const collections = await qdrant.getCollections();

  const collectionExists = collections.collections.some(
    (item) => item.name === COLLECTION_NAME
  );

  if (!collectionExists) {
    throw new Error(
      `Collection "${COLLECTION_NAME}" does not exist. Run createKnowledgeCollection.js first.`
    );
  }

  let totalUploaded = 0;

  for (const filename of FILES) {
    const filePath = path.join(KNOWLEDGE_DIR, filename);
    const markdown = await fs.readFile(filePath, "utf8");
    const chunks = splitIntoChunks(markdown);

    console.log(`${filename}: ${chunks.length} chunks`);

    const points = [];

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];

      const result = await extractor(content, {
        pooling: "mean",
        normalize: true,
      });

      const vector = Array.from(result.data);

      if (vector.length !== 384) {
        throw new Error(
          `Unexpected embedding size ${vector.length} for ${filename}`
        );
      }

      points.push({
        id: stableId(filename, i, content),
        vector,
        payload: {
          source: filename,
          chunk_index: i,
          content,
          content_type: filename === "restaurant_faq.md"
            ? "faq"
            : "recommendation",
        },
      });
    }

    // Upload in batches.
    for (let i = 0; i < points.length; i += 32) {
      await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: points.slice(i, i + 32),
      });
    }

    totalUploaded += points.length;
    console.log(`✅ Uploaded ${filename}`);
  }

  console.log(`🎉 Done! Uploaded ${totalUploaded} knowledge chunks.`);
}

main().catch((error) => {
  console.error("Knowledge ingestion failed:", error.message);
  process.exitCode = 1;
});
