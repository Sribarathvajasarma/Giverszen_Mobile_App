import React, { useState } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Dimensions, ScrollView, } from 'react-native';
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from '../global/mapStyle';
import * as Location from 'expo-location'

const AddUser = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);
    //const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        setVisible(!visible);


    };


   // const map = useRef(1)


    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [latlng, setLatLng] = useState({})
    const [items, setItems] = useState([
        { label: '1Km', value: '1Km' },
        { label: '2Km', value: '2Km' },

    ])

    const button1handler = () => {
        checkPermission();
        getLocation()
        setCoordinates(latlng)
        console.log(latlng)

    };
    return (


        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginBottom: 20 }}>
                <View style={styles.container}>


                    <Text style={{ margin: 20, fontSize: 15 }}>User Name</Text>
                    <TextInput placeholder='Enter the user name'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}

                    />

                    <Text style={{ margin: 20, fontSize: 15 }}> Phone Number</Text>
                    <TextInput placeholder='Enter the phone number'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}

                    />
                    <Text style={{ margin: 20, fontSize: 15 }}>Pickup Location</Text>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <MapView
                            provider={PROVIDER_GOOGLE}
                           
                         
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
                            <Button title="Locate me" />
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
                        placeholder="Select distance"

                    />
                    <Text style={{ margin: 20, fontSize: 15 }}>
                        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />  I accept to get notify when there is nearest food listings.</Text>

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} >
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
