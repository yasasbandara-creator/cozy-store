/* =========================================================
   COZY STORE — PRODUCT DATA
   ========================================================= */

const STORE_CONFIG = {
  name: "cozy.",
  currency: "LKR",
  currencySymbol: "Rs."
};


/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [

  {
    id: "cloudy-notes",
    name: "Cloudy Notes Notebook",
    price: 850,
    category: "stationery",
    mood: "soft-cozy",
    badge: "Bestseller",
    emoji: "📓",

    description:
      "A soft everyday notebook for plans, thoughts, study notes and little ideas.",

    details:
      "Made for everyday thoughts, study sessions and little plans. The Cloudy Notes Notebook brings a soft cozy feeling to your desk while giving you plenty of space to write.",

    colors: [
      "#dff3f7",
      "#faf8f1"
    ],

    stock: 18,
    featured: true
  },


  {
    id: "pastel-pens",
    name: "Pastel Pen Set",
    price: 650,
    category: "stationery",
    mood: "soft-cozy",
    badge: "New",
    emoji: "🖊️",

    description:
      "A dreamy set of smooth pastel pens made for notes that feel a little happier.",

    details:
      "A cute pastel pen collection for school, university, journaling and everyday notes. Smooth, lightweight and easy to carry.",

    colors: [
      "#f8e1e5",
      "#dcebd5"
    ],

    stock: 24,
    featured: true
  },


  {
    id: "matcha-cup",
    name: "Matcha Desk Cup",
    price: 1250,
    category: "desk",
    mood: "matcha",
    badge: "",
    emoji: "🍵",

    description:
      "A cute desk cup for pens, brushes and all the tiny things that wander around your workspace.",

    details:
      "Keep your desk organized with this simple little cup. Perfect for pens, pencils, brushes and other everyday desk accessories.",

    colors: [
      "#dcebd5",
      "#faf8f1"
    ],

    stock: 11,
    featured: true
  },


  {
    id: "tiny-lamp",
    name: "Tiny Cozy Lamp",
    price: 2400,
    category: "gadgets",
    mood: "night",
    badge: "Popular",
    emoji: "💡",

    description:
      "A tiny warm desk light for late-night study sessions and cozy corners.",

    details:
      "A compact desk lamp designed for soft evening lighting. Great for study desks, bedside tables and cozy reading corners.",

    colors: [
      "#fff0cf",
      "#f8e1e5"
    ],

    stock: 7,
    featured: true
  },


  {
    id: "cloud-stickers",
    name: "Cloudy Sticker Sheet",
    price: 450,
    category: "stationery",
    mood: "soft-cozy",
    badge: "Cute pick",
    emoji: "☁️",

    description:
      "Tiny clouds, stars and dreamy shapes for journals, laptops and planners.",

    details:
      "Decorate your notebooks, planners, phone cases and laptop with these tiny dreamy stickers.",

    colors: [
      "#dff3f7",
      "#ffffff"
    ],

    stock: 35,
    featured: false
  },


  {
    id: "cable-buddy",
    name: "Mini Cable Buddy",
    price: 550,
    category: "accessories",
    mood: "matcha",
    badge: "",
    emoji: "🔌",

    description:
      "A tiny desk accessory that keeps your charging cable from escaping.",

    details:
      "A small and useful accessory for keeping charging cables neat and close to your desk.",

    colors: [
      "#dcebd5",
      "#dff3f7"
    ],

    stock: 21,
    featured: false
  },


  {
    id: "study-timer",
    name: "Mini Study Timer",
    price: 1850,
    category: "gadgets",
    mood: "night",
    badge: "Study",
    emoji: "⏱️",

    description:
      "A compact timer for focused study blocks, Pomodoro sessions and mindful breaks.",

    details:
      "Keep your study sessions focused with a simple desk timer. Ideal for Pomodoro sessions and productivity routines.",

    colors: [
      "#faf8f1",
      "#dff3f7"
    ],

    stock: 9,
    featured: false
  },


  {
    id: "cozy-pouch",
    name: "Soft Desk Pouch",
    price: 1450,
    category: "accessories",
    mood: "soft-cozy",
    badge: "",
    emoji: "👜",

    description:
      "A soft little pouch for pens, chargers, earbuds and everyday desk essentials.",

    details:
      "A compact everyday pouch for keeping your small stationery, charging cables, earbuds and other accessories together.",

    colors: [
      "#f8e1e5",
      "#faf8f1"
    ],

    stock: 15,
    featured: false
  }

];


/* =========================================================
   PRICE FORMAT
   ========================================================= */

function formatPrice(value) {

  return `${STORE_CONFIG.currencySymbol} ${Number(value).toLocaleString("en-LK")}`;

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function getProduct(id) {

  return PRODUCTS.find(
    product => product.id === id
  );

}
