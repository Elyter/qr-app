import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState, useEffect } from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import HomeScreen from './component/HomeScreen';
import Classement from './component/Classement';
import ProfilStack from './component/ProfilStack';

const Tab = createBottomTabNavigator();

function dataReq() {
  const url = `https://mdljm.fr:8443/data/getData`
  return fetch(url)
  .then((response) => response.json())
  .catch((error) => console.error(error))
}

export default function App() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    dataReq().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);
  if (isLoading) {
    return <View style={styles.loading_container}><ActivityIndicator size='large' /></View>
  } else {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name= {data.name}
          component={HomeScreen} 
          options={{
            tabBarIcon: ({color, size})=> (
              <Ionicons name={"home-outline"} size={size} color={color} />
            ),
          }} 
        />
        <Tab.Screen 
          name="Classement"
          component={Classement}
          options={{
            tabBarIcon: ({color, size})=> (
              <Ionicons name={"bar-chart-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfilStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size})=> (
              <Ionicons name={"person-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
  }
}

const styles = StyleSheet.create({
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
