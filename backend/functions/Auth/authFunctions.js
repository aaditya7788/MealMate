import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export const validateEmail = (text, setEmail, setEmailError) => {
  setEmail(text);
  if (!text) {
    setEmailError('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(text)) {
    setEmailError('Invalid email format');
  } else {
    setEmailError('');
  }
};

export const validatePassword = (text, setPassword, setPasswordError) => {
  setPassword(text);
  if (!text) {
    setPasswordError('Password is required');
  } else {
    setPasswordError('');
  }
};

export const handleLogin = (email, password, emailError, passwordError, setFirebaseError, navigation) => {
  if (email && password && !emailError && !passwordError) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        navigation.navigate('MainApp'); // Navigate to Home screen on successful login
      })
      .catch((error) => {
        console.error(error);
        setFirebaseError(error.message);
      });
  }
};

export const handleSignUp = (email, password, emailError, passwordError, setFirebaseError, navigation) => {
  if (email && password && !emailError && !passwordError) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User created:', userCredential.user);
        navigation.navigate('MainApp'); // Navigate to Home screen on successful sign-up
      })
      .catch((error) => {
        console.error(error);
        setFirebaseError(error.message);
      });
  }
};