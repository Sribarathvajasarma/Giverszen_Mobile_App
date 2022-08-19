import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import Swiper from 'react-native-swiper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import { ScrollView } from 'react-native'
import { parameters } from '../global/styles'
import { ActivityIndicator } from 'react-native'
import { FAB } from 'react-native-paper'
import { Icon } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { LogBox } from 'react-native';
import * as Animatable from 'react-native-animatable';

import ListingsContext from '../contexts/ListingsContext'

let status_bar_height = getStatusBarHeight()

const Homen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [state, setState] = useState([])
    // const { state, dispatch } = useContext(ListingsContext)


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

                        let obj = { id: item.id, coordinate: coordinate, image: item.avatar, name: item.name, description: item.description, expires_in: final_expires_in }
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

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>)
    }
    else {
        return (
            <View style={styles.container}>
                {!isLoading &&
                    <>
                        <View style={styles.header}>
                            <View style={styles.icon1}>
                                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                    <Icon type="material-community"
                                        name="menu"
                                        color="#fff"
                                        size={50}
                                    /></TouchableOpacity>

                            </View>
                        </View>

                        <ScrollView>
                            <Animatable.View
                                animation="fadeIn"
                            >

                                <View style={styles.home}>

                                    <Text style={styles.text1}>Share your extra with Giverzen</Text>
                                    <View style={styles.view1}>


                                    </View>

                                </View>

                                <View style={styles.sliderContainer}>
                                    <Swiper autoplay height={200}>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165590/food-banner1_aitdxq.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165609/food-banner2_xducoi.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165635/food-banner3_q3zzfm.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165653/food-banner4_o91t2x.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1658165662/food-banner5_ggf7pg.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                    </Swiper>
                                </View>
                                <View style={[styles.categoryContainer, { marginTop: 20 }]}>
                                    <TouchableOpacity style={styles.categoryBtn} onPress={() => navigation.navigate('FoodListings')}>
                                        <View style={styles.categoryIcon}>
                                            <Ionicons name='ios-restaurant' size={35} color="#009387" />
                                        </View>
                                        <Text style={styles.categoryBtnTxt}>Food</Text>

                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.categoryBtn} onPress={() => navigation.navigate('NonFoodListings')}>
                                        <View style={styles.categoryIcon}>
                                            <Entypo name='book' size={35} color="#009387" />
                                        </View>
                                        <Text style={styles.categoryBtnTxt}>Non-Food</Text>

                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>

                                        <View style={styles.categoryIcon}>
                                            <FontAwesome5 name='hand-holding-heart' size={35} color="#009387" />
                                        </View>
                                        <Text style={styles.categoryBtnTxt}>Wanted</Text>

                                    </TouchableOpacity>



                                </View>

                                <View style={styles.cardsWrapper}>
                                    <Text style={{
                                        alignSelf: 'center',
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: '#333',

                                    }}>Nearest Listings</Text>
                                    <FlatList
                                        data={state}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
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
                                        )}
                                    />
                                    {/* {state.map((item, index) => (
                                <View style={styles.card} 
                                >
                                    <View style={styles.cardImgWrapper}>
                                        <Image source={{ uri: item.image }} resizeMode="cover" style={styles.cardImg} />
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardTitle}>{item.name}</Text>
                                        <Text style={styles.cardDetails}>{item.description}</Text>
                                    </View>
                                </View>

                            ))} */}




                                </View></Animatable.View>

                        </ScrollView>
                    </>

                }
                <FAB
                    style={styles.fab}
                    small
                    icon='plus'
                    label="Add"
                    onPress={() => navigation.navigate('AddListing')} />
            </View>
        )
    }
}

export default Homen

const styles = StyleSheet.create({
    container: {
        flex: 1,


    },

    home: {
        backgroundColor: "#009387",
        paddingLeft: 20,
        marginBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

    },

    icon1: {
        marginLeft: 10,
        marginTop: 5
    },
    header: {
        backgroundColor: "#009387",
        height: parameters.headerHeight,
        alignItems: "flex-start",
        paddingTop: 5

    },

    text1: {
        color: "#fff",
        fontSize: 20,

    },

    text2: {
        color: "#fff",
        fontSize: 16,
    },

    view1: {
        flexDirection: "row",
        flex: 1,
        paddingTop: 30
    },

    button1: {
        height: 40,
        width: 150,
        backgroundColor: "#010800",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },

    buttonText: {
        color: "#fff",
        fontSize: 17,
        marginTop: -2
    },
    view8: {
        flex: 4,
        marginTop: -25
    },

    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 10
    },

    wrapper: {},

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    categoryBtn: {
        flex: 1,
        width: '30%',
        marginHorizontal: 0,
        alignSelf: 'center',
    },
    categoryIcon: {
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 70,
        height: 70,
        backgroundColor: '#B4F7AE' /* '#FF6347' */,
        borderRadius: 50,
    },
    categoryBtnTxt: {
        alignSelf: 'center',
        marginTop: 5,
        color: '#000',
    },
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

    fab: {
        backgroundColor: '#219653',
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 5
    },

})

