import { auth, db } from "./backend/config/firebaseConfig";  // Assuming the proper initialization
import { getFirestore, collection, addDoc, createUserWithEmailAndPassword } from 'firebase/firestore';

const createUser = async () => {
  const email = 'aadi67@gmail.com';
  const password = '123456';
  const name = 'aadi';

  try {
    // Step 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Add user details to Firestore collection 'users'
    await addDoc(collection(db, 'users'), {
      name: name,
      email: email,
      userId: user.uid,  // store UID for identification
    });

    console.log("User created successfully and data saved to Firestore!");

  } catch (error) {
    console.error("Error creating user:", error);
  }
};

createUser();
