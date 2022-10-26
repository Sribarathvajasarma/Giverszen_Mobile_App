import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const DelivaryDetail = ({ route }) => {
    const requestData = route.params.requestData                  //get request data from previous screen 
    const [isLoading, setIsLoading] = useState(true)
    const AcceptHandler = () => {
        console.log("Accepted")
    }

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    } else {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Requester Name</Text>
                        <Text style={[styles.sectionContent, { color: '#009387' }]}>{requestData.user_name}</Text>
                    </View>
                    <View style={[styles.section, { height: 250 }]}>
                        <Text style={[styles.title, { marginBottom: 5 }]}>Pickup point/Destination</Text>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{ flex: 1 }}
                            region={{
                                latitude: requestData.pickup_latitude,
                                longitude: requestData.pickup_longitude,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008
                            }}>
                            <MapView.Marker
                                coordinate={{ latitude: requestData.pickup_latitude, longitude: requestData.pickup_longitude }}
                                image={require('../../assets/imageedit_4_8648725550.png')}
                            />
                            <MapView.Marker
                                coordinate={{ latitude: requestData.dest_latitude, longitude: requestData.dest_longitude }}
                                image={require('../../assets/imageedit_4_8648725550.png')}
                            />
                        </MapView>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>Action</Text>
                        <View style={styles.categories}>
                            <TouchableOpacity onPress={AcceptHandler}>
                                <View style={styles.categoryContainer}>
                                    <Entypo name="thumbs-up" size={16} style={{ marginTop: 4 }} color="#fff" />
                                    <Text style={styles.category}>Accept</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default DelivaryDetail

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