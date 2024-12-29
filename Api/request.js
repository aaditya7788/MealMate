import axios from 'axios';

// Define the API request function to fetch categories
export const fetchCategories = async () => {
  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'; // Define the URL
  try {
    console.log(`Fetching categories from: ${url}`); // Log the URL
    const response = await axios.get(url);
    return response.data; // Return the data property of the response
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};

// Define the API request function to fetch recipes based on category
export const fetchRecipes = async (category) => {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`; // Define the URL
  try {
    console.log(`Fetching recipes from: ${url}`); // Log the URL
    const response = await axios.get(url);
    return response.data; // Return the data property of the response
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};

// Define the API request function to fetch recipe details based on id
export const fetchDetails = async (id) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`; // Correct URL
  try {
    console.log(`Fetching recipe details from: ${url}`); // Log the URL
    const response = await axios.get(url);
    return response.data; // Return the data property of the response
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};


