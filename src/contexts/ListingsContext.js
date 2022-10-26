import React, { createContext, useEffect, useReducer, useState } from "react";
import { reducer as ListingsReducer, initialState } from '../reducers/ListingsReducer'
import * as Location from 'expo-location'

export const ListingsContext = createContext()
export const ListingsProvider = ({ children }) => {
    const [foodstate, dispatch] = useReducer(ListingsReducer, initialState)
    const [latlng, setLatLng] = useState({})

    useEffect(() => {
        checkPermission();
        getLocation()
    }, [])

    useEffect(() => {
        if (Object.keys(latlng).length !== 0) {
            console.log(latlng)
            fetch("https://giverzenbackend.herokuapp.com/api/listings").then((response) => response.json())
                .then((responseData) => {
                    const markers = []
                    responseData.results.map((item, index) => {
                        let distance = getHaversineDistance(parseFloat(item.latitude), parseFloat(item.longitude), latlng.latitude, latlng.longitude)
                        if (distance < 10.000) {
                            let coordinate = { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                            const [fullDate, time] = item.expires_in.split('T');
                            const [year, month, date] = fullDate.split('-');
                            const [hour, minute, second] = time.split(':');
                            const [splited] = second.split('.000Z');
                            const dateTime = new Date(year, month, date, hour, minute, splited);
                            const final_expires_in = dateTime.toDateString() + ' ' + dateTime.toLocaleTimeString()
                            let obj = { id: item.id, coordinate: coordinate, image: item.avatar, name: item.name, description: item.description, expires_in: final_expires_in, status: item.status }
                            markers.push(obj)
                        }
                    })
                    dispatch({ type: 'LISTING_INIT', payload: markers })
                })
                .done();
        }


    }, [latlng])

    function getHaversineDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    const checkPermission = async () => {
        const hasPermission = await Location.requestForegroundPermissionsAsync();
        if (hasPermission.status === 'granted') {
            const permission = await askPermission()
            return permission
        }
        return true
    };

    const askPermission = async () => {
        const permission = await Location.requestForegroundPermissionsAsync()
        return permission.status === 'granted';
    }

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;
            const { coords: { latitude, longitude }, } = await Location.getCurrentPositionAsync();
            setLatLng({ latitude: latitude, longitude: longitude })
        } catch (err) { console.log(err); }
    }

    return (
        <ListingsContext.Provider value={{ foodstate, dispatch }}>
            {children}
        </ListingsContext.Provider>
    )
}

