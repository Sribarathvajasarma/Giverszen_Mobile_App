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


export default App
