import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import UpdateScreen from '../../screens/UpdateProfileScreen';
import { AppNavigation } from './app.navigation';
import PhaseDetailScreen from '../../screens/PhaseDetailScreen';
import CreateReportScreen from '../../screens/CreateReportScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import ChangePasswordScreen from '../../screens/ChangePasswordScreen';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
import GuideDetailScreen from '../../screens/GuideDetailScreen';

const Stack = createNativeStackNavigator();

export const RootNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="UpdateProfile" component={UpdateScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    
    <Stack.Screen name="Profile" component={ProfileScreen} />

    <Stack.Screen name="PhaseDetail" component={PhaseDetailScreen} />
    <Stack.Screen name="CreateReport" component={CreateReportScreen} />

    <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />

    <Stack.Screen name="AppTabs" component={AppNavigation} />
  </Stack.Navigator>
);
