const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');
const connectDB = require('../db');

const ingredientsFilePath = path.join(__dirname, '../ingredient.txt');
const ingredients = fs.readFileSync(ingredientsFilePath, 'utf-8').split('\n').map(ingredient => ingredient.trim());

const populateIngredients = async () => {
  await connectDB();

  for (const ingredient of ingredients) {
    await Ingredient.create({ name: ingredient });
  }

  console.log('Ingredients populated successfully');
  mongoose.connection.close();
};

populateIngredients();