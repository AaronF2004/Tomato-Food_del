import mongoose from "mongoose";
import "dotenv/config";
import foodModel from "./models/foodModel.js";

const sampleDishes = [
  // Salad
  {
    name: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  },
  {
    name: "Veg Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop",
    price: 18,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  },
  {
    name: "Clover Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop",
    price: 16,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  },
  {
    name: "Chicken Salad",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop",
    price: 24,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  },

  // Rolls
  {
    name: "Lasagna Rolls",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop",
    price: 14,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Rolls"
  },
  {
    name: "Peri Peri Rolls",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Rolls"
  },
  {
    name: "Chicken Roll",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop",
    price: 20,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Rolls"
  },
  {
    name: "Veg Roll",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop",
    price: 15,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Rolls"
  },

  // Desserts
  {
    name: "Ripple Ice Cream",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop",
    price: 14,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Desserts"
  },
  {
    name: "Fruit Ice Cream",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop",
    price: 22,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Desserts"
  },
  {
    name: "Jar Ice Cream",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop",
    price: 10,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Desserts"
  },
  {
    name: "Vanilla Ice Cream",
    image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500&auto=format&fit=crop",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Desserts"
  },

  // Sandwich
  {
    name: "Chicken Sandwich",
    image: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=500&auto=format&fit=crop",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Sandwich"
  },
  {
    name: "Vegan Sandwich",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop",
    price: 18,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Sandwich"
  },
  {
    name: "Grilled Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop",
    price: 16,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Sandwich"
  },
  {
    name: "Bread Sandwich",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop",
    price: 24,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Sandwich"
  },

  // Cake
  {
    name: "Cup Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop",
    price: 14,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Cake"
  },
  {
    name: "Vegan Cake",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk9k6Sx-ctvaTrQZy2Zi5ENfRlD493c99R6fP001XkSg&s=10",
    price: 15,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Cake"
  },
  {
    name: "Butterscotch Cake",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop",
    price: 20,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Cake"
  },
  {
    name: "Sliced Cake",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop",
    price: 15,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Cake"
  },

  // Pure Veg
  {
    name: "Garlic Mushroom",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop",
    price: 14,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pure Veg"
  },
  {
    name: "Fried Cauliflower",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
    price: 22,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pure Veg"
  },
  {
    name: "Mix Veg Pulao",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop",
    price: 10,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pure Veg"
  },
  {
    name: "Rice Zucchini",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pure Veg"
  },

  // Pasta
  {
    name: "Cheese Pasta",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmsLGA2GKRoXtNvMohvH6meb1Zf3Fg1h3XDfO21jHhyA&s=10",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pasta"
  },
  {
    name: "Tomato Pasta",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop",
    price: 18,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pasta"
  },
  {
    name: "Creamy Pasta",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&auto=format&fit=crop",
    price: 16,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pasta"
  },
  {
    name: "Chicken Pasta",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&auto=format&fit=crop",
    price: 24,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Pasta"
  },

  // Noodles
  {
    name: "Butter Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop",
    price: 14,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Noodles"
  },
  {
    name: "Veg Noodles",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Noodles"
  },
  {
    name: "Somen Noodles",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop",
    price: 20,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Noodles"
  },
  {
    name: "Cooked Noodles",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop",
    price: 15,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Noodles"
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
    console.log("Successfully inserted all 32 dishes into MongoDB!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();