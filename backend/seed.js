import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.models.js";

dotenv.config();

const products = [
    {
        name: "Wireless Noise Cancelling Headphones",
        image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Experience pure silence with our premium wireless noise-cancelling headphones. Perfect for commute and travel.",
        brand: "SoundWave",
        category: "Electronics",
        price: 299.99,
        countInStock: 20,
        rating: 4.8,
        numReviews: 12,
    },
    {
        name: "Smart Watch Series 5",
        image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Stay connected and healthy with the latest Smart Watch Series 5. Features heart rate monitoring and GPS.",
        brand: "TechTime",
        category: "Electronics",
        price: 399.99,
        countInStock: 15,
        rating: 4.5,
        numReviews: 8,
    },
    {
        name: "Professional DSLR Camera",
        image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Capture life's moments in stunning detail with this professional DSLR camera kit.",
        brand: "ClickMaster",
        category: "Photography",
        price: 1299.99,
        countInStock: 5,
        rating: 4.9,
        numReviews: 25,
    },
    {
        name: "Ultra-Slim Laptop",
        image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Power meets portability. The Ultra-Slim Laptop is designed for professionals on the go.",
        brand: "CompTech",
        category: "Computers",
        price: 999.99,
        countInStock: 10,
        rating: 4.6,
        numReviews: 18,
    },
    {
        name: "Mechanical Gaming Keyboard",
        image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Dominate the game with responsive mechanical keys and customizable RGB lighting.",
        brand: "GameGear",
        category: "Accessories",
        price: 89.99,
        countInStock: 50,
        rating: 4.7,
        numReviews: 30,
    },
    {
        name: "4K Drone with Camera",
        image: "https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Fly high and capture breathtaking aerial 4K video. Easy to fly for beginners.",
        brand: "SkyHigh",
        category: "Electronics",
        price: 499.99,
        countInStock: 8,
        rating: 4.4,
        numReviews: 15,
    },
    {
        name: "Wireless Charging Pad",
        image: "https://images.pexels.com/photos/4526408/pexels-photo-4526408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Fast wireless charging for all your Qi-enabled devices. Sleek and modern design.",
        brand: "PowerUp",
        category: "Accessories",
        price: 29.99,
        countInStock: 100,
        rating: 4.2,
        numReviews: 45,
    },
    {
        name: "Smart Home Hub",
        image: "https://images.pexels.com/photos/4790255/pexels-photo-4790255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Control your entire home with your voice. Compatible with lights, locks, and more.",
        brand: "HomeSmart",
        category: "Smart Home",
        price: 149.99,
        countInStock: 25,
        rating: 4.3,
        numReviews: 10,
    },
    {
        name: "Bluetooth Speaker",
        image: "https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Portable sound that packs a punch. Waterproof design for outdoor adventures.",
        brand: "SoundWave",
        category: "Audio",
        price: 59.99,
        countInStock: 40,
        rating: 4.6,
        numReviews: 22,
    },
    {
        name: "Gaming Mouse",
        image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Precision optical sensor and ergonomic design for long gaming sessions.",
        brand: "GameGear",
        category: "Accessories",
        price: 49.99,
        countInStock: 60,
        rating: 4.5,
        numReviews: 35,
    },
    {
        name: "Virtual Reality Headset",
        image: "https://images.pexels.com/photos/3764937/pexels-photo-3764937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Immerse yourself in new worlds with our high-resolution VR headset.",
        brand: "VirtualVis",
        category: "Electronics",
        price: 299.99,
        countInStock: 12,
        rating: 4.0,
        numReviews: 5,
    },
    {
        name: "Action Camera",
        image: "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Rugged and waterproof. The perfect companion for your extreme sports adventures.",
        brand: "ClickMaster",
        category: "Photography",
        price: 199.99,
        countInStock: 18,
        rating: 4.7,
        numReviews: 28,
    },
    {
        name: "Tablet 10-inch",
        image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "Brilliant display and powerful processor for work and play.",
        brand: "CompTech",
        category: "Computers",
        price: 349.99,
        countInStock: 30,
        rating: 4.4,
        numReviews: 20,
    },
    {
        name: "Wireless Earbuds",
        image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "True wireless freedom with crystal clear sound and long battery life.",
        brand: "SoundWave",
        category: "Audio",
        price: 79.99,
        countInStock: 55,
        rating: 4.5,
        numReviews: 40,
    },
    {
        name: "Gaming Monitor",
        image: "https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description:
            "144Hz refresh rate and 1ms response time for smooth, tear-free gaming.",
        brand: "VisualPro",
        category: "Computers",
        price: 249.99,
        countInStock: 22,
        rating: 4.8,
        numReviews: 15,
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");

        await Product.deleteMany();
        console.log("Data Destroyed!");

        await Product.insertMany(products);
        console.log("Data Imported!");

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
