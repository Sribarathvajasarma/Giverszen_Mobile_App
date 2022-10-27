import React, { createContext, useEffect, useReducer, useState } from "react";
import { reducer as DriverReducer, initialState } from '../reducers/DriverReducer'

export const DriverContext = createContext()
export const DriverProvider = ({ children }) => {
    const [state1, dispatch] = useReducer(DriverReducer, initialState)
    useEffect(() => {
        fetch("https://giverzenbackend.herokuapp.com/api/get_drivers").then((response) => response.json())
            .then((responseData) => {
                const drivers = []
                responseData.results.map((item, index) => {
                    const coords = { longitude: parseFloat(item.longitude), latitude: parseFloat(item.latitude) }
                    const driverObj = { id: item.id, coordinate: coords, Name: item.Name, Vehicle: item.Vehicle, image: item.Avatar, cost: item.CostPerkm }
                    drivers.push(driverObj)
                })
                dispatch({ type: 'DRIVER_INIT', payload: drivers })
            })
            .done();
    }, [])
    return (
        <DriverContext.Provider value={{ state1, dispatch }}>
            {children}
        </DriverContext.Provider>
    )
}

