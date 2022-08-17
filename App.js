// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import Home from './src/screens/Home';

// export default function App() {
//   return (
//     <Home />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import 'react-native-gesture-handler';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigations/AuthStack';
import AppStack from './src/navigations/AppStack';
import { ActivityIndicator } from 'react-native';
import { ListingsProvider } from './src/contexts/ListingsContext'

import { AuthContext } from './src/components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

navigator.__defineGetter__("userAgent", function () {   // you have to import rect native first !!
  return "react-native";
});

import SocketIOClient from "socket.io-client/dist/socket.io.js";
import { MessagesProvider } from './src/contexts/MessageContext';
import { SocketProvider } from './src/contexts/SocketContext';
import SocketClient from './SocketClient';


const App = () => {

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'START_LOADING':
        return {
          ...prevState,
          isLoading: true
        }


      case 'RETRIVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        }
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false
        }
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false
        }
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false
        }


    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)

  const authContext = React.useMemo(() => ({
    signIn: async (email, password) => {
      let userToken
      let auth = null
      userToken = null;
      // setUserToken('rggsfsd');
      // setIsLoading(false)
      dispatch({ type: 'START_LOADING' })

      fetch("https://giverzenbackend.herokuapp.com/api/login", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      })

        .then((response) => response.json())
        .then(async (responseData) => {
          if (responseData.access_token) {
            try {
              userToken = responseData.access_token
              let userAvatar = responseData.user.avatar
              let userEmail = responseData.user.email
              let userId = responseData.user.id.toString()
              let userLatitude = responseData.user.latitude
              let userLongitude = responseData.user.longitude
              let userName = responseData.user.username

              await AsyncStorage.setItem('userToken', userToken)
              await AsyncStorage.setItem('userAvatar', userAvatar)
              await AsyncStorage.setItem('userEmail', userEmail)
              await AsyncStorage.setItem('userId', userId)
              await AsyncStorage.setItem('userLatitude', userLatitude)
              await AsyncStorage.setItem('userLongitude', userLongitude)
              await AsyncStorage.setItem('userName', userName)

              dispatch({ type: 'LOGIN', id: email, token: userToken })


            } catch (e) {
              console.log(e)
            }
          } else {
            console.log("Login Failed")
          }

        })
        .done();

      // if (email === 'user' && password === 'pass') {
      //   try {
      //     userToken = 'dfdfsdf'
      //     await AsyncStorage.setItem('userToken', userToken)

      //   } catch (e) {
      //     console.log(e)
      //   }

      // }

    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false)
      try {
        await AsyncStorage.removeItem('userToken')
        await AsyncStorage.removeItem('userAvatar')
        await AsyncStorage.removeItem('userEmail')
        await AsyncStorage.removeItem('userId')
        await AsyncStorage.removeItem('userLatitude')
        await AsyncStorage.removeItem('userLongitude')
        await AsyncStorage.removeItem('userName')

      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'LOGOUT' })



    },
    signUp: async (username, email, password) => {
      try {
        let userToken
        userToken = null;
        dispatch({ type: 'START_LOADING' })
        fetch("https://giverzenbackend.herokuapp.com/api/register", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            username: username,
            longitude: '0.00000',
            latitude: '0.00000',
          })
        })

          .then((response) => response.json())
          .then(async (responseData) => {
            if (responseData.access_token) {
              try {
                userToken = responseData.access_token
                let userAvatar = responseData.user.avatar
                let userEmail = responseData.user.email
                let userId = responseData.user.id.toString()
                let userLatitude = responseData.user.latitude
                let userLongitude = responseData.user.longitude
                let userName = responseData.user.username

                await AsyncStorage.setItem('userToken', userToken)
                await AsyncStorage.setItem('userAvatar', userAvatar)
                await AsyncStorage.setItem('userEmail', userEmail)
                await AsyncStorage.setItem('userId', userId)
                await AsyncStorage.setItem('userLatitude', userLatitude)
                await AsyncStorage.setItem('userLongitude', userLongitude)
                await AsyncStorage.setItem('userName', userName)

                dispatch({ type: 'REGISTER', id: email, token: userToken })


              } catch (e) {
                console.log(e)
              }
            } else {
              console.log("Login Failed")
            }

          })
          .done();

        // userToken = 'dfdfsdf'
        // await AsyncStorage.setItem('userToken', userToken)

      } catch (e) {
        console.log(e)
      }
      // setUserToken('rggsfsd');
      // setIsLoading(false)
    }
  }), [])
  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null
      try {
        userToken = await AsyncStorage.getItem('userToken')

      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'RETRIVE_TOKEN', token: userToken })

      // setIsLoading(false)
    }, 1000)
  }, [])


  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  return (
    <AuthContext.Provider value={authContext}>
      <ListingsProvider>
        <MessagesProvider>
          <NavigationContainer>
            {loginState.userToken !== null ? <SocketProvider><SocketClient /><AppStack /></SocketProvider> : <AuthStack />}
          </NavigationContainer>
        </MessagesProvider>
      </ListingsProvider>
    </AuthContext.Provider>
  )
}

// <DestinationContextProvider>
//   <OriginContextProvider>
//     <MapScreen />


//   </OriginContextProvider>
// </DestinationContextProvider>







export default App
// import React, { useState, useEffect } from 'react';
// import { Image, View, Text, Dimensions } from 'react-native';
// import { Grid, Col, Row } from 'react-native-easy-grid';
// import { Magnetometer } from 'expo-sensors';

// const { height, width } = Dimensions.get('window');

// export default App = () => {

//   const [subscription, setSubscription] = useState(null);
//   const [magnetometer, setMagnetometer] = useState(0);

//   useEffect(() => {
//     _toggle();
//     return () => {
//       _unsubscribe();
//     };
//   }, []);

//   const _toggle = () => {
//     if (subscription) {
//       _unsubscribe();
//     } else {
//       _subscribe();
//     }
//   };

//   const _subscribe = () => {
//     setSubscription(
//       Magnetometer.addListener((data) => {
//         setMagnetometer(_angle(data));
//       })
//     );
//   };

//   const _unsubscribe = () => {
//     subscription && subscription.remove();
//     setSubscription(null);
//   };

//   const _angle = (magnetometer) => {
//     let angle = 0;
//     if (magnetometer) {
//       let { x, y, z } = magnetometer;
//       if (Math.atan2(y, x) >= 0) {
//         angle = Math.atan2(y, x) * (180 / Math.PI);
//       } else {
//         angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
//       }
//     }
//     return Math.round(angle);
//   };

//   const _direction = (degree) => {
//     if (degree >= 22.5 && degree < 67.5) {
//       return 'NE';
//     }
//     else if (degree >= 67.5 && degree < 112.5) {
//       return 'E';
//     }
//     else if (degree >= 112.5 && degree < 157.5) {
//       return 'SE';
//     }
//     else if (degree >= 157.5 && degree < 202.5) {
//       return 'S';
//     }
//     else if (degree >= 202.5 && degree < 247.5) {
//       return 'SW';
//     }
//     else if (degree >= 247.5 && degree < 292.5) {
//       return 'W';
//     }
//     else if (degree >= 292.5 && degree < 337.5) {
//       return 'NW';
//     }
//     else {
//       return 'N';
//     }
//   };

//   // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
//   const _degree = (magnetometer) => {
//     return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
//   };

//   return (

//     <Grid style={{ backgroundColor: 'black' }}>
//       <Row style={{ alignItems: 'center' }} size={.9}>
//         <Col style={{ alignItems: 'center' }}>
//           <Text
//             style={{
//               color: '#fff',
//               fontSize: height / 26,
//               fontWeight: 'bold'
//             }}>
//             {_direction(_degree(magnetometer))}
//           </Text>
//         </Col>
//       </Row>

//       <Row style={{ alignItems: 'center' }} size={.1}>
//         <Col style={{ alignItems: 'center' }}>
//           <View style={{ position: 'absolute', width: width, alignItems: 'center', top: 0 }}>
//             <Image source={require('./assets/compass_pointer.png')} style={{
//               height: height / 26,
//               resizeMode: 'contain'
//             }} />
//           </View>
//         </Col>
//       </Row>

//       <Row style={{ alignItems: 'center' }} size={2}>
//         <Text style={{
//           color: '#fff',
//           fontSize: height / 27,
//           width: width,
//           position: 'absolute',
//           textAlign: 'center'
//         }}>
//           {_degree(magnetometer)}°
//         </Text>

//         <Col style={{ alignItems: 'center' }}>

//           <Image source={require("./assets/compass_bg.png")} style={{
//             height: width - 80,
//             justifyContent: 'center',
//             alignItems: 'center',
//             resizeMode: 'contain',
//             transform: [{ rotate: 360 - magnetometer + 'deg' }]
//           }} />

//         </Col>
//       </Row>

//       <Row style={{ alignItems: 'center' }} size={1}>
//         <Col style={{ alignItems: 'center' }}>
//           <Text style={{ color: '#fff' }}>Copyright @RahulHaque</Text>
//         </Col>
//       </Row>

//     </Grid>

//   );
// }




