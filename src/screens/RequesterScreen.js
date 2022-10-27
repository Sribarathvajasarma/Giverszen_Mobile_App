import { Platform, StyleSheet, Text, Image, Alert, View, Dimensions, StatusBar, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const RequesterScreen = ({ navigation, route }) => {
    const [requester, setRequester] = useState({})                         //Create states to store values
    const [text, setText] = useState('Accept Request')
    const [text2, setText2] = useState('thumbs-up')
    const [text3, setText3] = useState('Will you accept to provide this listing to this User?')

    useEffect(() => {
        const requester_data = route.params.data                             //Get requester_data from previous screen and store it in requester state
        setRequester(requester_data)
    }, [])

    const AcceptHandler = async () => {
        if (text === 'Request Accepted') {                             //Check weather request is already accepted or not
            Alert.alert("Request already accepted")
        } else {
            fetch("https://giverzenbackend.herokuapp.com/api/accept_request", {                //Post accept request details to rest api
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: requester.requesterId,
                    listings_id: requester.listings_id
                })
            }).then((response) => response.json())
                .then(async (responseData) => {
                    setText('Request Accepted')
                    setText2('')
                    setText3('You have already accepted this request')
                    Alert.alert(responseData.msg)                           //Show successfull message
                }).done();
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar barStyle='light-content' />
                <View style={[styles.section, { height: 200 }]}>
                    <Image style={styles.userImg} source={{ uri: requester.avatar }} />
                </View>
                <View style={[styles.section, { height: 100 }]}>
                    <Text style={styles.title}>Requester Name</Text>
                    <Text style={styles.sectionContent}>{requester.requesterName}</Text>
                </View>
                <View style={[styles.section, { height: 100 }]}>
                    <Text style={styles.title}>Requested on</Text>
                    <Text style={[styles.sectionContent, { color: '#009387' }]}>{requester.requested_on}</Text>
                </View>
                <View style={[styles.section, { height: 300 }]}>
                    <Text style={[styles.title, { marginBottom: 5 }]}>Requester Location</Text>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1 }}
                        region={{
                            latitude: parseFloat(requester.latitude),
                            longitude: parseFloat(requester.longitude),
                            latitudeDelta: 0.008,
                            longitudeDelta: 0.008
                        }}>
                        <MapView.Marker
                            coordinate={{ latitude: parseFloat(requester.latitude), longitude: parseFloat(requester.longitude) }}
                            image={require('../../assets/imageedit_4_8648725550.png')} />
                    </MapView>
                    <Text style={[styles.sectionContent, { marginTop: 20 }]}>2km from your pickup point</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Action</Text>
                    <Text style={styles.sectionContent}>{text3}</Text>
                    <View style={styles.categories}>
                        <TouchableOpacity onPress={AcceptHandler}>
                            <View style={styles.categoryContainer}>
                                <Entypo name={text2} size={16} style={{ marginTop: 4 }} color="#fff" />
                                <Text style={styles.category}>{text}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default RequesterScreen

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
        marginTop: 10,
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
    userImg: {
        height: 125,
        width: 125,
        borderRadius: 75,
        marginTop: 20
    },
})