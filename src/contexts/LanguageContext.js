import React, { createContext, useEffect, useReducer, useState } from "react";
import { reducer as LanguageReducer, initialState } from '../reducers/LanguageReducer'
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LanguageContext = createContext()
export const LanguageProvider = ({ children }) => {
    const [lang_state, dispatch] = useReducer(LanguageReducer, initialState)
    useEffect(() => {
        const getLang = async () => {
            let language = await AsyncStorage.getItem('Language')
            if (language === null) {
                await AsyncStorage.setItem('Language', 'E')
                dispatch({ type: 'LANGUAGE_INIT', payload: 'E' })
            } else {
                dispatch({ type: 'LANGUAGE_INIT', payload: language })
            }
        }
        getLang()
    }, [])


    return (
        <LanguageContext.Provider value={{ lang_state, dispatch }}>
            {children}
        </LanguageContext.Provider>
    )
}
