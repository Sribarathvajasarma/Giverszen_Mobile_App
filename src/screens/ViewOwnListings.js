import { Platform, StyleSheet, Text, Image, Alert, View, Dimensions, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const ViewOwnLisitngs = ({ navigation, route }) => {
    const itemData = route.params.itemData                   //Get itemData from previous screen
    const [user, setUser] = useState('')                      //Create states to store values
    const [loading, setLoading] = useState(false)
    const [requesters, setRequesters] = useState([])
    const [text, setText] = useState('')

    useEffect(() => {
        setLoading(true)
        const fetch_data = async () => {
            let userId = await AsyncStorage.getItem('userId')
            setUser(parseInt(userId))
            fetch("https://giverzenbackend.herokuapp.com/api/get_requests", {             //Get the requests of particular listings from api
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: itemData.id
                })
            }).then((response) => response.json())
                .then(async (responseData) => {
                    if (responseData.results) {
                        let Arr = []
                        responseData.results.map((item, index) => {
                            const [fullDate, time] = item.created_at.split('T');
                            const [year, month, date] = fullDate.split('-');
                            const [hour, minute, second] = time.split(':');
                            const [splited] = second.split('.000Z');
                            const dateTime = new Date(year, month, date, hour, minute, splited);
                            const final_created_at = dateTime.toDateString() + ' ' + dateTime.toLocaleTimeString()
                            let RequesterObj = { requesterId: item.requester_id, requesterName: item.username, listings_id: item.listings_id, avatar: item.avatar, requested_on: final_created_at, longitude: parseFloat(item.longitude), latitude: parseFloat(item.latitude) }
                            Arr.push(RequesterObj)                                            //Format data and store it in Arr
                        })
                        setRequesters(Arr)
                    } else {
                        setText('Your listing has not been requested yet')
                    }
                }).done();
            setLoading(false)
        }
        fetch_data()
    }, [])

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
                    <View style={styles.section}>
                        <Text style={styles.title}>Requesters</Text>
                        <Text style={styles.sectionContent}>{text}</Text>
                        {requesters.map((item, index) => (
                            <TouchableOpacity key={item.requesterName} onPress={() => navigation.navigate('Requester', { data: item })}>
                                <View style={styles.mainCardView}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.subCardView}>
                                            <Image
                                                source={{ uri: item.avatar }}
                                                resizeMode="contain"
                                                style={{ borderRadius: 25, height: 50, width: 50, }} />
                                        </View>
                                        <View style={{ marginLeft: 12 }}>
                                            <Text style={{ fontSize: 14, color: "#050405", fontWeight: 'bold', textTransform: 'capitalize', }}>
                                                {item.requesterName}
                                            </Text>
                                            <View style={{ marginTop: 4, borderWidth: 0, width: '85%', }}>
                                                <Text style={{ color: "#9B969B", fontSize: 12, }}>Requested on:{item.requested_on}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>Action</Text>
                        <View style={styles.categories}>
                            <TouchableOpacity onPress={() => { }}>
                                <View style={styles.categoryContainer}>
                                    <EvilIcons name='trash' size={25} style={{ marginTop: 1 }} color="#fff" />
                                    <Text style={styles.category}>Delete</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default ViewOwnLisitngs

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
        backgroundColor: '#FF0000',
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