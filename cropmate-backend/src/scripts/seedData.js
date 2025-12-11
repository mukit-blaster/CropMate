require('dotenv').config();
const mongoose = require('mongoose');
const KnowledgeTip = require('../models/KnowledgeTip');
const SellItem = require('../models/SellItem');

const knowledgeTips = [
  {
    category: "Rice",
    title: "Secrets to Doubling Boro Rice Yield",
    date: "Oct 12, 2023",
    readTime: "3 min read",
    image: "/assets/boro.jpg",
    short: "The timing of Urea application is critical. Learn the 3-stage split method.",
    full: "To get maximum yield in Boro rice, apply Urea in three split doses rather than all at once. The first dose should be given 15-20 days after planting to encourage rooting. The second dose is crucial during the tillering stage (maximizes stems). The final dose during the panicle initiation stage ensures heavy grains.",
  },
  {
    category: "Vegetables",
    title: "Spot & Stop Tomato Blight Early",
    date: "Nov 05, 2023",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=600&auto=format&fit=crop",
    short: "Early blight starts as small dark spots. Here is how to save your crop.",
    full: "Early blight is a fungal disease that starts on older leaves near the ground. To prevent this, ensure proper spacing between plants for airflow and water the soil, not the leaves (drip irrigation is best). If you see concentric ring spots, prune the affected leaves immediately.",
  },
  {
    category: "Fertilizer",
    title: "Zero-Cost Liquid Fertilizer Guide",
    date: "Sep 20, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop",
    short: "Don't buy expensive chemicals. Use farm waste to boost soil health.",
    full: "You can make 'Jeevamrut' or liquid fertilizer at home. Mix 10kg cow dung, 10L cow urine, 2kg jaggery (molasses), and 2kg chickpea flour in a drum with 200L water. Stir it clockwise twice a day. In 4-5 days, beneficial microbes will multiply by millions.",
  },
  {
    category: "Pest Control",
    title: "The Neem Oil Solution for Aphids",
    date: "Aug 15, 2023",
    readTime: "4 min read",
    image: "/assets/neem_oil.jpg",
    short: "Remove sucking pests without harming beneficial insects like bees.",
    full: "Aphids suck the sap from new leaves. Chemical sprays kill bees. Instead, mix 5ml of Neem Oil and 2ml of dish soap in 1 liter of warm water. Shake well and spray on the undersides of leaves in the evening.",
  },
  {
    category: "Rice",
    title: "Water Management in Paddy Fields",
    date: "Dec 01, 2023",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop",
    short: "Save water and fuel costs with the AWD (Alternate Wetting Drying) method.",
    full: "Rice does not need standing water all the time. Using AWD technology, you allow the field water to drop 15cm below the soil surface before irrigating again. This aerates the soil, makes roots stronger, and saves you 30% on diesel costs.",
  },
  {
    category: "Vegetables",
    title: "Growing Huge Eggplants",
    date: "Jan 10, 2024",
    readTime: "2 min read",
    image: "/assets/eggplants_new.jpg",
    short: "Pruning techniques to get larger, glossier fruits.",
    full: "For bigger eggplants, prune the side shoots (suckers) that appear below the first flower cluster. This directs the plant's energy into fruit production rather than leafy growth. Also, add calcium to the soil (eggshell powder or lime).",
  },
];

const sellItems = [
  // Medicine items
  {
    name: "Fungicide MaxGuard",
    type: "medicine",
    itemType: "FUNGICIDE",
    price: "400৳",
    rating: 4.7,
    available: true,
    location: "Sylhet",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400&auto=format&fit=crop",
    description: "A powerful systemic fungicide that cures and prevents fungal diseases like blight, mildew, and rot in vegetables and rice.",
  },
  {
    name: "Herbiclear Pro",
    type: "medicine",
    itemType: "HERBICIDE",
    price: "550৳",
    rating: 4.8,
    available: true,
    location: "Jessore",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop",
    description: "Fast-acting weed control solution designed to eliminate unwanted grass and broadleaf weeds without harming your main crops.",
  },
  {
    name: "InsectShield X",
    type: "medicine",
    itemType: "INSECTICIDE",
    price: "300৳",
    rating: 4.5,
    available: false,
    location: "Rangpur",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop",
    description: "Broad-spectrum insecticide highly effective against sucking pests like aphids, whiteflies, and thrips.",
  },
  {
    name: "RootGro Booster",
    type: "medicine",
    itemType: "GROWTH PROMOTER",
    price: "650৳",
    rating: 4.9,
    available: true,
    location: "Dhaka",
    image: "/assets/rootgrow.jpg",
    description: "Stimulates rapid root development and improves nutrient uptake efficiency, ensuring your plants establish quickly.",
  },
  {
    name: "SoilFix pH Balancer",
    type: "medicine",
    itemType: "SOIL CONDITIONER",
    price: "250৳",
    rating: 4.6,
    available: true,
    location: "Comilla",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=400&auto=format&fit=crop",
    description: "Corrects soil acidity and restores pH balance, creating the perfect environment for maximum crop yield.",
  },
  {
    name: "PestControl Ultra",
    type: "medicine",
    itemType: "INSECTICIDE",
    price: "420৳",
    rating: 4.7,
    available: true,
    location: "Barisal",
    image: "/assets/pest_control.jpg",
    description: "Heavy-duty protection against stubborn larvae and caterpillars. Essential for fruit and vegetable farmers.",
  },
  // Seed items
  {
    name: "Hybrid Rice Seed BRRI-29",
    type: "seeds",
    itemType: "RICE SEED",
    price: "120৳",
    rating: 4.9,
    available: true,
    location: "Bogura",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop",
    description: "High-yield Boro rice variety known for its resistance to blast disease and short maturity period.",
  },
  {
    name: "Tomato Seed SuperRed",
    type: "seeds",
    itemType: "VEGETABLE SEED",
    price: "80৳",
    rating: 4.6,
    available: true,
    location: "Rajshahi",
    image: "/assets/Tomato-Seed-Oil.jpg",
    description: "Produces firm, juicy, and deep red tomatoes with a long shelf life. Excellent for transport and summer cultivation.",
  },
  {
    name: "Golden Maize Hybrid",
    type: "seeds",
    itemType: "MAIZE SEED",
    price: "150৳",
    rating: 4.7,
    available: false,
    location: "Khulna",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=400&auto=format&fit=crop",
    description: "Drought-tolerant corn variety with large cob size and high grain weight. Suitable for both feed and flour.",
  },
  {
    name: "Premium Wheat Seed",
    type: "seeds",
    itemType: "WHEAT SEED",
    price: "180৳",
    rating: 4.8,
    available: true,
    location: "Dinajpur",
    image: "/assets/Premium-Quality-Wheat-Seeds.jpg",
    description: "Fast-maturing wheat variety optimized for winter harvesting. Resistant to rust and high temperatures.",
  },
  {
    name: "Spicy Chili Seeds",
    type: "seeds",
    itemType: "VEGETABLE SEED",
    price: "90৳",
    rating: 4.5,
    available: true,
    location: "Chittagong",
    image: "/assets/spicy_chilli_seeds.jpg",
    description: "Extremely spicy variety with high disease resistance. Produces abundant chilies throughout the season.",
  },
  {
    name: "Eggplant Purple King",
    type: "seeds",
    itemType: "VEGETABLE SEED",
    price: "110৳",
    rating: 4.6,
    available: true,
    location: "Mymensingh",
    image: "/assets/halal-agro-farm-lateer-eggplant-purpleking.webp",
    description: "High-yielding variety producing long, glossy purple fruits. Flesh is tender with very few seeds.",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await KnowledgeTip.deleteMany({});
    await SellItem.deleteMany({});
    console.log('Cleared existing data');

    // Insert knowledge tips
    const insertedTips = await KnowledgeTip.insertMany(knowledgeTips);
    console.log(`Inserted ${insertedTips.length} knowledge tips`);

    // Insert sell items
    const insertedItems = await SellItem.insertMany(sellItems);
    console.log(`Inserted ${insertedItems.length} sell items`);

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

