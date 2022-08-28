// import * as React from 'react';
// // import { useEffect } from 'react';
// import { createStackNavigator } from "@react-navigation/stack";
// import OnBoardingScreen from '../screens/OnBoardingScreen';
// import LoginScreen from '../screens/LoginScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import SignupScreen from '../screens/SignupScreen'

// const Stack = createStackNavigator();

// export function AuthStack() {
//     const [isFirstLaunch, setIsFirstLaunch] = React.useState("");

//     useEffect(() => {
//         AsyncStorage.getItem('alreadyLaunced').then(value => {
//             if (value === null) {
//                 AsyncStorage.setItem('alreadyLaunced', "true");
//                 setIsFirstLaunch(true);
//             } else {
//                 setIsFirstLaunch(false)
//             }
//         })


//     }, []);

//     if (isFirstLaunch === null) {
//         return null
//     } else if (isFirstLaunch === true) {
//         return (
//             <Stack.Navigator>
//                 <Stack.Screen name="OnBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
//                 <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//                 <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />



//             </Stack.Navigator>
//         )
//     } else {
//         return (
//             <Stack.Navigator>
//                 <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//                 <Stack.Screen name="Signup" component={SignupScreen} />
//             </Stack.Navigator>)
//     }



// }


import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import ForgotPassword from '../screens/ForgotPassword.js';
import PinNumber from '../screens/PinNumber';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';




const Stack = createNativeStackNavigator();
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




