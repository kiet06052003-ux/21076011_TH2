import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
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
      const { status: permStatus, canAskAgain } = await Location.requestForegroundPermissionsAsync();

      if (permStatus === 'granted') {
        setStatus('granted');
        let currentLoc;
        try {
          currentLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        } catch {
          // Mock location if emulator doesn't return real position
          currentLoc = {
            coords: {
              latitude: 10.8812,
              longitude: 106.8085,
            },
          };
        }

        const coords = {
          latitude: currentLoc.coords.latitude,
          longitude: currentLoc.coords.longitude,
        };
        setLocation(coords);

        const km = calculateHaversineDistance(
          coords.latitude,
          coords.longitude,
          CAMPUS_GATE.latitude,
          CAMPUS_GATE.longitude
        );
        setDistanceKm(km);
        setShipFee(calculateShipFee(km));
      } else if (!canAskAgain) {
        setStatus('blocked');
      } else {
        setStatus('denied');
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
