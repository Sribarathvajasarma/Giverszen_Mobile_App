import React, { createContext, useEffect, useReducer, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { reducer as SocketReducer, initialState } from '../reducers/SocketReducer'
import SocketIOClient from "socket.io-client/dist/socket.io.js";

export const SocketContext = createContext()




export const SocketProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SocketReducer, initialState)

    useEffect(() => {
        const fetch_data = async () => {

            const socket = await SocketIOClient("https://giverzenbackend.herokuapp.com", {
                jsonp: false,
            });

            console.log(socket)
            await dispatch({ type: 'SOCKET_INIT', payload: socket })

            return () => socket.close()
        }
        fetch_data()

    }, [])




    return (
        <SocketContext.Provider value={{ state, dispatch }}>
            {children}
        </SocketContext.Provider>
    )
}

