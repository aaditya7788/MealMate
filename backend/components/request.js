import axios from 'axios';
import { getAuthData } from '../LocalStorage/auth_store';
import { Basic_url } from '../config/config';

export const fetchUserData = async () => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    const response = await axios.get(`${Basic_url}/api/users/user`, {
      headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhkMGEzOTFiMWM2MWUxODdkY2U3YjIiLCJpYXQiOjE3MzcyOTY0NDF9.q7uLDSukCMK9C8sRqYqZetim--DzjqjDpWrxwsaSXKI',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const profile_pic = async () => {
  try {
    const data = await fetchUserData();
    const img_url = `${Basic_url}${data.profilepic}`;
    return img_url;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

//MEALPLANNER
// Fetch meals for a specific day
export const fetchMeals = async (selectedDay) => {
  console.log(selectedDay);
  try {
    const authData = await getAuthData();
    const response = await fetch(`${Basic_url}/api/meals/meals/${selectedDay}?userId=${authData._id}`, {
      method: 'GET', // Or 'POST' depending on your API method
      headers: {
        'Content-Type': 'application/json',
        // Add other headers if needed
      }
     
    });
    console.log('rep:',response);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // Return the data to the caller
  } catch (error) {
    console.error('Error fetching meal:', error);
    throw error; // Re-throw error to be handled by the caller
  }
};


// Add a new meal
export const addMeal = async (mealData) => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${Basic_url}/api/meals/meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealData),
    });

    if (!response.ok) {
      throw new Error('Failed to add meal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding meal:', error);
    throw error;
  }
};
// Update a meal
export const updateMeal = async (id, mealData) => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    const response = await axios.put(`${Basic_url}/meals/${id}`, mealData, {
      headers: {
        Authorization: `Bearer ${authData.authToken}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

// Delete a meal
export const deleteMeal = async (id) => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    await axios.delete(`${Basic_url}/meals/${id}`, {
      headers: {
        Authorization: `Bearer ${authData.authToken}`,
      }
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};