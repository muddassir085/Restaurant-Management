
const OpenAI = require("openai");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline } = require("@huggingface/transformers");
const MenuItem = require("../models/MenuItem");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "biryaniking_knowledge";

let extractorPromise = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    ).catch((error) => {
      extractorPromise = null;
      throw error;
    });
  }

  return extractorPromise;
}

// Retrieve relevant restaurant knowledge from Qdrant
async function retrieveKnowledge(question) {
  const extractor = await getExtractor();

  const result = await extractor(question, {
    pooling: "mean",
    normalize: true,
  });

  const searchResult = await qdrant.query(COLLECTION_NAME, {
    query: Array.from(result.data),
    limit: 3,
    with_payload: true,
  });

  return (searchResult.points || [])
    .map((point) => point.payload?.content)
    .filter(Boolean);
}

// Fetch current menu directly from MongoDB
async function getLiveMenu() {
  const menuItems = await MenuItem.find()
    .select(
      "name description category price availability dietaryType spiceLevel"
    )
    .lean()
    .limit(100);

  return menuItems.map((item) => ({
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    availability: item.availability,
    dietaryType: item.dietaryType || "unknown",
    spiceLevel: item.spiceLevel || "unknown",
  }));
}

const chatWithAI = async (req, res) => {
  try {
    if (
      !process.env.GROQ_API_KEY ||
      !process.env.QDRANT_URL ||
      !process.env.QDRANT_API_KEY
    ) {
      return res.status(500).json({
        success: false,
        message: "AI service configuration is incomplete.",
      });
    }

    const { message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message must be 2000 characters or fewer.",
      });
    }

    // MongoDB is the source of truth for the menu.
    const [menuItems, knowledgeChunks] = await Promise.all([
      getLiveMenu(),
      retrieveKnowledge(message.trim()),
    ]);

    const menuContext = menuItems.length
      ? JSON.stringify(menuItems)
      : "The database currently contains no menu items.";

    const knowledgeContext = knowledgeChunks.length
      ? knowledgeChunks.join("\n\n---\n\n")
      : "No relevant restaurant knowledge was retrieved.";

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `You are the friendly AI food assistant for BiryaniKing.

Use the LIVE MENU DATA below to answer questions about dishes,
prices, categories, dietary types, spice levels and availability.

STRICT RULES:
1. Recommend only dishes present in LIVE MENU DATA.
2. Never invent dish names, prices or menu details.
3. Only recommend items with availability=true as currently available.
4. If an item has availability=false, clearly say it is unavailable.
5. For vegetarian requests, recommend only dietaryType="veg".
6. For vegan requests, recommend only dietaryType="vegan".
7. For non-vegetarian requests, recommend only dietaryType="non-veg".
8. If dietaryType is "unknown", do not assume its dietary category.
9. If no matching items exist, say no matching item was found in
   the current menu. Do not invent alternatives.
10. Use the exact price from the database. Do not change the currency
    or infer additional charges.
11. Use knowledge base context for relevant FAQs, but it must not
    override current menu data.
12. Never claim an order was placed, modified or cancelled.
13. If the database contains no menu items, explain that the menu
    could not provide a recommendation right now.
14. Be concise, natural and helpful. Ask a follow-up question when useful.

LIVE MENU DATA:
${menuContext}

RESTAURANT KNOWLEDGE BASE:
${knowledgeContext}`,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Groq returned an empty response.");
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("RAG chatbot error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    return res.status(500).json({
      success: false,
      message: "The AI assistant is temporarily unavailable.",
      ...(process.env.NODE_ENV !== "production" && {
        debug: error.message,
      }),
    });
  }
};

module.exports = { chatWithAI };
