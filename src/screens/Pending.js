import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'

const Pending = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [state, setState] = useState([])
    const [user, setUser] = useState(0)
    const [latlng, setLatLng] = useState({})


    useEffect(() => {
        const fetch_data = async () => {
            try {
                setIsLoading(true)
                let userId = await AsyncStorage.getItem('userId')
                let Id = parseInt(userId)
                fetch("https://giverzenbackend.herokuapp.com/api/listings").then((response) => response.json())
                    .then((responseData) => {
                        const markers = []
                        responseData.results.map((item, index) => {
                            // if (item.requester_id === Id) {
                            let coordinate = { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                            let obj = { id: item.id, coordinate: coordinate, image: item.avatar, name: item.name, description: item.description }
                            markers.push(obj)

                            //}


                        })
                        setState(markers)
                        checkPermission();
                        getLocation()
                        setIsLoading(false)


                    })
                    .done();

            } catch (e) {
                console.log(e);
            }

        }
        fetch_data()


    }, [])

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
            const {
                coords: { latitude, longitude },

            } = await Location.getCurrentPositionAsync();
            setLatLng({ latitude: latitude, longitude: longitude })
        } catch (err) {

        }
    }




    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])


    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    } else {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.cardsWrapper}>

                        <Text style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333'
                        }}>Your Confirmed Listings</Text>
                        <FlatList
                            keyExtractor={item => item.id}
                            data={state}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => navigation.navigate("Maps", { itemData: item, location: latlng })}>
                                    <View style={styles.card}
                                    >
                                        <View style={styles.cardImgWrapper}>
                                            <Image source={{ uri: item.image }} resizeMode="cover" style={styles.cardImg} />
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text style={styles.cardTitle}>{item.name}</Text>
                                            <Text style={styles.cardDetails}>Pickup time: Sat Aug 27 2022 10.00.00</Text>

                                            <Text style={styles.cardDetails}>Distance: 2km from your location</Text>

                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />


                        <Text style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                            paddingTop: 20
                        }}>Your Confirmed Wanted</Text>
                        <View style={styles.card}>
                            <View style={styles.cardImgWrapper}>
                                <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165635/food-banner3_q3zzfm.jpg" }} resizeMode="cover" style={styles.cardImg} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>dasasas</Text>
                                <Text style={styles.cardDetails}>dsdsdsdsd sdsvsdv sdsvd sdsvsdv sdsv</Text>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardImgWrapper}>
                                <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165635/food-banner3_q3zzfm.jpg" }} resizeMode="cover" style={styles.cardImg} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>dasasas</Text>
                                <Text style={styles.cardDetails}>dsdsdsdsd sdsvsdv sdsvd sdsvsdv sdsv</Text>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardImgWrapper}>
                                <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165635/food-banner3_q3zzfm.jpg" }} resizeMode="cover" style={styles.cardImg} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>dasasas</Text>
                                <Text style={styles.cardDetails}>dsdsdsdsd sdsvsdv sdsvd sdsvsdv sdsv</Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>


            </View>
        )
    }
}

export default Pending

const styles = StyleSheet.create({
    cardsWrapper: {
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
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