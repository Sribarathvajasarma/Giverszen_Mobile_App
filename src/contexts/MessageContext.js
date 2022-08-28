import React, { createContext, useEffect, useReducer, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { reducer as MessagesReducer, initialState } from '../reducers/MessagesReducer'
export const MessagesContext = createContext()




export const MessagesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(MessagesReducer, initialState)
    return (
        <MessagesContext.Provider value={{ state, dispatch }}>
            {children}
        </MessagesContext.Provider>
    )
}

