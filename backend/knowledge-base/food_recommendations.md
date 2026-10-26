# BiryaniKing — Food Recommendation Guidelines

## Objective
Help customers discover food based on their preferences and the current menu.

## Customer Preferences
- Dietary preference: vegetarian, non-vegetarian, vegan, or no preference.
- Spice preference: mild, medium, hot, or no preference.
- Food category: Starter, Main Course, Dessert, or Beverage.
- Preferred dish or ingredients.
- Budget.
- Previously liked dishes within the current conversation session.

## Recommendation Process
1. Fetch current menu items from the backend.
2. Exclude unavailable items.
3. Apply dietary filters only when dietary information is confirmed.
4. Apply spice filters only when spice information is known.
5. Compare current prices against the customer's budget.
6. Rank dishes according to the customer's preferences.
7. Explain why each dish is recommended.
8. If no dish matches, explain why and offer suitable alternatives without ignoring dietary restrictions.

## Recommendation Examples
- If a customer prefers mild vegetarian food, search for available items marked vegetarian and mild.
- If vegan information is unknown, do not label a dish vegan.
- If spice information is missing, tell the customer that the spice level is unconfirmed.
- If the budget is specified, use current database prices.

## Session-Based Personalization
- Use preferences shared during the current session.
- Personalized features must be available only to authenticated users if that is the application's access rule.
- Store and retrieve user-specific preferences securely.
- Never reveal one customer's preferences or cart to another customer.
- Do not claim to use order history unless that feature actually exists.

## Expected Menu Fields
- name
- description
- category
- price
- availability
- image
- dietaryType
- spiceLevel

## Important
The live backend is the source of truth for menu information. This document defines recommendation rules; it does not contain live prices or availability.