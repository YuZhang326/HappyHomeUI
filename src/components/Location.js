import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: '位置权限申请',
              message: '我们需要访问您的位置以提供更好的服务',
              buttonNeutral: '稍后询问',
              buttonNegative: '取消',
              buttonPositive: '同意',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            throw new Error('位置权限被拒绝');
          }
        }

        Geolocation.getCurrentPosition(
          position => {
            setLocation(position.coords);
            setLoading(false);
          },
          err => {
            setError(err.message);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    requestPermissions();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#4A90E2" />;
    }

    if (error) {
      return (
        <Text style={styles.errorText}>
          无法获取位置: {error}
        </Text>
      );
    }

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          纬度: {location.latitude?.toFixed(6) || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          经度: {location.longitude?.toFixed(6) || 'N/A'}
        </Text>
        {location.altitude && (
          <Text style={styles.infoText}>
            海拔: {location.altitude.toFixed(2)} 米
          </Text>
        )}
      </View>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    width: '100%',
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
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Location;