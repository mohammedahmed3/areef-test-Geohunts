   import React, { useEffect, useState } from 'react';
   import MapView, { Marker } from 'react-native-maps';
   import { fetchTreasures } from '../api/treasureApi';

   const MapPage = () => {
     const [treasures, setTreasures] = useState([]);

     useEffect(() => {
       fetchTreasures().then((data) => setTreasures(data));
     }, []);

     return (
       <MapView style={{ flex: 1 }}>
         {treasures.map((treasure) => (
           <Marker
             key={treasure.treasureId}
             coordinate={{
               latitude: treasure.location.lat,
               longitude: treasure.location.lng
             }}
             title={treasure.name}
             description={`Rarity: ${treasure.rarity}`}
           />
         ))}
       </MapView>
     );
   };

   export default MapPage;