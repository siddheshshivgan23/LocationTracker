import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);

  useEffect(() => {
    const CLIENT_ID = '<YOUR_CLIENT_ID>';
    const API_KEY = '<YOUR_API_KEY>';
    const SPREADSHEET_ID = '<YOUR_SPREADSHEET_ID>';
    const SHEET_NAME = 'Sheet1'; // Change to your sheet's name

    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
          ],
          scope: 'https://www.googleapis.com/auth/spreadsheets',
        })
        .then(() => {
          console.log('Google API client initialized');
          setIsGapiInitialized(true);
        })
        .catch((error) => console.error('Error initializing Google API:', error));
    });

    const appendCoordinatesToSheet = (latitude, longitude) => {
      if (!isGapiInitialized) {
        console.error('Google API client not initialized yet');
        return;
      }

      gapi.client.sheets.spreadsheets.values
        .append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A:C`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [[new Date().toLocaleString(), latitude, longitude]],
          },
        })
        .then((response) => {
          console.log('Coordinates added to sheet:', response);
        })
        .catch((error) => console.error('Error adding coordinates to sheet:', error));
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          appendCoordinatesToSheet(latitude, longitude);
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
  }, [isGapiInitialized]);

  return (
    <div>
      <h1>Live Location Tracker</h1>
      {location.latitude && location.longitude ? (
        <div>
          <p>Coordinates: {location.latitude}, {location.longitude}</p>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default App;
