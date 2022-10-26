import { Platform, StyleSheet, Text, Image, Alert, View, Dimensions, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const ViewListings = ({ route }) => {
    const itemData = route.params.itemData                                  //Get itemData from previous screen
    const [user, setUser] = useState(0)                                     //Create states to store values
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("Request this listing")
    const [text2, setText2] = useState("Request")
    const [text3, setText3] = useState('thumbs-up')
    useEffect(() => {
        setLoading(true)
        const fetch_data = async () => {
            let userId = await AsyncStorage.getItem('userId')
            setUser(parseInt(userId))
            fetch("https://giverzenbackend.herokuapp.com/api/check_request", {           //Check the current user already request this listing using api
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: parseInt(userId),
                    listings_id: itemData.id
                })
            }).then((response) => response.json())
                .then(async (responseData) => {
                    if (responseData.code === 1) {                                 //Do actions according to the response values from server
                        setText('You have already requested this listing')
                        setText2("Cancel request")
                        setText3("thumbs-down")

                    }
                }).done();
            setLoading(false)
        }
        fetch_data()
    }, [])

    const RequestHandler = () => {
        setLoading(true)
        if (text2 === "Request") {
            fetch("https://giverzenbackend.herokuapp.com/api/add_request", {          //Post request details to api
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: parseInt(user),
                    listings_id: itemData.id
                })
            }).then((response) => response.json())
                .then(async (responseData) => {
                    if (responseData.msg === "Listing requested successfully") {
                        setText('You have already requested this listing')
                        setText2("Cancel request")
                        setText3("thumbs-down")
                        Alert.alert('Listing requested succesfully')
                    } else {
                        Alert.alert(responseData.msg)
                    }
                }).done();
        } else {
            fetch("https://giverzenbackend.herokuapp.com/api/delete_request", {        //Delete the existing request of this current user for this particular listing from api
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: parseInt(user),
                    listings_id: itemData.id
                })
            }).then((response) => response.json())
                .then(async (responseData) => {
                    if (responseData.msg === "Request removed") {
                        setText('You have already requested this listing')
                        setText2("Request")
                        setText3("thumbs-up")
                        Alert.alert('Listing request removed succesfully')               //Show successfull message
                    } else {
                        Alert.alert(responseData.msg)                                  //Show error message
                    }
                }).done();
        }
        setLoading(false)
    }
    if (loading === true) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <StatusBar barStyle='light-content' />
                    <Image source={{ uri: itemData.image }} style={styles.image} />
                    <View style={styles.section}>
                        <Text style={styles.title}>{itemData.name}</Text>
                    </View>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Best Before</Text>
                        <Text style={[styles.sectionContent, { color: '#009387' }]}>22 Aug 2022 10.00.00</Text>
                    </View>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Poster Name</Text>
                        <Text style={styles.sectionContent}>Vithiyasahar</Text>
                    </View>
                    <View style={[styles.section, { height: 150 }]}>
                        <Text style={styles.title}>description</Text>
                        <Text style={styles.sectionContent}>{itemData.description}</Text>
                    </View>
                    <View style={[styles.section, { height: 250 }]}>
                        <Text style={[styles.title, { marginBottom: 5 }]}>Pickup point</Text>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{ flex: 1 }}
                            region={{
                                latitude: itemData.coordinate.latitude,
                                longitude: itemData.coordinate.longitude,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008

                            }}>
                            <MapView.Marker
                                coordinate={itemData.coordinate}
                                image={require('../../assets/imageedit_4_8648725550.png')}
                            />
                        </MapView>
                    </View>
                    {(itemData.requester === 0) &&
                        <View style={styles.section}>
                            <Text style={styles.title}>Action</Text>
                            <Text style={styles.sectionContent}>{text}</Text>
                            <View style={styles.categories}>
                                <TouchableOpacity onPress={RequestHandler}>
                                    <View style={styles.categoryContainer}>
                                        <Entypo name={text3} size={16} style={{ marginTop: 4 }} color="#fff" />
                                        <Text style={styles.category}>{text2}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>}
                    {(itemData.requester !== 0) &&
                        <View style={styles.section}>
                            <Text style={[styles.title, { color: '#009387' }]}>This Listing has already been requested by someone and Accepted by owner</Text>
                        </View>}
                </ScrollView>
            </View>
        )
    }
}

export default ViewListings

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: MAX_HEIGHT,
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
        height: MIN_HEIGHT,
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