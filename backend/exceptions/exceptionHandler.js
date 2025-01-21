export const handleException = (error) => {
    console.error('An error occurred:', error);
    // Add more detailed error handling logic here if needed
    return { success: false, message: error.message || 'An error occurred' };
  };