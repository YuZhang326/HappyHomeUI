import EncryptedStorage from 'react-native-encrypted-storage';

export const storeCredentials = async (username, password) => {
  await EncryptedStorage.setItem('user_credentials', JSON.stringify({
    username,
    password
  }));
};

export const getCredentials = async () => {
  const credentials = await EncryptedStorage.getItem('user_credentials');
  return credentials ? JSON.parse(credentials) : null;
};