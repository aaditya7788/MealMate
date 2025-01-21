import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f0f0f0',
  },
  errorToast: {
    borderLeftColor: '#FF0000',
    backgroundColor: '#f0f0f0',
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 14,
  },
});

export default toastConfig;