import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import MapView, {Marker} from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, Accuracy, LocationAccuracy } from 'expo-location';
import { useRef } from 'react';


export default function App() {

  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null)

  async function requestLocationPermisions(){
    const { granted } = await requestForegroundPermissionsAsync();

    if(granted){
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);

      console.log("Localização atual: ", currentPosition)
    }
  }
  
  useEffect(()=> {
    requestLocationPermisions();
  },[])

 
 
 
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      console.log("Nova localização: ", response);
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    });
   },[]);
 
 
 
  return (
    <View style={styles.container}>
      {
        location &&

        <MapView
        ref = {mapRef}

        style={styles.map}
        
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}>

          <Marker
          coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          }}
        ></Marker>
        </MapView>
      }
    </View>
  );
}


