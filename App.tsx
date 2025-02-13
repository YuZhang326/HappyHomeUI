import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Keyboard,
  Platform,
  SafeAreaView
} from 'react-native';
import Location from './src/components/Location';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    Keyboard.dismiss();
    
    if (!username || !password) {
      Alert.alert('错误', '请输入用户名和密码');
      return;
    }

    setLoggedIn(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!loggedIn ? (
        <View style={styles.formContainer}>
          <Text style={styles.title}>用户登录</Text>
          
          <TextInput
            style={styles.input}
            placeholder="用户名"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
          
          <Button
            title="登录"
            onPress={handleLogin}
            color={Platform.OS === 'ios' ? '#007AFF' : '#2196F3'}
          />
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>欢迎回来，</Text>
          <Text style={styles.usernameText}>{username}!</Text>
          
          <Text style={styles.sectionTitle}>当前位置信息</Text>
          <Location />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: '#666',
  },
  usernameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginTop: 30,
    marginBottom: 15,
  },
});