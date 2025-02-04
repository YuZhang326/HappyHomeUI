import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          // Android 需要动态请求权限
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission Request',
              message: 'We need access to your location to provide a better service',
              buttonNeutral: 'Ask Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'Agree',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            throw new Error('Location Permission Denied');
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
          Unable to Retrieve Location: {error}
        </Text>
      );
    }

    // **确保 location 存在，并且 latitude / longitude 存在**
    if (!location || location.latitude == null || location.longitude == null) {
      return <Text style={styles.errorText}>Location data is unavailable.</Text>;
    }

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Latitude: {location.latitude ? location.latitude.toFixed(6) : 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          Longitude: {location.longitude ? location.longitude.toFixed(6) : 'N/A'}
        </Text>
        {location.altitude !== undefined && (
          <Text style={styles.infoText}>
            Altitude: {location.altitude.toFixed(2)} 米
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
