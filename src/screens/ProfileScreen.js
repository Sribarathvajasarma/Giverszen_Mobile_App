import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View, ActivityIndicator, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";


const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetch_data = async () => {
            let userAvatar = await AsyncStorage.getItem('userAvatar')
            let userEmail = await AsyncStorage.getItem('userEmail')
            let userId = await AsyncStorage.getItem('userId')
            let userLatitude = await AsyncStorage.getItem('userLatitude')
            let userLongitude = await AsyncStorage.getItem('userLongitude')
            let userName = await AsyncStorage.getItem('userName')
            setUser({ userAvatar: userAvatar, userEmail: userEmail, userId: userId, userLatitude: userLatitude, userLongitude: userLongitude, userName: userName })
            setIsLoading(false)
        }
        fetch_data()


    }, [])

    if (isLoading) {
        return <ActivityIndicator />
    }
    else {
        return (

            <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}
                >
                    <Image style={styles.userImg} source={{ uri: user.userAvatar }} />
                    <Text style={styles.userName}>{user.userName}</Text>
                    <Text style={styles.aboutUser}>{user.userEmail}
                    </Text>

                    <View style={styles.userBtnWrapper}>
                        <TouchableOpacity style={styles.userBtn} onPress={() => { navigation.navigate('EditProfile') }}>
                            <Text style={styles.userBtnTxt}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.userBtn} onPress={() => {
                            showMessage({
                                message: "Simple message",
                                type: "info",
                            })
                        }}>
                            <Text style={styles.userBtnTxt}>Badges</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.userInfoWrapper}>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle}>22</Text>
                            <Text style={styles.userInfoSubTitle}>Listings</Text>
                        </View>

                        <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle}>22</Text>
                            <Text style={styles.userInfoSubTitle}>Wanted</Text>
                        </View>
                        <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle}>22</Text>
                            <Text style={styles.userInfoSubTitle}>Points</Text>
                        </View>

                    </View>


                    <Text style={{ justifyContent: 'flex-start', fontSize: 20, marginBottom: 5 }}>Your Listings</Text>
                    <View style={styles.card}>
                        <View style={styles.cardImgWrapper}>
                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1660188470/a7c96da4df74439f92e41ee94c6885d2_esejm1.jpg" }} resizeMode="cover" style={styles.cardImg} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Rice and curry</Text>
                            <Text style={[styles.cardDetails, { color: '#009387' }]}>Best before: Sat 27 Aug 2022 11.00.00</Text>
                        </View>
                    </View>


                    <Text style={{ justifyContent: 'flex-start', fontSize: 20, marginBottom: 5 }}>Your wanted</Text>
                    <View style={styles.card}>
                        <View style={styles.cardImgWrapper}>
                            <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1660187599/istockphoto-518760756-612x612_kois92.jpg" }} resizeMode="cover" style={styles.cardImg} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Dhosai</Text>
                            <Text style={[styles.cardDetails, { color: '#009387' }]}>Best before: Sat 27 Aug 2022 11.00.00</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )

    }

}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 20,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    userBtn: {
        borderColor: '#009387',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        backgroundColor: '#009387'

    },
    userBtnTxt: {
        color: '#fff',
    },
    userInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    userInfoItem: {
        justifyContent: 'center',
    },
    userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#009387'
    },
    userInfoSubTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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