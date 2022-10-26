import { Platform, StyleSheet, Text, Image, Alert, View, Dimensions, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';


const DriverDetails = ({ route }) => {
    const driverData = route.params.driverData              //Get driver data from previous screen 
    const item = route.params.item
    const location = route.params.location
    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const [userId, setUserId] = useState('')
    const [userAvatar, setUserAvatar] = useState('')

    useEffect(() => {
        const fetch_data = async () => {
            let userAvatar = await AsyncStorage.getItem('userAvatar')          //Get current user details from async storage
            setUserAvatar(userAvatar)
            let userId = await AsyncStorage.getItem('userId')
            setUserId(userId)
            let userName = await AsyncStorage.getItem('userName')
            setUserName(userName)
        }
        setIsLoading(true)
        fetch_data()
        setIsLoading(false)
    }, [])

    const AddRequest = () => {
        fetch("https://giverzenbackend.herokuapp.com/api/add_driver_request", {                   //Post request to api
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: parseInt(userId),
                driver_id: driverData.id,
                listing_id: item.id,
                pickup_longitude: item.coordinate.longitude,
                pickup_latitude: item.coordinate.latitude,
                dest_longitude: location.latitude,
                dest_latitude: location.longitude,
                user_avatar: userAvatar,
                driver_avatar: driverData.image,
                user_name: userName,
                driver_name: driverData.Name
            })
        }).then((response) => response.json())
            .then(async (responseData) => {
                if (responseData.msg === "Listing requested successfully") {
                    Alert.alert('Driver requested succesfully')                          //Show successfull message
                } else {
                    Alert.alert(responseData.msg)
                }
            }).done();
    }

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    } else {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <StatusBar barStyle='light-content' />
                    <Image source={{ uri: driverData.image }} style={styles.image} />
                    <View style={styles.section}>
                        <Text style={styles.title}>{driverData.Name}</Text>
                    </View>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Vehicle</Text>
                        <Text style={styles.sectionContent}>{driverData.Vehicle}</Text>
                    </View>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Cost per km</Text>
                        <Text style={styles.sectionContent}>80.00</Text>
                    </View>
                    <View style={[styles.section, { height: 250 }]}>
                        <Text style={[styles.title, { marginBottom: 5 }]}>Driver location</Text>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{ flex: 1 }}
                            region={{
                                latitude: driverData.coordinate.latitude,
                                longitude: driverData.coordinate.longitude,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008

                            }}>
                            <MapView.Marker
                                coordinate={driverData.coordinate}
                                image={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1664360457/carMarker_fhnqix.png" }}
                            />
                        </MapView>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>Action</Text>
                        <View style={styles.categories}>
                            <TouchableOpacity onPress={AddRequest}>
                                <View style={styles.categoryContainer}>
                                    <Entypo name='thumbs-up' size={16} style={{ marginTop: 4 }} color="#fff" />
                                    <Text style={styles.category}>Request this driver for delivery</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default DriverDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 400,
        width: Dimensions.get('window').width,
        alignSelf: 'stretch',
        resizeMode: 'cover',
    },
    title: {
        fontSize: 20,
    },
    name: {
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionContent: {
        fontSize: 16,
        textAlign: 'justify',
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    categoryContainer: {
        flexDirection: 'row',
        backgroundColor: '#009387',
        borderRadius: 20,
        margin: 10,
        padding: 10,
        paddingHorizontal: 15,
    },
    category: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
    },
    titleContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageTitle: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 24,
    },
    navTitleView: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 40 : 5,
        opacity: 0,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    sectionLarge: {
        minHeight: 300,
    },
    mainCardView: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#050505",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 14,
        marginTop: 6,
        marginBottom: 6,
        marginLeft: 16,
        marginRight: 16,
    },
    subCardView: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "#FC0808 ",
        borderColor: "#050505",
        borderWidth: 1,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
    },
})