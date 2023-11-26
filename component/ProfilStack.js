import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Login from './Login';
import Register from './Register';
import Profil from './Profil';

function ProfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profil" component={Profil} />
      <Stack.Screen name="Login" component={Login} options={ () => ({headerLeft: null, headerTitle: "Connexion" })}/>
      <Stack.Screen name="Register" component={Register} options={ () => ({headerTitle: "Inscription" })}/>
    </Stack.Navigator>
  );
}

export default ProfilStack;