COZY STORE V2
=============

This is the first real shopping layer for the cozy store project.

Files:
- shop.html
- css/shop.css
- js/products.js
- js/shop.js

How to use:
1. Put shop.html in the project root.
2. Create css and js folders if they do not exist.
3. Put shop.css inside css/.
4. Put products.js and shop.js inside js/.
5. Open shop.html with your browser.

Temporary brand name:
The brand is controlled from js/products.js:

const STORE_CONFIG = {
  name: "cozy.",
  ...
};

Change that later when you decide the real brand.

Current V2 features:
- Responsive shop page
- Search
- Category filtering
- Sorting
- Wishlist visual state
- Product data structure
- LKR prices
- Stock values
- Persistent localStorage shopping bag
- Bag item count
- Add-to-bag feedback
- Mobile filter drawer
- Desktop sidebar filters
- Mobile-first responsive design

Important:
The product visuals are intentionally placeholder emoji blocks for now.
Next stage can replace them with real product images and build:
- product.html
- product detail page
- cart.html
- checkout.html
- order system
- backend/database
- admin dashboard
