import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Delivery = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [requests, setRequests] = useState([])
    const [confirmed, setConfirmed] = useState([])

    useEffect(() => {
        const fetch_data = async () => {
            try {
                setIsLoading(true)
                let userId = await AsyncStorage.getItem('userId')
                fetch("https://giverzenbackend.herokuapp.com/api/get_driver_requests").then((response) => response.json())        //Get driver requests from api
                    .then((responseData) => {
                        const request_arr = []
                        const confirmed_arr = []
                        responseData.results.map((item, index) => {
                            if (parseInt(item.driver_id) === parseInt(userId)) {         //Separate confirmed request and store it in different array 
                                if (item.status === 'requested') {
                                    request_arr.push(item)
                                } else {
                                    confirmed_arr.push(item)
                                }
                            }
                        })
                        setRequests(request_arr)
                        setConfirmed(confirmed_arr)
                        setIsLoading(false)
                    }).done();
            }
            catch (e) {
                console.log(e);
            }
        }
        fetch_data()
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
                        }}>{global.lang === 'T' ? 'வழங்குவதற்கான கோரிக்கைகள்' : (global.lang === 'S' ? 'භාරදීම සඳහා ඉල්ලීම්' : 'Requests for delivery')}</Text>
                        {requests.map((item, index) => (
                            <TouchableOpacity key={item.id} onPress={() => { navigation.navigate('DeliveryDetails', { requestData: item }) }}>
                                <View style={styles.mainCardView}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.subCardView}>
                                            <Image
                                                source={{ uri: item.user_avatar }}
                                                resizeMode="contain"
                                                style={{
                                                    borderRadius: 25,
                                                    height: 50,
                                                    width: 50,
                                                }}
                                            />
                                        </View>
                                        <View style={{ marginLeft: 12 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#050405",
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize',
                                                }}>
                                                {item.user_name}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.cardsWrapper}>
                        <Text style={{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333'
                        }}>{global.lang === 'T' ? 'உறுதி செய்யப்பட்ட கோரிக்கைகள்' : (global.lang === 'S' ? 'තහවුරු කරන ලද ඉල්ලීම්' : 'Confirmed delivery')}</Text>
                        {confirmed.map((item, index) => (
                            <TouchableOpacity key={item.id} onPress={() => { navigation.navigate('DriverRoute', { driverData: item }) }}>
                                <View style={styles.mainCardView}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.subCardView}>
                                            <Image
                                                source={{ uri: item.user_avatar }}
                                                resizeMode="contain"
                                                style={{
                                                    borderRadius: 25,
                                                    height: 50,
                                                    width: 50,
                                                }}
                                            />
                                        </View>
                                        <View style={{ marginLeft: 12 }}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#050405",
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize',
                                                }}>
                                                {item.user_name}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Delivery

const styles = StyleSheet.create({
    cardsWrapper: {
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
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