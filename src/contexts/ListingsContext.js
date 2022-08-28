import React, { createContext, useEffect, useReducer, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { reducer as ListingsReducer, initialState } from '../reducers/ListingsReducer'
export const ListingsContext = createContext()




export const ListingsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ListingsReducer, initialState)
    useEffect(() => {
        dispatch({ type: 'START_LOADING' })
        fetch("https://giverzenbackend.herokuapp.com/api/listings").then((response) => response.json())
            .then((responseData) => {
                const markers = []
                responseData.results.map((item, index) => {
                    let coordinate = { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                    let obj = { coordinate: coordinate, image: item.avatar, name: item.name, description: item.description }
                    markers.push(obj)


                })

                dispatch({ type: 'INIT', payload: markers })
                console.log(state)

            })
            .done();


    }, [])
    return (
        <ListingsContext.Provider value={{ state, dispatch }}>
            {children}
        </ListingsContext.Provider>
    )
}

