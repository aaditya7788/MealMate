import axios from 'axios';
import { Basic_url } from '../config/config';

export const postRecipe = async (recipeData) => {
  try {
    const response = await axios.post(`${Basic_url}/api/post/createPost`, recipeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201) {
      throw new Error('Failed to post recipe');
    }

    return response.data;
  } catch (error) {
    console.error('Error posting recipe:', error);
    throw error;
  }
};

export const getRecipePosts = async (uid) => {
    try {
      const response = await axios.get(`${Basic_url}/api/post/posts/${uid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to retrieve recipe');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error retrieving recipe:', error);
      throw error;
    }
  };

  export const getSpecificPost = async (pid) => {
    try {
      const response = await axios.get(`${Basic_url}/api/post/post/${pid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to retrieve recipe');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error retrieving recipe:', error);
      throw error;
    }
  };

  export const uploadRecipeImage = async (postId, formData) => {
    try {
      const response = await axios.post(`${Basic_url}/api/post/uploadRecipeImage/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading recipe image:', error);
      throw error;
    }
  };