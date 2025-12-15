import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import UpdateScreen from '../../screens/UpdateProfileScreen';
import { AppNavigation } from './app.navigation';

const Stack = createNativeStackNavigator();

export const RootNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="AppTabs" component={AppNavigation} />
    <Stack.Screen name="UpdateProfile" component={UpdateScreen} />
  </Stack.Navigator>
);
