// Browser location service to replace expo-location

export interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LocationObject {
  coords: LocationCoords;
  timestamp: number;
}

export const requestForegroundPermissionsAsync = async (): Promise<{ status: string }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ status: 'denied' });
      return;
    }
    resolve({ status: 'granted' });
  });
};

export const getCurrentPositionAsync = async (): Promise<LocationObject> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

export const reverseGeocodeAsync = async ({ latitude, longitude }: { latitude: number; longitude: number }): Promise<Array<{ city?: string; region?: string; country?: string }>> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    return [
      {
        city: data.city || data.locality,
        region: data.principalSubdivision,
        country: data.countryName,
      },
    ];
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return [];
  }
};


