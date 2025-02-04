import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

// 初始化地理编码
Geocoder.init('YOUR_GOOGLE_API_KEY');

const { width, height } = Dimensions.get('window');

const MapLocation = () => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // 获取当前位置
        Geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            
            // 获取地址信息
            const json = await Geocoder.from(latitude, longitude);
            const addr = json.results[0].formatted_address;
            
            setPosition({ latitude, longitude });
            setAddress(addr);
            setLoading(false);
          },
          (error) => {
            console.error(error);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000 }
        );
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 地图部分 */}
      <MapView
        style={styles.map}
        initialRegion={{
          ...position,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={position}
          title="您的位置"
          description={address}
        >
          <View style={styles.marker}>
            <View style={styles.markerPin} />
          </View>
        </Marker>
      </MapView>

      {/* 地址信息部分 */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>当前位置</Text>
        <Text style={styles.addressText}>{address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: height * 0.5, // 占据屏幕上半部分
  },
  marker: {
    alignItems: 'center',
  },
  markerPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: 'white',
  },
  addressContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  addressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapLocation;