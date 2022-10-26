import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Button, Image, ScrollView, LogBox, SafeAreaView, Alert } from 'react-native'
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
import { BottomSheet } from 'react-native-btr';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

const AddListing = ({ navigation, route }) => {
    const [image, setImage] = useState(null);                                 //Create states to store values
    const [loading, setLoading] = useState(true)
    const [latlng, setLatLng] = useState({})
    const [longitude, setLongitude] = useState(0.00000)
    const isFocused = useIsFocused();
    const [coordinates, setCoordinates] = useState({ latitude: 9.704264, longitude: 80.069339 })
    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [text, setText] = useState('')
    const [timeSelected, setTimeSelected] = useState(false)
    const [dateSelected, setDateSelected] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const { state, dispatch } = useContext(ListingsContext)
    const [visible, setVisible] = useState(false);
    const toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        setVisible(!visible);
    };

    useEffect(() => {
        LogBox.ignoreLogs(['Failed prop type']);                        //avoid unneccessary warnings
    }, [])

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShow(false)
        setDate(currentDate)
        let tempDate = new Date(currentDate);                                                             //Create date using parameter values
        let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds()
        setText(fDate + ' ' + fTime)                        //Set formatted date in text state
        setData({                                          //Set the formatted date in data state
            ...data,
            expires_in: text,
            isValidExpiresIn: true
        })
    }

    const showMode = (currentMode) => {                        //To show pop up date, time picker 
        setShow(true)
        setMode(currentMode)
    }

    const map = useRef(1)
    const [data, setData] = useState({                        //Create data object state to store values given by user
        name: "",
        description: "",
        avatar: "",
        quantity: "",
        longitude: "",
        latitude: "",
        expires_in: null,
        type: route.params.type,
        isValidName: true,
        isValidDescription: true,
        isValidAvatar: true,
        isValidQuantity: true,
        isValidCoordinates: true,
        isValidExpiresIn: true,
    })

    const handleNameChange = (val) => {                                 //function to haldle name field changes 
        if (val === '') {
            setData({
                ...data,
                name: val,
                isValidName: false
            })
        } else {
            setData({
                ...data,
                name: val,
                isValidName: true
            })
        }
    }

    const handleDescriptionChange = (val) => {
        if (val === '') {
            setData({
                ...data,
                description: val,
                isValidDescription: false
            })
        } else {
            setData({
                ...data,
                description: val,
                isValidDescription: true
            })
        }
    }

    const handleImageChange = (val) => {
        if (val === '') {
            setData({
                ...data,
                avatar: val,
                isValidAvatar: false
            })
        } else {
            setData({
                ...data,
                avatar: val,
                isValidAvatar: true
            })
        }
    }

    const handleQuantityChange = (val) => {
        if (val === '') {
            setData({
                ...data,
                quantity: val,
                isValidQuantity: false
            })
        } else {
            setData({
                ...data,
                quantity: val,
                isValidQuantity: true
            })
        }
    }

    const checkPermission = async () => {
        const hasPermission = await Location.requestForegroundPermissionsAsync();
        if (hasPermission.status === 'granted') {                                         //Check app has permission to access location from device
            const permission = await askPermission()
            return permission
        }
        return true
    };

    const askPermission = async () => {
        const permission = await Location.requestForegroundPermissionsAsync()             //Ask permission to access the location
        return permission.status === 'granted';
    }

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;
            const { coords: { latitude, longitude }, } = await Location.getCurrentPositionAsync();        //Get device location and store it in latlng state
            setLatLng({ latitude: latitude, longitude: longitude })
        } catch (err) { }
    }

    useEffect(() => {
        const fetch_data = async () => {
            checkPermission();
            getLocation()
            let userId = await AsyncStorage.getItem('userId')
            let intUserId = parseInt(userId)
            let userMobile = await AsyncStorage.getItem('userMobile')
            setData({
                ...data,
                poster_id: intUserId,
                phone: userMobile
            })
        }
        fetch_data()
        setLoading(false)
    }, [])

    const button1handler = () => {
        checkPermission();
        getLocation()
        setCoordinates(latlng)
        setData({
            ...data,
            latitude: latlng.latitude,
            longitude: latlng.longitude,
            isValidCoordinates: true
        })
    }

    const handlebutton2 = () => {
        setData({
            ...data,
            longitude: latlng.longitude,
            latitude: latlng.latitude
        })

    }

    const handleSubmit = async () => {
        if (route.params.type === 'food') {        //Check the listings type weather it's a food or non-food
            let nameCheck = true;
            let quantityCheck = true;
            let avatarCheck = true;
            let descriptionCheck = true;
            let expires_inCheck = true;
            let coordinateCheck = true;
            if (data.name === "") { nameCheck = false }
            if (data.quantity === "") { quantityCheck = false }
            if (data.avatar === "") { avatarCheck = false }
            if (data.description === "") { descriptionCheck = false }
            if (data.expires_in === "") { expires_inCheck = false }
            if (data.longitude === "" || data.latitude === "") { coordinateCheck = false }
            await setData({
                ...data,
                isValidName: nameCheck,
                isValidAvatar: avatarCheck,
                isValidCoordinates: coordinateCheck,
                isValidQuantity: quantityCheck,
                isValidExpiresIn: expires_inCheck,
                isValidDescription: descriptionCheck
            })

            if (data.isValidName && data.isValidDescription && data.isValidQuantity && data.isValidCoordinates && data.isValidAvatar && data.isValidExpiresIn && dateSelected && timeSelected) {         //Check each field has been filled by user 
                dispatch({ type: "ADD_LISTING", payload: data })                                          //Call reducer funtion to insert values
            }
            else {
                Alert.alert("Invalid input, check again")                                      //Show error message
            }
        } else {
            let nameCheck = true;
            let quantityCheck = true;
            let avatarCheck = true;
            let descriptionCheck = true;
            let coordinateCheck = true;
            if (data.name === "") { nameCheck = false }
            if (data.quantity === "") { quantityCheck = false }
            if (data.avatar === "") { avatarCheck = false }
            if (data.description === "") { descriptionCheck = false }
            if (data.longitude === "" || data.latitude === "") { coordinateCheck = false }

            await setData({
                ...data,
                isValidName: nameCheck,
                isValidAvatar: avatarCheck,
                isValidCoordinates: coordinateCheck,
                isValidQuantity: quantityCheck,
                isValidDescription: descriptionCheck
            })

            if (data.isValidName && data.isValidDescription && data.isValidQuantity && data.isValidCoordinates && data.isValidAvatar) {
                dispatch({ type: "ADD_LISTING", payload: data })
            }
            else {
                Alert.alert("Invalid input, check again")
            }
        }
    }

    const pickImage = async () => {                                                                //Function to get image from gallery 
        // No permissions request is necessary for launching the image library
        setLoading2(true)
        let result = await ImagePicker.launchImageLibraryAsync({                             //Using expo image picker function
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });
        if (!result.cancelled) {
            setImage(result.uri);                                                   //set uri to image state
            let base64Img = `data:image/jpg;base64,${result.base64}`;                //Convert it to base64 encoded format
            let data = { "file": base64Img, "upload_preset": "blko7fqh", }
            fetch('https://api.cloudinary.com/v1_1/dqt5uhnm0/upload', {
                body: JSON.stringify(data), headers: { 'content-type': 'application/json' }, method: 'POST',               //Upload image into cloudinary and get cloudinary url
            }).then(async r => {
                let data = await r.json()
                handleImageChange(data.url)                         //Set image url to data.url
                setLoading2(false)
            }).catch(err => console.log(err))
        };
    }

    const openCamera = async () => {                                              //Function to upload image using camera
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!");
            return;
        }
        setLoading2(true)
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1, base64: true });

        // Explore the result
        if (!result.cancelled) {
            setImage(result.uri);
            let base64Img = `data:image/jpg;base64,${result.base64}`;
            let data = { "file": base64Img, "upload_preset": "blko7fqh", }
            fetch('https://api.cloudinary.com/v1_1/dqt5uhnm0/upload', {                          //upload image into cloudinary
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' },
                method: 'POST',
            }).then(async r => {
                let data = await r.json()
                handleImageChange(data.url)                       //set image url into data.url
                setLoading2(false)
            }).catch(err => console.log(err))
        }
    }

    const timeSelecter = () => {                                  //function to select time
        showMode('time')
        setTimeSelected(true)
    }

    const dateSelecter = () => {                                    //function to select date
        showMode('date')
        setDateSelected(true)
    }

    if (loading) {
        return <ActivityIndicator size='large' style={{ marginTop: 200 }} />;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                {loading && <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />}
                {!loading && <ScrollView style={{ marginBottom: 20 }}>
                    <BottomSheet
                        visible={visible}
                        //setting the visibility state of the bottom shee
                        onBackButtonPress={toggleBottomNavigationView}
                        //Toggling the visibility state on the click of the back botton
                        onBackdropPress={toggleBottomNavigationView}
                    //Toggling the visibility state on the clicking out side of the sheet
                    >
                        {/*Bottom Sheet inner View*/}
                        <View style={styles.bottomNavigationView}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', }}>
                                <Text style={{ textAlign: 'center', padding: 20, fontSize: 20, }}>Select Image using</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <FontAwesome
                                        //Social Icon using react-native-elements
                                        name="picture-o"
                                        size={41}
                                        style={{ paddingRight: 15 }}
                                        //Type of Social Icon
                                        onPress={() => {
                                            //Action to perform on press of Social Icon
                                            toggleBottomNavigationView();
                                            pickImage();
                                        }}
                                    />
                                    <AntDesign
                                        name="camera"
                                        size={50}
                                        onPress={() => {
                                            toggleBottomNavigationView();
                                            openCamera();
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </BottomSheet>
                    <View style={{ flexDirection: 'row', marginTop: 50, marginLeft: 30, marginBottom: 20 }}>
                        <TouchableOpacity style={[styles.uploadBtn, !image ? {
                            borderStyle: 'dashed', borderWidth: 1
                        } : { borderStyle: 'none' }]} onPress={toggleBottomNavigationView}>
                            {!loading2 && image && <Image source={{ uri: image }} style={styles.image} />}
                            {!loading2 && !image && <Text style={{ textAlign: 'center', fontSize: 16, opacity: 0.3, fontWeight: 'bold' }}>Upload Image</Text>}
                            {loading2 && <ActivityIndicator />}
                        </TouchableOpacity>
                    </View>
                    {data.isValidAvatar ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Listing image can't be empty</Text>
                        </Animatable.View>
                    }
                    {route.params.type === 'food' ?
                        <Text style={{ margin: 20, fontSize: 15 }}>Food Name</Text> : <Text style={{ margin: 20, fontSize: 15 }}>Listing Name</Text>}
                    <TextInput placeholder='Enter the food type'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleNameChange(val)} />
                    {data.isValidName ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Name can't be empty</Text>
                        </Animatable.View>
                    }
                    <Text style={{ margin: 20, fontSize: 15 }}>Quantity</Text>
                    <TextInput placeholder='Enter quantity'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleQuantityChange(val)} />
                    {data.isValidQuantity ? null : <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Quantity can't be empty</Text>
                    </Animatable.View>}
                    <Text style={{ margin: 20, fontSize: 15 }}>Description</Text>
                    <TextInput style={{ textAlignVertical: 'top', borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 100, paddingLeft: 10, borderRadius: 10 }}
                        numberOfLines={5}
                        placeholder="Description"
                        multiline
                        onChangeText={(val) => handleDescriptionChange(val)}
                    />
                    {data.isValidDescription ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Description can't be empty</Text>
                        </Animatable.View>
                    }
                    {route.params.type === 'food' ?
                        <>
                            <Text style={{ margin: 20, fontSize: 15 }}>Best before</Text>
                            <TextInput placeholder="21-08-2022 07:50:02" value={(dateSelected && timeSelected) ? text : ''}
                                style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                                onChangeText={(val) => handleQuantityChange(val)
                                } />
                        </> : null}
                    {data.isValidExpiresIn ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Required valid Date and time</Text>
                        </Animatable.View>
                    }
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ margin: 10, height: Dimensions.get('window').height / 15, backgroundColor: '#009387', padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: Dimensions.get('window').width * 0.4, }} onPress={dateSelecter}>
                            <Text style={styles.buttonText}>Date picker</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ margin: 10, height: Dimensions.get('window').height / 15, backgroundColor: '#009387', padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: Dimensions.get('window').width * 0.4, }} onPress={timeSelecter}>
                            <Text style={styles.buttonText}>Time picker</Text>
                        </TouchableOpacity>
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
                            initialRegion={{ longitude: latlng.longitude, latitude: latlng.latitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }}>
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
                        }}>
                            <Button title="Set my location as pickup point" onPress={button1handler} />
                        </View>
                    </View>
                    {data.isValidCoordinates ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Pickup point can't be empty</Text>
                        </Animatable.View>
                    }
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Add listing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}
                            style={[styles.signIn, { borderColor: '#009387', borderWidth: 1, marginTop: 15, width: '90%' }]}>
                            <Text style={[styles.textSign, { color: '#009387' }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>}
            </SafeAreaView>
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
    container: {
        flex: 1,
        margin: 2,
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginLeft: 20
    },

})




