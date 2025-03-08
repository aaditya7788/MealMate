import axios from 'axios';
import { Basic_url } from '../config/config';
import { getAuthData } from '../LocalStorage/auth_store';
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

  export const searchIngredients = async (query) => {
    try {
      const response = await axios.get(`${Basic_url}/api/ingredients/search/${query}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to search ingredients');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error searching ingredients:', error);
      throw error;
    }
  };
  

// Get feed posts
export const getFeedPosts = async (type) => {
  try {
    const userData = await getAuthData();
    // console.log("User Data:", userData._id);
    const response = await axios.get(`${Basic_url}/api/post/randomposts/${type}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to retrieve feed');
    }

    const postsWithLikedStatus = await Promise.all(
      response.data.map(async (post) => {
       // console.log("Post:", post._id, userData._id);
        const likedResponse = await isPostLiked(post._id, userData._id);
        post.liked = likedResponse.liked;
        const totalStats = await getTotalStats(post._id);
        post.likes = totalStats.likes;
        post.reviews = totalStats.reviews;
       // console.log("Post:", post);
        return post;
      })
    ); 

    return postsWithLikedStatus;
  } catch (error) {
    return null;
  }
};


// Like a post
export const likePost = async (postId, userId) => {
  try {
    const response = await axios.post(`${Basic_url}/api/likes/likePost/${postId}`, { userId }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// Unlike a post
export const unlikePost = async (postId, userId) => {
  try {
    const response = await axios.post(`${Basic_url}/api/likes/unlikePost/${postId}`, { userId }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

// Review a post
export const reviewPost = async (postId, rating, comment) => {
  const userData = await getAuthData();
  const userId = userData._id;
  console.log("User ID:", userId);
  try {
    const response = await axios.post(`${Basic_url}/api/reviews/reviewPost/${postId}`, { userId, rating, comment }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error reviewing post:', error);
    throw error;
  }
};

export const isReviewed = async (postId, userId) => {
  try {
    const response = await axios.get(`${Basic_url}/api/reviews/isReviewed/${postId}?userId=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error checking if post is reviewed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch reviews of a post
export const getReviews = async (postId) => {
  const userData = await getAuthData();
  const userId = userData._id;
  console.log("Fetching reviews for Post ID:", postId);
  try {
    const isReviewedResponse = await isReviewed(postId, userId);
    console.log("Is Reviewed response:", isReviewedResponse);

    const response = await axios.get(`${Basic_url}/api/reviews/reviews/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Response data:", response.data);
    return { reviews: response.data.reviews, reviewed: isReviewedResponse.reviewed };
  } catch (error) {
    console.error('Error fetching reviews:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Delete a review
export const deleteReview = async (postId, userId) => {
  try {
    const response = await axios.delete(`${Basic_url}/api/reviews/deleteReview/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: { userId },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};


// Check if a post is liked by a user
export const isPostLiked = async (postId, userId) => {
  try {
    const response = await fetch(`${Basic_url}/api/likes/isPostLiked/${postId}?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null; // Return null instead of throwing an error
    }

    return await response.json();
  } catch {
    return null; // Ignore errors silently
  }
};


// Increment like count
export const incrementLikeCount = async (postId) => {
  try {
    const response = await axios.post(`${Basic_url}/api/statistics/incrementLike/${postId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error incrementing like count:', error);
    throw error;
  }
};

// Decrement like count
export const decrementLikeCount = async (postId) => {
  try {
    const response = await axios.post(`${Basic_url}/api/statistics/decrementLike/${postId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error decrementing like count:', error);
    throw error;
  }
};

// Increment review count
export const incrementReviewCount = async (postId) => {
  try {
    const response = await axios.post(`${Basic_url}/api/statistics/incrementReview/${postId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error incrementing review count:', error);
    throw error;
  }
};

// Decrement review count
export const decrementReviewCount = async (postId) => {
  try {
    const response = await axios.post(`${Basic_url}/api/statistics/decrementReview/${postId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error decrementing review count:', error);
    throw error;
  }
};

export const getNumberOfReviewedPosts = async (userId) => {
  try {
    const response = await axios.get(`${Basic_url}/api/reviews/numberOfReviewedPosts/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error retrieving number of reviewed posts:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Get total statistics of a post
export const getTotalStats = async (postId) => {
  try {
    const response = await axios.get(`${Basic_url}/api/statistics/totalStats/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error retrieving total statistics:', error);
    throw error;
  }
};


// Get liked posts of a user
export const getLikedPosts = async (userId) => {
  try {
    const response = await axios.get(`${Basic_url}/api/likes/likedPosts/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    //console.error('Error retrieving liked posts:', error);
    throw error;
  }
};