import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import PinNumber from '../screens/PinNumber';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator();                               //Initialize stack for aithentication module
const AuthStack = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={SplashScreen} name="Splash" />
            <Stack.Screen component={Login} name="Login" />
            <Stack.Screen component={SignUp} name="Signup" />
            <Stack.Screen component={ForgotPassword} name="ForgotPassword" />
            <Stack.Screen component={PinNumber} name="PinNumber" />
            <Stack.Screen component={ResetPasswordScreen} name="ResetPasswordScreen" />
        </Stack.Navigator>
    )
}

export default AuthStack




