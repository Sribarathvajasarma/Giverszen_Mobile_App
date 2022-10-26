import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import Swiper from 'react-native-swiper'
import Ionicons from 'react-native-vector-icons/Ionicons'
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
import * as Location from 'expo-location'
import { LanguageContext } from '../contexts/LanguageContext'
import ListingsContext from '../contexts/ListingsContext'

let status_bar_height = getStatusBarHeight()

const Homen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [state1, setstate1] = useState([])
    const [latlng, setLatLng] = useState({})
    const [point, setPoint] = useState(0.0000)
    const { dispatch, lang_state } = useContext(LanguageContext)                        //Get current language using context api

    useEffect(() => {                                                                                           //Get device location
        setIsLoading(true)
        checkPermission();
        getLocation()
    }, [])

    useEffect(() => {
        try {
            if (Object.keys(latlng).length !== 0) {
                fetch("https://giverzenbackend.herokuapp.com/api/listings").then((response) => response.json())            //Get listings data from api
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
                                markers.push(obj)                          //Format data and store it into markers array
                            }
                        })
                        setstate1(markers)
                        setIsLoading(false)
                    })
                    .done();
            }
        }
        catch (e) {
            console.log(e);
        }
    }, [latlng])


    function getHaversineDistance(lat1, lon1, lat2, lon2) {                     //Haversine algorithm
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
        if (hasPermission.status === 'granted') {                                     //Check app has permission to access location from device
            const permission = await askPermission()
            return permission
        }
        return true
    };

    const askPermission = async () => {
        const permission = await Location.requestForegroundPermissionsAsync()                 //Ask permission to access the location
        return permission.status === 'granted';
    }

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;
            const {
                coords: { latitude, longitude },

            } = await Location.getCurrentPositionAsync();

            setLatLng({ latitude: latitude, longitude: longitude })                 //Get device location and store it in state
        } catch (err) { }
    }

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);                 //avoid warnings
    }, [])

    if (isLoading) {
        return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>)
    } else {
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
                            <Animatable.View animation="fadeIn">
                                <View style={styles.home}>
                                    {lang_state.language === 'T' ? <Text style={styles.text1}>உங்கள் கூடுதல் பொருட்களை கிவெர்ஸ்ஷென் உடன் பகிர்ந்து கொள்ளுங்கள்</Text> : (lang_state.language === 'S' ? <Text style={styles.text1}>Giverszen සමඟ ඔබේ අමතර කොටස් බෙදා ගන්න</Text> : <Text style={styles.text1}>Share your extra with Giverszen</Text>)}
                                    <View style={styles.view1}></View>
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
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1661305454/istockphoto-1316145932-170667a_kggzad.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1661305675/istockphoto-1220017909-170667a_uw6jxa.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                        <View style={styles.slide}>
                                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1661305836/selection-of-chinese-food-that-may-cause-chinese-restaurant-syndrome_f5zw2n.jpg" }}
                                                resizeMode="cover"
                                                style={styles.sliderImage} />
                                        </View>
                                    </Swiper>
                                </View>
                                <View style={[styles.categoryContainer, { marginTop: 20 }]}>
                                    <TouchableOpacity style={styles.categoryBtn} onPress={() => navigation.navigate('FoodListings', { locationCord: latlng })}>
                                        <View style={styles.categoryIcon}>
                                            <Ionicons name='ios-restaurant' size={35} color="#009387" />
                                        </View>
                                        {lang_state.language === 'T' ? <Text style={styles.categoryBtnTxt}>உணவு</Text> : (lang_state.language === 'S' ? <Text style={styles.categoryBtnTxt}>කෑම</Text> : <Text style={styles.categoryBtnTxt}>Food</Text>)}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.categoryBtn} onPress={() => navigation.navigate('NonFoodListings', { locationCord: latlng })}>
                                        <View style={styles.categoryIcon}>
                                            <Entypo name='book' size={35} color="#009387" />
                                        </View>
                                        {lang_state.language === 'T' ? <Text style={styles.categoryBtnTxt}>உணவு அல்லாதவை</Text> : (lang_state.language === 'S' ? <Text style={styles.categoryBtnTxt}>ආහාර නොවන</Text> : <Text style={styles.categoryBtnTxt}>Non-Food</Text>)}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                                        <View style={styles.categoryIcon}>
                                            <FontAwesome5 name='hand-holding-heart' size={35} color="#009387" />
                                        </View>
                                        {lang_state.language === 'T' ? <Text style={styles.categoryBtnTxt}>தேவையானது</Text> : (lang_state.language === 'S' ? <Text style={styles.categoryBtnTxt}>අවශ්ය</Text> : <Text style={styles.categoryBtnTxt}>Wanted</Text>)}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cardsWrapper}>
                                    <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: '#333' }}>{lang_state.language === 'T' ? 'அருகிலுள்ள பட்டியல்கள்' : (lang_state.language === 'ආසන්නතම ලැයිස්තුගත කිරීම්' ? '' : 'Nearest Listings')}</Text>
                                    <FlatList
                                        data={state1}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => navigation.navigate("ViewListings", { itemData: item })}>
                                                <View style={styles.card}>
                                                    <View style={styles.cardImgWrapper}>
                                                        <Image source={{ uri: item.image }} resizeMode="cover" style={styles.cardImg} />
                                                    </View>
                                                    <View style={styles.cardInfo}>
                                                        <Text style={styles.cardTitle}>{item.name}</Text>
                                                        {item.status !== 'expired' ?
                                                            <Text style={[styles.cardDetails, { color: '#009387' }]}>Best before: {item.expires_in}</Text>
                                                            : <Text style={[styles.cardDetails, { color: '#FF0000' }]}>Expired</Text>
                                                        }
                                                        <Text style={styles.cardDetails}>Distance: 2km from your location</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View></Animatable.View>
                        </ScrollView>
                    </>
                }
                <FAB
                    style={styles.fab}
                    small
                    icon='plus'
                    label={lang_state.language === 'T' ? "பட்டியலைச் சேர்க்க" : (lang_state.language === 'S' ? 'ලැයිස්තුගත කිරීම එකතු කරන්න' : 'Add')}
                    onPress={() => navigation.navigate('SelectionScreen')} />
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

