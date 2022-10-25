import React, { useState, useRef } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from '../global/mapStyle';
import * as Location from 'expo-location'
//import basic react native components



const AddUser = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);
    //const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [coordinates, setCoordinates] = useState({ latitude: 9.704264, longitude: 80.069339 })



    const map = useRef(1)
    const [data, setData] = useState({
        username: '',
        phonenumber: '',
        longitude: '',
        latitude: '',
    }

    )



    const handleNameChange = (val) => {
        setData({
            ...data,
            username: val,

        })

    }
    const handlePhonenumberChange = (val) => {
        setData({
            ...data,
            phonenumber: val,

        })

    }


    // username,phonenumber,longitude,latitude,listingdistance

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [latlng, setLatLng] = useState({})
    const [items, setItems] = useState([
        { label: '1Km', value: '1' },
        { label: '2Km', value: '2' },

    ])


    const button1handler = () => {
        checkPermission();
        getLocation()
        setCoordinates(latlng)
        console.log(latlng)

    }
    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;
            const {
                coords: { latitude, longitude },

            } = await Location.getCurrentPositionAsync();
            setLatLng({ latitude: latitude, longitude: longitude })
        } catch (err) {

        }
    }

    const checkPermission = async () => {
        const hasPermission = await Location.requestForegroundPermissionsAsync();
        if (hasPermission.status === 'granted') {
            const permission = await askPermission()
            return permission
        }

        return true
    };

    const askPermission = async () => {
        const permission = await Location.requestForegroundPermissionsAsync()
        return permission.status === 'granted';
    }


    const handlesumit2 = () => {
        console.log(data.username)
        console.log(data.phonenumber)
        console.log(data.longitude)
        console.log(data.latitude)
        console.log(value)



        // if (username && phonenumber && longitude && latitude && listingdistance ) {
        //  console.log("Correct data")


        fetch("https://giverzenbackend.herokuapp.com/api/nonsmartphoneuser_register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                phonenumber: data.phonenumber,
                longitude: data.longitude,
                latitude: data.latitude,
                listingdistance: value,
            })
        })

            .then((response) => response.json())
            .then(async (responseData) => {
                console.log(responseData)
                  Alert.alert('User added succesfully')
                // if (responseData.code === 1) {

                  

                // } else {
                //     Alert.alert('Sorry unable to add user, Please try again')

                // }

            })
            .done();
        //  return { listings: [...state.listings], isLoading: false }
    }


    /*
        if (username && phonenumber && longitude && latitude && listingdistance ) {
            console.log("Correct data")
            
            fetch("https://giverzenbackend.herokuapp.com/api/nonsmartphoneuser_register", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    username: username,
                    phonenumber: phonenumber,
                    longitude: longitude,
                    latitude: latitude,
                    listingdistance: listingdistance,
                })
            })
    
                .then((response) => response.json())
                .then(async (responseData) => {
                    console.log(responseData)
                    if (responseData.code === 1) {
                        Alert.alert('User added succesfully')
    
                    } else {
                        Alert.alert('Sorry unable to add user, Please try again')
    
                    }
    
                })
                .done();
            return { listings: [...state.listings], isLoading: false }
        } */
    // const getVlaue = (val) => {
    //     setValue(val)
    // }

    return (


        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginBottom: 20 }}>
                <View style={styles.container}>



                    <Text style={{ margin: 20, fontSize: 15 }}>User Name</Text>
                    <TextInput placeholder='Enter the User Name'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleNameChange(val)}
                    />
                    {/* {data.isValidName ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Name can't be empty</Text>
                            </Animatable.View>
                        } */}


                    <Text style={{ margin: 20, fontSize: 15 }}>Phone Number</Text>
                    <TextInput placeholder='Enter the Phone Number'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handlePhonenumberChange(val)}
                    />

                    <Text style={{ margin: 20, fontSize: 15 }}>Pickup Location</Text>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            ref={map}
                            style={styles.map}
                            customMapStyle={mapStyle}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            initialRegion={{ longitude: latlng.longitude, latitude: latlng.latitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }}

                        >

                            <MapView.Marker draggable
                                coordinate={{ longitude: latlng.longitude ? latlng.longitude : 80.0000, latitude: latlng.latitude ? latlng.latitude : 9.0000 }}
                                onDragEnd={(e) => setData({
                                    ...data,
                                    longitude: e.nativeEvent.coordinate.longitude.toFixed(4),
                                    latitude: e.nativeEvent.coordinate.latitude.toFixed(4)
                                })}
                                identifier={'mk1'}
                            />



                        </MapView>
                        <View style={{

                            position: 'absolute',//use absolute position to show button on top of the map
                            bottom: '10%', //for center align
                            left: '25%',
                            width: Dimensions.get('window').width * 0.50,
                        }}
                        >
                            <Button title="Locate me" onPress={button1handler} />
                        </View>
                    </View>

                    <Text style={{ margin: 20, fontSize: 15 }}> Notify Between</Text>

                    <DropDownPicker style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10, width: 310 }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}

                    />
                    <Text style={{ margin: 20, fontSize: 15 }}>
                        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />  I accept to get notify when there is nearest food listings.</Text>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handlesumit2}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Home')}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15,
                                width: '90%'

                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>

    )
        ;

};

export default AddUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 2,
        marginLeft: 5,
        backgroundColor: '#fff',
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : 0,
        paddingLeft: 10,
        color: '#333333',
        fontSize: 15,
    },
    Ionicons: {
        marginTop: Platform.OS === 'ios' ? 0 : 10,
    },
    checkbox: {
        margin: 8,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    buttonContainer: {
        marginTop: -40,
        width: '100%',
        height: Dimensions.get('window').height / 10,
        backgroundColor: '#009387',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.9,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    map: {
        height: 400,

        marginVertical: 0,
        width: Dimensions.get('window').width * 0.92
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
});