const axios = require("axios");

// Function to generate a random UID
const getRandomUID = () => {
  const uids = ["67946d52b495244990c66fda", "67946d7eb495244990c66fe3", "67946d9cb495244990c66fe6", "67946dd3b495244990c66fed", "67946df5b495244990c66ff0"];
  return uids[Math.floor(Math.random() * uids.length)];
};

// Recipe data
const recipes = [
  {
    name: "Tomato Cucumber Salad",
    dietType: "Veg",
    mealType: "Lunch",
    ingredients: [
      { name: "Tomatoes", quantity: "2" },
      { name: "Cucumber", quantity: "1" },
      { name: "Lettuce", quantity: "1 bunch" },
    ],
    instructions: "1. Wash vegetables.\n2. Chop tomatoes and cucumber.\n3. Mix in a bowl with lettuce.\n4. Add salt and pepper to taste.\n5. Serve fresh.",
    image: "/storage/posts/tomato_cucumber_salad.png",
  },
  {
    name: "Garlic Butter Pasta",
    dietType: "Veg",
    mealType: "Dinner",
    ingredients: [
      { name: "Spaghetti", quantity: "200g" },
      { name: "Garlic", quantity: "5 cloves" },
      { name: "Butter", quantity: "50g" },
    ],
    instructions: "1. Cook spaghetti as per instructions.\n2. Melt butter and sauté garlic.\n3. Toss spaghetti in garlic butter sauce.\n4. Add salt and pepper. Serve hot.",
    image: "/storage/posts/garlic_butter_pasta.png",
  },
  {
    name: "Avocado Toast",
    dietType: "Veg",
    mealType: "Breakfast",
    ingredients: [
      { name: "Avocado", quantity: "1" },
      { name: "Bread", quantity: "2 slices" },
      { name: "Lemon Juice", quantity: "1 tsp" },
    ],
    instructions: "1. Mash avocado with lemon juice.\n2. Spread on toasted bread.\n3. Add salt and pepper. Serve immediately.",
    image: "/storage/posts/avocado_toast.png",
  },
  {
    name: "Grilled Chicken Salad",
    dietType: "Non-Veg",
    mealType: "Lunch",
    ingredients: [
      { name: "Chicken Breast", quantity: "1" },
      { name: "Lettuce", quantity: "1 bunch" },
      { name: "Cherry Tomatoes", quantity: "10" },
    ],
    instructions:
      "1. Grill the chicken breast until cooked.\n2. Chop lettuce and halve cherry tomatoes.\n3. Mix all ingredients in a bowl.\n4. Add a vinaigrette dressing. Serve fresh.",
    image: "/storage/posts/grilled_chicken_salad.png",
  },
  {
    name: "Classic Pancakes",
    dietType: "Veg",
    mealType: "Breakfast",
    ingredients: [
      { name: "Flour", quantity: "1 cup" },
      { name: "Milk", quantity: "1 cup" },
      { name: "Egg", quantity: "1" },
    ],
    instructions:
      "1. Mix flour, milk, and egg into a batter.\n2. Heat a non-stick pan and pour batter to form pancakes.\n3. Flip when bubbles appear and cook until golden.\n4. Serve with honey or syrup.",
    image: "/storage/posts/classic_pancakes.png",
  },
  {
    name: "Vegetable Stir-Fry",
    dietType: "Veg",
    mealType: "Dinner",
    ingredients: [
      { name: "Broccoli", quantity: "1 head" },
      { name: "Carrots", quantity: "2" },
      { name: "Soy Sauce", quantity: "2 tbsp" },
    ],
    instructions:
      "1. Chop broccoli and carrots into bite-sized pieces.\n2. Heat oil in a wok and stir-fry vegetables.\n3. Add soy sauce and mix well.\n4. Serve with rice or noodles.",
    image: "/storage/posts/vegetable_stir_fry.png",
  },
  {
    name: "Mango Smoothie",
    dietType: "Veg",
    mealType: "Snack",
    ingredients: [
      { name: "Mango", quantity: "1" },
      { name: "Milk", quantity: "1 cup" },
      { name: "Honey", quantity: "1 tbsp" },
    ],
    instructions:
      "1. Peel and dice the mango.\n2. Blend mango, milk, and honey until smooth.\n3. Pour into a glass and serve chilled.",
    image: "/storage/posts/mango_smoothie.png",
  },
  {
    name: "Spicy Lentil Soup",
    dietType: "Veg",
    mealType: "Dinner",
    ingredients: [
      { name: "Red Lentils", quantity: "1 cup" },
      { name: "Carrots", quantity: "2" },
      { name: "Cumin", quantity: "1 tsp" },
    ],
    instructions:
      "1. Wash lentils and chop carrots.\n2. Cook lentils with carrots and cumin in 4 cups of water.\n3. Blend to a smooth consistency.\n4. Add salt and serve warm.",
    image: "/storage/posts/spicy_lentil_soup.png",
  },
  {
    name: "Baked Salmon",
    dietType: "Non-Veg",
    mealType: "Dinner",
    ingredients: [
      { name: "Salmon", quantity: "200g" },
      { name: "Lemon", quantity: "1" },
      { name: "Dill", quantity: "1 tbsp" },
    ],
    instructions:
      "1. Preheat oven to 180°C.\n2. Season salmon with lemon juice and dill.\n3. Bake for 20 minutes.\n4. Serve with steamed vegetables.",
    image: "/storage/posts/baked_salmon.png",
  },
  {
    name: "Classic Omelette",
    dietType: "Non-Veg",
    mealType: "Breakfast",
    ingredients: [
      { name: "Eggs", quantity: "2" },
      { name: "Butter", quantity: "1 tbsp" },
      { name: "Cheddar Cheese", quantity: "50g" },
    ],
    instructions:
      "1. Beat eggs in a bowl.\n2. Heat butter in a pan and pour eggs.\n3. Add cheese and fold omelette. Cook until set.\n4. Serve hot.",
    image: "/storage/posts/classic_omelette.png",
  },
];

// Loop through recipes and send requests
recipes.forEach((recipe) => {
  const uid = getRandomUID(); // Assign a random UID
  axios
    .post("http://192.168.0.102:5000/api/post/createPost", {
      uid: uid,
      name: recipe.name,
      dietType: recipe.dietType,
      mealType: recipe.mealType,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    })
    .then(() => {
      axios.post(
        `http://192.168.0.102:5000/api/post/uploadRecipeImage/${uid}`,
        { image: recipe.image }
      );
    })
    .catch(console.error);
});
