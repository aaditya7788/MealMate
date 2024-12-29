import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoogleIcon from '../../Icons/GoogleIcon';
import { validateEmail, validatePassword, handleSignUp } from '../../backend/functions/Auth/authFunctions';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>Sign Up for MealMate</Text>
      
      <TouchableOpacity style={styles.googleButton}>
        <GoogleIcon />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>or</Text>
      
      <TextInput
        style={styles.input}
        placeholder="EMAIL"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => validateEmail(text, setEmail, setEmailError)}
      />
      {emailError ? <Text style={styles.ErrorText}>{emailError}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text) => validatePassword(text, setPassword, setPasswordError)}
      />
      {passwordError ? <Text style={styles.ErrorText}>{passwordError}</Text> : null}
      
      <TouchableOpacity 
        style={styles.createAccountButton} 
        onPress={() => handleSignUp(email, password, emailError, passwordError, setFirebaseError, navigation)}
      >
        <Text style={styles.createAccountButtonText}>Sign Up Now</Text>
      </TouchableOpacity>
      
      {firebaseError ? <Text style={styles.ErrorText}>{firebaseError}</Text> : null}

      <TouchableOpacity>
        <Text 
          style={styles.linkText}  
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: '80%',
    height: '100%',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F59E0B'
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  googleButtonText: {
    marginLeft: 10,
  },
  orText: {
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  createAccountButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ErrorText: {
    color: 'red',
    textAlign: 'left',
    marginBottom: 10,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: 'black',
    marginBottom: 10,
  },
});

export default SignUpScreen;