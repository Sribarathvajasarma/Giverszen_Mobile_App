import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LogBox } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NonFoodListings = ({ navigation, route }) => {
    const Location = route.params.locationCord
    const [isLoading, setIsLoading] = useState(true)
    const [state, setState] = useState([])

    useEffect(() => {
        const fetch_data = async () => {
            try {
                setIsLoading(true)
                let userId = await AsyncStorage.getItem('userId')
                fetch("https://giverzenbackend.herokuapp.com/api/listings").then((response) => response.json())        //Get listings data from api
                    .then((responseData) => {
                        const markers = []
                        responseData.results.map((item, index) => {
                            if (item.type === 'nonfood') {                             //Check weather it is a non-food listings or not
                                let distance = getHaversineDistance(parseFloat(item.latitude), parseFloat(item.longitude), Location.latitude, Location.longitude)     //Apply haversine formula
                                if (distance < 10.000) {
                                    if (parseInt(item.poster_id) !== parseInt(userId)) {                        //Check the listings not having current user as the poster 
                                        let coordinate = { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                                        let obj = { id: item.id, coordinate: coordinate, image: item.avatar, name: item.name, description: item.description, poster_id: item.poster_id, requester: item.requester_id }
                                        markers.push(obj)                                    //Format data and store it in array
                                    }
                                }
                            }
                        })
                        setState(markers)
                        setIsLoading(false)
                    }).done();
            }
            catch (e) {
                console.log(e);
            }
        }
        fetch_data()
    }, [])

    function getHaversineDistance(lat1, lon1, lat2, lon2) {                        //Haversine formula
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
        const hasPermission = await Location.requestForegroundPermissionsAsync();       //Check app has permission to access location from device
        if (hasPermission.status === 'granted') {
            const permission = await askPermission()
            return permission
        }
        return true
    };

    const askPermission = async () => {
        const permission = await Location.requestForegroundPermissionsAsync()                    //Ask permission to access the location
        return permission.status === 'granted';
    }

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
            setLatLng({ latitude: latitude, longitude: longitude })                                 //Get device location and store it in state
        } catch (err) { }
    }

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);                       //Avoid warnings
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={item => item.id}
                data={state}
                renderItem={({ item }) => (
                    <Animatable.View
                        animation="fadeInDown">
                        <TouchableOpacity onPress={() => navigation.navigate("ViewListings", { itemData: item })}>
                            <View style={styles.card}>
                                <View style={styles.cardImgWrapper}>
                                    <Image source={{ uri: item.image }} resizeMode="cover" style={styles.cardImg} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <Text style={styles.cardDetails}>Distance: 2km from your location</Text>
                                    {(item.requester !== 0) && <Text style={[styles.cardDetails, { color: '#009387', fontWeight: 'bold' }]}>Already Accepted</Text>}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                )} />
        </View>
    )
}

export default NonFoodListings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center'
    },
    card: {
        height: 100,
        marginVertical: 10,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    cardImgWrapper: {
        flex: 1,
    },
    cardImg: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    cardInfo: {
        flex: 2,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardDetails: {
        fontSize: 12,
        color: '#444',
    },
})