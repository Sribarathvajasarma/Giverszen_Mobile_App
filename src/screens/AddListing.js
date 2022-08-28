import { StyleSheet, Text, View, Platform, StatusBar, TextInput, TouchableOpacity, Dimensions, Button, Image, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'

import * as ImagePicker from 'expo-image-picker';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location'
import { ActivityIndicator } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { mapStyle } from '../global/mapStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ListingsContext } from '../contexts/ListingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";



const AddListing = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true)
    const [latlng, setLatLng] = useState({})
    const [longitude, setLongitude] = useState(0.00000)
    const isFocused = useIsFocused();
    const [coordinates, setCoordinates] = useState({ latitude: 9.704264, longitude: 80.069339 })
    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [text, setText] = useState('2022/08/01 07:11:50')
    const { state, dispatch } = useContext(ListingsContext)


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShow(false)
        setDate(currentDate)
        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear()
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds()
        setText(fDate + ' ' + fTime)
        setData({
            ...data,
            expires_in: text
        })
    }
    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
    }

    const map = useRef(1)


    const [data, setData] = useState({
        name: '',
        description: '',
        avatar: null,
        quantity: '',
        longitude: '',
        latitude: '',
        expires_in: '',
        type: 'food'


    })



    const handleNameChange = (val) => {
        setData({
            ...data,
            name: val
        })
    }

    const handleDescriptionChange = (val) => {
        setData({
            ...data,
            description: val
        })
    }

    const handleImageChange = (val) => {
        setData({
            ...data,
            avatar: val
        })
    }

    const handleQuantityChange = (val) => {
        setData({
            ...data,
            quantity: val
        })
    }

    const handleLocationChange = () => {
        setData({
            ...data,
            longitude: long,
            latitude: lat
        })
    }



    const handleSubmit = () => {
        dispatch({ type: "ADD_LISTING", payload: data })
        if (state.success) {
            showMessage({
                message: "Success",
                description: "Listing successfully addded",
                type: "success",
            });
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

    useEffect(() => {
        const fetch_data = async () => {
            checkPermission();
            getLocation()
            let userId = await AsyncStorage.getItem('userId')
            let intUserId = parseInt(userId)
            setData({
                ...data,
                poster_id: intUserId
            })
        }
        fetch_data()
        setLoading(false)

    }, [])



    const button1handler = () => {
        checkPermission();
        getLocation()
        setCoordinates(latlng)
        console.log(latlng)

    }




    const handlebutton2 = () => {
        setData({
            ...data,
            longitude: latlng.longitude,
            latitude: latlng.latitude
        })

    }






    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        //https://dev.to/joypalumbo/uploading-images-to-cloudinary-in-react-native-using-cloudinary-s-api-37mo
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (!result.cancelled) {
            setImage(result.uri);
            let base64Img = `data:image/jpg;base64,${result.base64}`;

            let data = {
                "file": base64Img,
                "upload_preset": "blko7fqh",
            }

            fetch('https://api.cloudinary.com/v1_1/dqt5uhnm0/upload', {
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(async r => {
                let data = await r.json()
                handleImageChange(data.url)

            }).catch(err => console.log(err))
        };
    }



    if (loading) {
        return <ActivityIndicator size='large' style={{ marginTop: 200 }} />;

    } else {


        return (
            <View>
                {loading && <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />}
                {!loading && <ScrollView style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', marginTop: 50, marginLeft: 30, marginBottom: 20 }}>
                        <TouchableOpacity style={[styles.uploadBtn, !image ? {
                            borderStyle: 'dashed', borderWidth: 1
                        } : { borderStyle: 'none' }]} onPress={pickImage}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            {!data.avatar && <Text style={{ textAlign: 'center', fontSize: 16, opacity: 0.3, fontWeight: 'bold' }}>Upload Image</Text>}


                        </TouchableOpacity>

                    </View>
                    <Text style={{ margin: 20, fontSize: 15 }}>Food Name</Text>
                    <TextInput placeholder='Enter the food type'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleNameChange(val)}
                    />
                    <Text style={{ margin: 20, fontSize: 15 }}>Quantity</Text>
                    <TextInput placeholder='Enter quantity'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleQuantityChange(val)}
                    />
                    <Text style={{ margin: 20, fontSize: 15 }}>Description</Text>
                    <TextInput
                        style={{ textAlignVertical: 'top', borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 100, paddingLeft: 10, borderRadius: 10 }}
                        numberOfLines={5}
                        placeholder="Description"
                        multiline
                        onChangeText={(val) => handleDescriptionChange(val)}
                    />
                    <Text style={{ margin: 20, fontSize: 15 }}>Best before</Text>
                    <TextInput placeholder={text}
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleQuantityChange(val)}
                    />
                    <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                        <Button title='DatePicker' onPress={() => showMode('date')} />
                    </View>
                    <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                        <Button title='TimePicker' onPress={() => showMode('time')} />
                    </View>
                    {show && (<DateTimePicker
                        testID='dateTimePicker'
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display='default'
                        onChange={onChange} />)}

                    <Text style={{ margin: 20, fontSize: 15 }}>Pick up location</Text>

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
                        <View
                            style={{

                                position: 'absolute',//use absolute position to show button on top of the map
                                bottom: '10%', //for center align
                                left: '25%',
                                width: Dimensions.get('window').width * 0.50,
                            }}
                        >
                            <Button title="Locate me" onPress={button1handler} />
                        </View>




                    </View>




                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                            <Text style={styles.buttonText} onPress={() => { }}>Add listing</Text>
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

                </ScrollView>}
            </View>
        )
    }
}

export default AddListing

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        marginTop: 50
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
    buttonContainer: {
        marginTop: 10,
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
    uploadBtn: {
        height: 125,
        width: 125,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',


    },
    image: {
        height: 125,
        width: 125,
        resizeMode: "cover"
    },
    map: {
        height: 400,
        marginVertical: 0,
        width: Dimensions.get('window').width * 0.92
    },

})




// import { StyleSheet, Text, View, TouchableOpacity, ImagePickerIOS } from 'react-native'
// import React from 'react'

// const AddListing = () => {
//     const openImageLibrary = () =>{
//         const {status} = await
//     }
//     return (
//         <View>
//             <View>
//                 <TouchableOpacity style={styles.uploadBtn} onPress={openImageLibrary}>
//                     <Text style={{textAlign: 'center', fontSize: 16, opacity:0.3, fontWeight: 'bold'}}>Upload Image</Text>

//                 </TouchableOpacity>
//                 <Text style={styles.skip}>skip</Text>
//             </View>
//         </View>
//     )
// }

// export default AddListing

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },

//     uploadBtn:{
//         height: 125,
//         width: 125,
//         borderRadius: 125/2,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderStyle: 'dashed',
//         borderWidth: 1,

//     },
//     skip:{
//         textAlign: 'center',
//         padding: 10,
//         fontSize: 16,
//         fontWeight: 'bold',
//         textTransform: 'uppercase',
//         letterSpacing: 2,
//         opacity: 0.3
//     }
// })


// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Platform } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function ImagePickerExample() {
//     const [image, setImage] = useState(null);

//     const pickImage = async () => {
//         // No permissions request is necessary for launching the image library
//         //https://dev.to/joypalumbo/uploading-images-to-cloudinary-in-react-native-using-cloudinary-s-api-37mo
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//             base64: true
//         });

//         console.log(result)
//         if (!result.cancelled) {
//             setImage(result.uri);
//             let base64Img = `data:image/jpg;base64,${result.base64}`;

//             let data = {
//                 "file": base64Img,
//                 "upload_preset": "blko7fqh",
//             }

//             fetch('https://api.cloudinary.com/v1_1/dqt5uhnm0/upload', {
//                 body: JSON.stringify(data),
//                 headers: {
//                     'content-type': 'application/json'
//                 },
//                 method: 'POST',
//             }).then(async r => {
//                 let data = await r.json()
//                 console.log(data)
//             }).catch(err => console.log(err))
//         };

//         // const formData = new FormData()



//         // formData.append("file", base64Img)


//         // formData.append("upload_preset", "blko7fqh")
//         // formData.append("cloud_name", "dqt5uhnm0")



//         // const res = await fetch("https://api.cloudinary.com/v1_1/dqt5uhnm0/upload", {
//         //     method: "POST",
//         //     body: formData
//         // })

//         // const data = await res.json()
//         // console.log(data)



//     };

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Button title="Pick an image from camera roll" onPress={pickImage} />
//             {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//         </View>
//     );
// }