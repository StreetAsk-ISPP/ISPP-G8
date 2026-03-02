import * as Location from 'expo-location';
import { useState } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError('');

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Location permission denied');
      setIsLoading(false);
      return null;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
    setIsLoading(false);
    return currentLocation.coords;
  };

  return {
    location,
    error,
    isLoading,
    getCurrentLocation,
  };
}
