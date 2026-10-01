import { useState, useEffect, useCallback } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { BASE_SHIP_FEE, VARIANT } from '../constants/student';

// Cổng KTX cố định trong code
export const CAMPUS_GATE = {
  latitude: 10.8700,
  longitude: 106.8030,
};

export type LocationPermissionStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'blocked';

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // 2 decimal places in km
}

export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  } else {
    // Formula B
    return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
  }
}

export function useCampusLocation() {
  const [status, setStatus] = useState<LocationPermissionStatus>('idle');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shipFee, setShipFee] = useState<number>(BASE_SHIP_FEE);

  const requestPermissionAndFetchLocation = useCallback(async () => {
    setStatus('loading');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền vị trí KTXGo',
            message: 'KTXGo cần vị trí của bạn để tính phí giao hàng chính xác.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('granted');
          const coords = { latitude: 10.8812, longitude: 106.8085 };
          setLocation(coords);
          const km = calculateHaversineDistance(
            coords.latitude,
            coords.longitude,
            CAMPUS_GATE.latitude,
            CAMPUS_GATE.longitude
          );
          setDistanceKm(km);
          setShipFee(calculateShipFee(km));
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setStatus('blocked');
        } else {
          setStatus('denied');
        }
      } else {
        // iOS or default
        setStatus('granted');
        const coords = { latitude: 10.8812, longitude: 106.8085 };
        setLocation(coords);
        const km = calculateHaversineDistance(
          coords.latitude,
          coords.longitude,
          CAMPUS_GATE.latitude,
          CAMPUS_GATE.longitude
        );
        setDistanceKm(km);
        setShipFee(calculateShipFee(km));
      }
    } catch {
      setStatus('denied');
    }
  }, []);

  const openDeviceSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => {
    requestPermissionAndFetchLocation();
  }, [requestPermissionAndFetchLocation]);

  return {
    status,
    location,
    distanceKm,
    shipFee,
    requestPermissionAndFetchLocation,
    openDeviceSettings,
  };
}
