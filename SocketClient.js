import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext, useReducer, useState } from 'react'
import { SocketContext } from './src/contexts/SocketContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SocketClient = () => {
    const { dispatch, state } = useContext(SocketContext)
    const [auth, setAuth] = useState(0)
    useEffect(() => {
        const fetch_data = async () => {
            try {
                let userId = await AsyncStorage.getItem('userId')
                if (typeof (state) !== 'undefined') {
                    await state.payload.emit('joinUser', parseInt(userId))

                }
            } catch (e) {
                throw e
            }



        }
        fetch_data()


    }, [state.payload])



    return (
        <></>
    )
}

export default SocketClient

const styles = StyleSheet.create({})