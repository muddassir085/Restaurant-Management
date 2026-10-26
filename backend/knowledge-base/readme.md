# BiryaniKing Knowledge Base

## Purpose
This folder contains knowledge documents for the BiryaniKing AI chatbot and future Hybrid RAG implementation.

## Files
- restaurant_faq.md — frequently asked questions.
- ordering_policies.md — ordering, delivery, payment, cancellation, and refund policies.
- food_recommendations.md — food recommendation rules and personalization guidelines.

## Data Sources
Use these documents for relatively stable information.

Use the live MongoDB-backed backend for:
- Current menu items.
- Dish descriptions and categories.
- Current prices and availability.
- Dietary types and spice levels.
- Cart and order information, if implemented.

## Important Rules
- Replace TBD values only with verified business information.
- Never put API keys, passwords, database credentials, JWTs, or private customer information in knowledge files.
- Do not treat unconfirmed policies as authoritative.
- The chatbot must acknowledge when information is unavailable.

## Future RAG Integration
1. Load approved Markdown documents.
2. Split documents into smaller text chunks.
3. Generate embeddings.
4. Store the chunks in ChromaDB.
5. Retrieve relevant chunks for each user query.
6. Combine retrieved knowledge with live menu data.
7. Generate a grounded response using the OpenAI API.

## Suggested Metadata
- source
- section
- content_type
- status
