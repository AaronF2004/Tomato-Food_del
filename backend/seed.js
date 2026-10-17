import mongoose from "mongoose";
import "dotenv/config";
import foodModel from "./models/foodModel.js";

const sampleDishes = [
  // --- Non Veg Specialties ---
  {
    name: "Chicken Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop",
    price: 22,
    description: "Aromatic basmati rice cooked with tender spiced chicken pieces and saffron.",
    category: "Non Veg"
  },
  {
    name: "Butter Chicken",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop",
    price: 20,
    description: "Juicy chicken roasted and simmered in a smooth, creamy tomato and butter gravy.",
    category: "Non Veg"
  },
  {
    name: "Mutton Rogan Josh",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqeJxBEXMjpuBLaGhQTFbfZ8iIJlSZrgryxaPzvJ_FKQ&s=10",
    price: 26,
    description: "Slow-cooked Kashmiri mutton curry flavored with alkanet root and Kashmiri chilies.",
    category: "Non Veg"
  },
  {
    name: "Tandoori Chicken Tikka",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqn306wrhlJ_kUmB9sP1ikPJ-R_RYrhU2f8XkXuzvq7Q&s=10",
    price: 18,
    description: "Boneless chicken chunks marinated in spiced yogurt and charred in a clay oven.",
    category: "Non Veg"
  },
  {
    name: "Crispy Fried Fish",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop",
    price: 19,
    description: "Golden battered fresh fish fillets served with tartar sauce and lemon wedges.",
    category: "Non Veg"
  },
  {
    name: "Chicken Shawarma Plate",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop",
    price: 16,
    description: "Spit-roasted sliced chicken served with pickled veggies, hummus, and pita bread.",
    category: "Non Veg"
  },
  {
    name: "Grilled BBQ Chicken Wings",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-fhlNuBDksJm1SStH-3z76UWmk3ykxwuG0vuGHvwqqg&s=10",
    price: 15,
    description: "Char-grilled wings tossed in tangy and smoky barbecue sauce with ranch dip.",
    category: "Non Veg"
  },
  {
    name: "Spicy Prawn Masala",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop",
    price: 25,
    description: "Juicy tiger prawns tossed with onions, curry leaves, and coastal ground spices.",
    category: "Non Veg"
  },

  // --- Rolls (Mixed Veg & Non-Veg) ---
  {
    name: "Chicken Kebab Roll",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop",
    price: 15,
    description: "Spiced grilled chicken seekh kebab rolled in a flaky paratha with mint chutney.",
    category: "Rolls"
  },
  {
    name: "Egg Chicken Roll",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop",
    price: 14,
    description: "Double egg layered paratha stuffed with diced chicken, onions, and green chilies.",
    category: "Rolls"
  },
  {
    name: "Peri Peri Veg Roll",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop",
    price: 12,
    description: "Crisp cottage cheese cubes dusted with spicy peri-peri rub inside a soft wrap.",
    category: "Rolls"
  },
  {
    name: "Lasagna Rolls",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop",
    price: 14,
    description: "Baked pasta rolls stuffed with ricotta cheese and spinach in marinara sauce.",
    category: "Rolls"
  },

  // --- Salad (Veg & Non-Veg) ---
  {
    name: "Grilled Chicken Caesar Salad",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop",
    price: 18,
    description: "Romaine lettuce, tender sliced chicken breast, croutons, and shaved parmesan.",
    category: "Salad"
  },
  {
    name: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
    price: 12,
    description: "Fresh cucumbers, kalamata olives, feta cheese, and red onions in herb vinaigrette.",
    category: "Salad"
  },
  {
    name: "Veg Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop",
    price: 11,
    description: "Garden fresh greens with bell peppers, cherry tomatoes, and light lemon dressing.",
    category: "Salad"
  },
  {
    name: "Clover Green Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop",
    price: 13,
    description: "Nutritious mixed sprouts, avocado, baby spinach, and roasted sunflower seeds.",
    category: "Salad"
  },

  // --- Sandwich (Veg & Non-Veg) ---
  {
    name: "Crispy Chicken Club Sandwich",
    image: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=500&auto=format&fit=crop",
    price: 14,
    description: "Triple-decker sandwich layered with crisp chicken, fried egg, lettuce, and mayo.",
    category: "Sandwich"
  },
  {
    name: "Grilled Cheese Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop",
    price: 11,
    description: "Golden toasted sourdough bread filled with melting cheddar and mozzarella.",
    category: "Sandwich"
  },
  {
    name: "Vegan Avocado Sandwich",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop",
    price: 13,
    description: "Mashed avocado, cucumber slices, alfalfa sprouts, and hummus on multigrain.",
    category: "Sandwich"
  },
  {
    name: "Paneer Tikka Sandwich",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop",
    price: 12,
    description: "Char-grilled spiced cottage cheese cubes with mint mayonnaise in toasted bread.",
    category: "Sandwich"
  },

  // --- Pasta (Veg & Non-Veg) ---
  {
    name: "Creamy Chicken Alfredo Pasta",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&auto=format&fit=crop",
    price: 19,
    description: "Fettuccine pasta tossed with garlic parmesan cream sauce and grilled chicken.",
    category: "Pasta"
  },
  {
    name: "Four Cheese Pasta",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmsLGA2GKRoXtNvMohvH6meb1Zf3Fg1h3XDfO21jHhyA&s=10",
    price: 15,
    description: "Penne baked in a rich four-cheese blend with a golden herb crumb crust.",
    category: "Pasta"
  },
  {
    name: "Sun-Dried Tomato Pasta",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop",
    price: 14,
    description: "Spaghetti tossed in tangy roasted tomato basil sauce with kalamata olives.",
    category: "Pasta"
  },
  {
    name: "Mushroom Cream Pasta",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&auto=format&fit=crop",
    price: 16,
    description: "Wild button mushrooms sautéed in white wine garlic sauce over rigatoni.",
    category: "Pasta"
  },

  // --- Noodles (Veg & Non-Veg) ---
  {
    name: "Chicken Hakka Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop",
    price: 16,
    description: "Wok-tossed noodles with shredded chicken, crunchy carrots, and dark soy.",
    category: "Noodles"
  },
  {
    name: "Veg Schezwan Noodles",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop",
    price: 13,
    description: "Spicy wok noodles cooked with bell peppers, cabbage, and homemade schezwan chili sauce.",
    category: "Noodles"
  },
  {
    name: "Japanese Somen Noodles",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop",
    price: 17,
    description: "Thin wheat noodles served chilled with dipping sauce, scallions, and ginger.",
    category: "Noodles"
  },
  {
    name: "Garlic Butter Egg Noodles",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop",
    price: 14,
    description: "Classic egg noodles tossed with minced garlic, butter, spring onions, and chili oil.",
    category: "Noodles"
  },

  // --- Pure Veg ---
  {
    name: "Paneer Butter Masala",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop",
    price: 17,
    description: "Soft paneer cubes simmered in a mildly spiced sweet and creamy tomato gravy.",
    category: "Pure Veg"
  },
  {
    name: "Garlic Butter Mushrooms",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop",
    price: 14,
    description: "Whole button mushrooms pan-seared with herb butter, cracked pepper, and garlic.",
    category: "Pure Veg"
  },
  {
    name: "Crispy Fried Cauliflower",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
    price: 12,
    description: "Battered florets tossed in sweet and spicy chili sauce with scallions.",
    category: "Pure Veg"
  },
  {
    name: "Special Veg Dum Biryani",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop",
    price: 15,
    description: "Layered fragrant basmati rice cooked with fresh seasonal vegetables and spices.",
    category: "Pure Veg"
  },

  // --- Desserts & Cakes ---
  {
    name: "Belgian Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop",
    price: 14,
    description: "Decadent dark chocolate sponge layered with rich Belgian chocolate ganache.",
    category: "Cake"
  },
  {
    name: "Butterscotch Crunch Cake",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop",
    price: 15,
    description: "Vanilla sponge layered with crunchy butterscotch praline and caramel glaze.",
    category: "Cake"
  },
  {
    name: "Wild Berry Ice Cream",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop",
    price: 9,
    description: "Creamy artisanal ice cream swirled with crushed blueberries and raspberries.",
    category: "Desserts"
  },
  {
    name: "Classic Madagascar Vanilla",
    image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500&auto=format&fit=crop",
    price: 8,
    description: "Rich and creamy churned ice cream infused with real Madagascar vanilla beans.",
    category: "Desserts"
  }
];

const seedDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://food_admin:2004aaron0811@cluster0.ptjkkf0.mongodb.net/food-del?retryWrites=true&w=majority";

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    await foodModel.deleteMany({});
    console.log("Cleared existing dishes.");

    await foodModel.insertMany(sampleDishes);
    console.log(`Successfully inserted all ${sampleDishes.length} dishes into MongoDB!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();