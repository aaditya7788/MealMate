import axios from 'axios';
import { getAuthData } from '../LocalStorage/auth_store';
import { Basic_url } from '../config/config';
import { scheduleNotification } from '../../helpers/notifications';
export const fetch_UserData = async () => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    const response = await axios.get(`${Basic_url}/api/users/userinfo`, {
      headers: {
        Authorization: `${authData.authToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch user data');
    }

    return response.data;
  } catch (error) {
    //console.error('Error fetching user data:', error);
    throw error;
  }
};

export const fetch_name_Userdata = async (name) => {
 

    const response = await axios.get(`${Basic_url}/api/users/user/search/${name}`, {
    
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch user data');
    }

    return response.data;
  }; 



export const fetch_UserData_id = async (uid) => {
  try {
    const response = await axios.get(`${Basic_url}/api/users/user/${uid }`,);
    if (response.status !== 200) {
      throw new Error('Failed to fetch user data');
    }
    return response.data;
  } catch (error) {
    //console.error('Error fetching user data:', error);
    throw error;
  }
};

export const profile_pic = async () => {
  try {
    const data = await fetch_UserData();
    const img_url = `${Basic_url}${data.profilepic}`;
    return img_url;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};



export const UpdateProfile = async (profileData) => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    const response = await axios.put(`${Basic_url}/api/users/updateProfile`, profileData, {
      headers: {
        Authorization: authData.authToken,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to update profile');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
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

    const responseData = await response.json();
    console.log('Meal added successfully:', responseData);

    // Extract day and time from mealData
    const { day, time, mealType } = mealData;

    // Parse time to extract hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Map selected day (Mon, Tue, ...) to actual date (next occurrence)
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const now = new Date();
    const today = now.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
    const targetDay = dayMap[day]; // Get the target day as per the user input
    const type = mealData.type; // Get the meal type from the meal data
    const title = mealData.title; // Get the meal title from the meal data
    let mealDate = new Date(now); // Clone the current date object

    if (targetDay === today) {
      // If the selected day is today, use today's date
      mealDate.setHours(hours); // Set the hour from the meal data
      mealDate.setMinutes(minutes); // Set the minutes from the meal data
      mealDate.setSeconds(0); // Reset seconds
    } else {
      // Calculate how many days to add to reach the target day
      const daysToAdd = (targetDay - today + 7) % 7 || 7;
      mealDate.setDate(now.getDate() + daysToAdd); // Set the day to the next occurrence of the target day
      mealDate.setHours(hours); // Set the hour from the meal data
      mealDate.setMinutes(minutes); // Set the minutes from the meal data
      mealDate.setSeconds(0); // Reset seconds
    }

    // Call the scheduleNotification function to schedule the notification
    scheduleNotification({
      year: mealDate.getFullYear(),
      month: mealDate.getMonth() + 1, // JavaScript months are 0-based
      day: mealDate.getDate(),
      hour: mealDate.getHours(),
      minute: mealDate.getMinutes(),
      type, // Include meal type in notification
      title, // Include meal title in notification
    });

    console.log(`🔔 Notification scheduled for: ${mealDate}`);

  } catch (error) {
    console.error('Error adding meal:', error);
  }
};

// Update meal status by ID
export const updateMealStatus = async (id) => {
  try {
    const authData = await getAuthData();
    if (!authData || !authData.authToken) {
      throw new Error('No auth token found');
    }

    const response = await axios.get(
      `${Basic_url}/api/meals/meals/${id}/completed`, // Pass the status in the request body
    );

    if (response.status !== 200) {
      throw new Error('Failed to update meal status');
    }

    console.log('Meal status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating meal status:', error);
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

    await axios.get(`${Basic_url}/api/meals/meals/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${authData.authToken}`,
      }
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};