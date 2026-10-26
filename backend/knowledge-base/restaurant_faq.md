# BiryaniKing — Restaurant FAQs

## About BiryaniKing
BiryaniKing is an online restaurant application where customers can browse the available food menu.

Customers can explore dishes and view their descriptions, categories, prices, and availability.

## Frequently Asked Questions

### What food can I order?
Customers can browse the current BiryaniKing menu and choose from the available dishes.

### What is the price of a dish?
The chatbot must retrieve the current price from the live menu API. It must never guess or provide outdated prices.

### Are menu items available?
The chatbot must check the current availability status from the database.

### Which dishes are vegetarian?
Use the menu item's dietaryType field. If the value is unknown or missing, do not assume that the dish is vegetarian or vegan.

### How spicy is a dish?
Use the spiceLevel field when available: mild, medium, hot, or unknown.

### How do I place an order?
Customers can browse the menu and use the cart functionality available in the application. Only confirm checkout or order placement if the feature is implemented and the backend confirms success.

### Do I need an account?
Visitors can browse the menu. Authentication is required for features restricted to logged-in users.

### What are the restaurant's opening hours?
TBD — official opening hours have not been confirmed.

### Where do you deliver?
TBD — delivery areas have not been confirmed.

### How long does delivery take?
TBD — delivery estimates have not been confirmed.

### What are the delivery charges?
TBD — delivery charges have not been confirmed.

### Which payment methods are accepted?
TBD — accepted payment methods have not been confirmed.

### Can I cancel an order?
TBD — the cancellation policy must be confirmed.

### How do refunds work?
TBD — the refund policy must be confirmed.

### How can I contact customer support?
TBD — verified support contact details must be added.

## Chatbot Rules
- Never invent prices, availability, discounts, timings, or policies.
- Use live database data for menu-related questions.
- Clearly state when information is unknown.
- Never claim an order was placed, cancelled, or refunded without backend confirmation.
- Protect customer account information and personal data.