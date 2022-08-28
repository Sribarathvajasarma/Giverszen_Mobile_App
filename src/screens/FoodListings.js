import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LogBox } from 'react-native';
import * as Animatable from 'react-native-animatable';


const FoodListings = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true)
    const [state, setState] = useState([])


    useEffect(() => {
        try {
            setIsLoading(true)
            fetch("https://giverzenbackend.herokuapp.com/api/listings").then((response) => response.json())
                .then((responseData) => {
                    const markers = []
                    responseData.results.map((item, index) => {
                        let coordinate = { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                        const [fullDate, time] = item.expires_in.split('T');
                        const [year, month, date] = fullDate.split('-');

                        const [hour, minute, second] = time.split(':');
                        const [splited] = second.split('.000Z');

                        const dateTime = new Date(year, month, date, hour, minute, splited);

                        const final_expires_in = dateTime.toDateString() + ' ' + dateTime.toLocaleTimeString()
                        let obj = { id: item.id, coordinate: coordinate, image: item.avatar, name: item.name, description: item.description, poster_id: item.poster_id, expires_in: final_expires_in }
                        markers.push(obj)

                    })
                    setState(markers)
                    setIsLoading(false)


                })
                .done();
        }
        catch (e) {
            console.log(e);
        }

    }, [])

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
                            <View style={styles.card}
                            >
                                <View style={styles.cardImgWrapper}>
                                    <Image source={{ uri: item.image }} resizeMode="cover" style={styles.cardImg} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{item.name}</Text>
                                    <Text style={[styles.cardDetails, { color: '#009387' }]}>Best before: {item.expires_in}</Text>

                                    <Text style={styles.cardDetails}>Distance: 2km from your location</Text>
                                </View>
                            </View>
                        </TouchableOpacity></Animatable.View>
                )}
            />
        </View>
    )
}

export default FoodListings

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