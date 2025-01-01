import { auth, db } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { saveAuthData, getAuthData } from "../../LocalStorage/auth_store";  // Import getAuthData for checking saved data

// Email Validation
export const validateEmail = (text, setEmail, setEmailError) => {
  setEmail(text);
  if (!text) {
    setEmailError("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(text)) {
    setEmailError("Invalid email format");
  } else {
    setEmailError("");
  }
};

// Password Validation
export const validatePassword = (text, setPassword, setPasswordError) => {
  setPassword(text);
  if (!text) {
    setPasswordError("Password is required");
  } else {
    setPasswordError("");
  }
};

// Name Validation
export const validateName = (text, setName, setNameError) => {
  setName(text);
  if (!text) {
    setNameError("Name is required");
  } else if (text.length < 2) {
    setNameError("Name must be at least 2 characters");
  } else {
    setNameError("");
  }
};

// Check if user data exists in AsyncStorage
export const checkAuthData = (navigation) => {
  getAuthData().then((data) => {
    if (data && data.email && data.password) {
      navigation.navigate("MainApp");  // Navigate to MainApp if auth data exists
    }
  });
};

// Handle Login
export const handleLogin = (email, password, emailError, passwordError, setFirebaseError, navigation) => {
  if (email && password && !emailError && !passwordError) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);

        // Save user data to AsyncStorage
        saveAuthData(user.email, password, user.stsTokenManager.accessToken, user.displayName, user.uid)
          .then(() => {
            console.log("User data saved to AsyncStorage");
          })
          .catch((error) => {
            console.error("Error saving auth data:", error);
          });

        navigation.navigate("MainApp"); // Navigate to Main screen on successful login
      })
      .catch((error) => {
        console.error(error);
        setFirebaseError(error.message);
      });
  }
};

// Handle Sign Up with Name
export const handleSignUp = (name, email, password, nameError, emailError, passwordError, setFirebaseError, navigation) => {
  console.log("handleSignUp called with:", { name, email, password, nameError, emailError, passwordError });

  if (name && email && password && !nameError && !emailError && !passwordError) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);

        // Store user data in Firestore
        if (user) {
          const userRef = doc(db, "users", user.uid);
          setDoc(userRef, {
            name: name,
            email: email,
            uid: user.uid,
          })
          .then(() => {
            console.log("User data stored in Firestore:", user);
          })
          .catch((error) => {
            console.error("Error storing user data in Firestore:", error);
            setFirebaseError(error.message);
          });
        }

        // Update profile with the user's name
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log("User profile updated with name:", name);
            saveAuthData(user.email, password, user.stsTokenManager.accessToken, name, user.uid) // Save user data to AsyncStorage
              .then(() => {
                console.log("User data saved to AsyncStorage");
              })
              .catch((error) => {
                console.error("Error saving auth data:", error);
              });

            navigation.navigate("MainApp"); // Navigate to Home screen on successful sign-up
          })
          .catch((error) => {
            console.error("Error updating profile:", error);
            setFirebaseError(error.message);
          });
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            setFirebaseError("The email address is not valid.");
            break;
          case 'auth/user-not-found':
            setFirebaseError("No user found with this email.");
            break;
          case 'auth/wrong-password':
            setFirebaseError("Incorrect password.");
            break;
          default:
            setFirebaseError("An error occurred. Please try again.");
        }
      });
  } else {
    console.log("Validation errors:", { nameError, emailError, passwordError });
  }
};


