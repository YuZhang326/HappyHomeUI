import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapAndFormScreen = () => {
  // 地图与定位状态
  const [region, setRegion] = useState({
    // 地图初始位置
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 表单状态
  const [time, setTime] = useState(null);
  const [doorNumber, setDoorNumber] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // 组件加载时获取当前定位与网络时间
  useEffect(() => {
    requestLocation();
    fetchCurrentTime();
  }, []);

  // ======== 获取当前位置 ========
  const requestLocationPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestLocation = async () => {
    setLoadingLocation(true);

    if (Platform.OS === 'android') {
      const hasPermission = await requestLocationPermissionAndroid();
      if (!hasPermission) {
        Alert.alert('提示', '定位权限被拒绝，无法显示当前位置');
        setLoadingLocation(false);
        return;
      }
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
        setCurrentLocation({ latitude, longitude });
        setLoadingLocation(false);
      },
      error => {
        Alert.alert('定位错误', error.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // ======== 从网络获取当前时区的时间 ========
  const fetchCurrentTime = async () => {
    try {
      // worldtimeapi.org 会根据请求的IP返回相应时区时间
      const response = await fetch('https://worldtimeapi.org/api/ip');
      const data = await response.json();
      // data.datetime 格式例如 "2023-01-01T12:34:56.789..."
      setTime(data.datetime);
    } catch (err) {
      console.warn('获取网络时间失败：', err);
    }
  };

  // ======== 点击“打卡”按钮的逻辑 ========
  const handleCheckIn = () => {
    // 这里可以将当前输入的数据提交到服务器等
    Alert.alert(
      '打卡成功',
      `时间：${time}\n门牌号：${doorNumber}\n街名：${street}\n邮编：${postalCode}`
    );
  };

  // ======== 界面渲染 ========
  return (
    <View style={styles.container}>
      {/* 上半部分：地图 */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={reg => setRegion(reg)}
        >
          {currentLocation && (
            <Marker coordinate={currentLocation} title="我的位置" />
          )}
        </MapView>
        {loadingLocation && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color="#007AFF"
          />
        )}
      </View>

      {/* 下半部分：表单 */}
      <View style={styles.formContainer}>
        {/* 当前时区时间 */}
        <Text style={styles.timeText}>
          当前时区时间：
          {time ? time : '获取中...'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="门牌号"
          value={doorNumber}
          onChangeText={setDoorNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="街名"
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          style={styles.input}
          placeholder="邮编"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />

        <Button title="打卡" onPress={handleCheckIn} />
      </View>
    </View>
  );
};

export default MapAndFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  mapContainer: {
    flex: 0.5, // 上半部分
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
  },
  formContainer: {
    flex: 0.5, // 下半部分
    padding: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 15,
    color: '#333',
  },
});
