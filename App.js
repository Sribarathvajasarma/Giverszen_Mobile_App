import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigations/AuthStack';
import AppStack from './src/navigations/AppStack';
import { ActivityIndicator } from 'react-native';
import { ListingsProvider } from './src/contexts/ListingsContext'
import { AuthContext } from './src/components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessagesProvider } from './src/contexts/MessageContext';
import { SocketProvider } from './src/contexts/SocketContext';
import SocketClient from './SocketClient';
import { DriverProvider } from './src/contexts/DriverContext';
import { LanguageProvider } from './src/contexts/LanguageContext';

navigator.__defineGetter__("userAgent", function () {   // you have to import rect native first !!
  return "react-native";
});

const App = () => {
  useEffect(() => {
    const getLang = async () => {
      let language = await AsyncStorage.getItem('Language')             //Get current language from async storage
      if (language === null) {
        await AsyncStorage.setItem('Language', 'E')
        global.lang = 'E'                                            //Store it in global variable
      } else {
        global.lang = language;
      }
    }
    getLang()
  }, [])

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

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState)    //Use login reducer

  const authContext = React.useMemo(() => ({
    signIn: async (responseData) => {
      let userToken
      let auth = null
      userToken = null;
      dispatch({ type: 'START_LOADING' })

      try {
        userToken = responseData.access_token
        let userAvatar = responseData.user.avatar
        let userEmail = responseData.user.email
        let userId = responseData.user.id.toString()
        let userLatitude = responseData.user.latitude
        let userLongitude = responseData.user.longitude
        let userName = responseData.user.username
        let userRole = responseData.user.role
        let userMobile = responseData.user.phone

        await AsyncStorage.setItem('userToken', userToken)                 //Store logged in user's data in Async storage
        await AsyncStorage.setItem('userAvatar', userAvatar)
        await AsyncStorage.setItem('userEmail', userEmail)
        await AsyncStorage.setItem('userId', userId)
        await AsyncStorage.setItem('userLatitude', userLatitude)
        await AsyncStorage.setItem('userLongitude', userLongitude)
        await AsyncStorage.setItem('userName', userName)
        await AsyncStorage.setItem('userRole', userRole)
        await AsyncStorage.setItem('userMobile', userMobile)


        dispatch({ type: 'LOGIN', id: userEmail, token: userToken })           //Call LOGIN action
      } catch (e) {
        console.log(e)
      }
    },

    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken')              //Remove logged in user's data from async storage when logout
        await AsyncStorage.removeItem('userAvatar')
        await AsyncStorage.removeItem('userEmail')
        await AsyncStorage.removeItem('userId')
        await AsyncStorage.removeItem('userLatitude')
        await AsyncStorage.removeItem('userLongitude')
        await AsyncStorage.removeItem('userName')
        await AsyncStorage.removeItem('userRole')
        await AsyncStorage.removeItem('userMobile')

      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'LOGOUT' })
    },

    signUp: async (responseData) => {
      try {
        let userToken
        userToken = null;
        dispatch({ type: 'START_LOADING' })
        try {
          userToken = responseData.access_token
          let userAvatar = responseData.user.avatar
          let userEmail = responseData.user.email
          let userId = responseData.user.id.toString()
          let userLatitude = responseData.user.latitude
          let userLongitude = responseData.user.longitude
          let userName = responseData.user.username

          await AsyncStorage.setItem('userToken', userToken)                    //Store signed up user's data in Async storage
          await AsyncStorage.setItem('userAvatar', userAvatar)
          await AsyncStorage.setItem('userEmail', userEmail)
          await AsyncStorage.setItem('userId', userId)
          await AsyncStorage.setItem('userLatitude', userLatitude)
          await AsyncStorage.setItem('userLongitude', userLongitude)
          await AsyncStorage.setItem('userName', userName)
          await AsyncStorage.setItem('userRole', "user")
          await AsyncStorage.setItem('userMobile', "0769838892")


          dispatch({ type: 'REGISTER', id: userEmail, token: userToken })             //Call REGISTER action
        } catch (e) {
          console.log(e)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }), [])

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null
      try {
        userToken = await AsyncStorage.getItem('userToken')             //Get token from async storage
      } catch (e) {
        console.log(e)
      }
      dispatch({ type: 'RETRIVE_TOKEN', token: userToken })
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
      <LanguageProvider>
        <ListingsProvider>
          <DriverProvider>
            <MessagesProvider>
              <NavigationContainer>
                {loginState.userToken !== null ? <SocketProvider><SocketClient /><AppStack /></SocketProvider> : <AuthStack />}
              </NavigationContainer>
            </MessagesProvider>
          </DriverProvider>
        </ListingsProvider>
      </LanguageProvider>
    </AuthContext.Provider>
  )
}

export default App









