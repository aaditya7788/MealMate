import { Basic_url } from "../../backend/config/config";
import { getAuthData } from "../../backend/LocalStorage/auth_store";  // Import getAuthData function

export const SetProfilePic = async () => {
  try {
    // Retrieve authentication data from AsyncStorage
    const authData = await getAuthData();

    // Check if authData is available and contains a profilepic
    if (authData && authData.profilepic) {
      const PfpUrl = `${Basic_url}${authData.profilepic}`;
      console.log('Profile Picture URL:', PfpUrl);
      return PfpUrl;
    } else {
      console.log('Profile picture not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null;
  }
};
