import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food items

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  
  // Convert isAvailable from string to boolean
  const isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
  
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    isAvailable: isAvailable,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// edit food item
const editFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }
    
    // Validate inputs
    if (req.body.name && req.body.name.trim() === "") {
      return res.json({ success: false, message: "Name cannot be empty" });
    }
    if (req.body.description && req.body.description.trim() === "") {
      return res.json({ success: false, message: "Description cannot be empty" });
    }
    if (req.body.price && (isNaN(req.body.price) || Number(req.body.price) <= 0)) {
      return res.json({ success: false, message: "Price must be a positive number" });
    }
    if (req.body.category && req.body.category.trim() === "") {
      return res.json({ success: false, message: "Category cannot be empty" });
    }
    
    // Update fields if provided
    if (req.body.name) food.name = req.body.name;
    if (req.body.description) food.description = req.body.description;
    if (req.body.price) food.price = Number(req.body.price);
    if (req.body.category) food.category = req.body.category;
    
    // Handle image update
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      food.image = req.file.filename;
    }
    
    // Handle availability
    if (req.body.isAvailable !== undefined) {
      food.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    }
    
    await food.save();
    res.json({ success: true, message: "Food Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// toggle food availability
const toggleAvailability = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }
    
    food.isAvailable = !food.isAvailable;
    await food.save();
    
    res.json({ success: true, message: "Availability toggled", isAvailable: food.isAvailable });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood, editFood, toggleAvailability };
