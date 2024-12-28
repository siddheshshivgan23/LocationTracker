import { useEffect, useState } from 'react';

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  
  useEffect(() => {
    if ('geolocation' in navigator) {
      // Watch position continuously
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  return (
    <div>
      <h1>Live Location Tracker</h1>
      {location.latitude && location.longitude ? (
        <div>
          <p>Co-ordinates: {location.latitude} {location.longitude}</p>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default App;
