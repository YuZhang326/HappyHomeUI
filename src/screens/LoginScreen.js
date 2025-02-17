import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Keyboard,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { validateEmail, validatePassword } from '../utils/validators';
import { storeCredentials, getCredentials } from '../utils/storage';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      const credentials = await getCredentials();
      if (credentials) {
        setUsername(credentials.username);
        setPassword(credentials.password);
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validateEmail(username)) {
      Alert.alert('错误', '请输入有效的邮箱地址');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('错误', '密码至少需要8位');
      return;
    }

    setLoading(true);

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (rememberMe) {
        await storeCredentials(username, password);
      }

      onLogin();
    } catch (error) {
      Alert.alert('错误', '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <Text style={styles.title}>用户登录</Text>

      {/* 邮箱输入框 */}
      <TextInput
        style={[styles.input, styles.shadow]}
        placeholder="电子邮箱"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* 密码输入框 */}
      <TextInput
        style={[styles.input, styles.shadow]}
        placeholder="密码"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 原生 Button */}
      <Button
        title={loading ? '登录中...' : '登录'}
        onPress={handleLogin}
        disabled={loading}
        color={Platform.OS === 'ios' ? '#007AFF' : '#2196F3'}
      />

      {/* Loading 指示器 */}
      {loading && (
        <ActivityIndicator style={styles.indicator} size="small" color="#4A90E2" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 浅色背景
    backgroundColor: '#F5F8FA',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    height: 48,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  // iOS 使用阴影，Android 用 elevation
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  indicator: {
    marginTop: 16,
  },
});

export default LoginScreen;