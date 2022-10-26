import React, { useEffect, useContext, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    Alert,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        id: '',
        username: '',
        email: '',
        about: '',
        image: '',
        phone: '',



    })

    useEffect(() => {
        const fetch_data = async () => {
            let userAvatar = await AsyncStorage.getItem('userAvatar')
            let userEmail = await AsyncStorage.getItem('userEmail')
            let userId = await AsyncStorage.getItem('userId')
            let userName = await AsyncStorage.getItem('userName')
            setData({ id: userId, username: userName, email: userEmail, image: userAvatar })
            setIsLoading(false)
        }
        fetch_data()


    }, [])

    const handleUserNameChange = (val) => {
        setData({
            ...data,
            username: val
        })
    }

    const handleEmailChange = (val) => {
        setData({
            ...data,
            email: val
        })
    }



    const handleAboutChange = (val) => {
        setData({
            ...data,
            about: val
        })
    }

    const handlePhoneChange = (Val) => {
        setData({
            ...data,
            phone: val
        })
    }

    const handleImageChange = (val) => {
        setData({
            ...data,
            image: val
        })
    }

    const handleSubmit = (val) => {
        console.log(data)
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














    let fall = new Animated.Value(1);

    if (isLoading) {
        return <ActivityIndicator />
    }

    else {
        return (
            <View style={styles.container}>

                <Animated.View
                    style={{
                        margin: 20,
                        opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
                    }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={pickImage}>
                            <View
                                style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <ImageBackground
                                    source={{
                                        uri: data.image
                                    }}
                                    style={{ height: 100, width: 100 }}
                                    imageStyle={{ borderRadius: 15 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <MaterialCommunityIcons
                                            name="camera"
                                            size={35}
                                            color="#fff"
                                            style={{
                                                opacity: 0.7,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                borderRadius: 10,
                                            }}
                                        />
                                    </View>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                            {data.username}
                        </Text>
                        {/* <Text>{user.uid}</Text> */}
                    </View>


                    <View style={styles.action}>
                        <Ionicons name="person-sharp" color="#333333" size={20} />
                        <TextInput
                            multiline
                            numberOfLines={3}
                            placeholder="Username"
                            placeholderTextColor="#666666"

                            onChangeText={() => { }}
                            autoCorrect={true}
                            style={[styles.textInput, { height: 40 }]}
                        />
                    </View>
                    <View style={styles.action}>
                        <Ionicons name="ios-clipboard" color="#333333" size={20} />
                        <TextInput
                            //multiline
                            numberOfLines={3}
                            placeholder="About Me"
                            placeholderTextColor="#666666"

                            onChangeText={() => { }}
                            autoCorrect={true}
                            style={[styles.textInput, { height: 40 }]}
                        />
                    </View>
                    <View style={styles.action}>
                        <Ionicons name="ios-call" color="#333333" size={20} />
                        <TextInput
                            placeholder="Phone"
                            placeholderTextColor="#666666"
                            keyboardType="number-pad"
                            autoCorrect={false}

                            onChangeText={() => { }}
                            style={[styles.textInput, { height: 40 }]}
                        />
                    </View>



                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#333333"
                            size={20}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            onChangeText={() => { }}
                            style={[styles.textInput, { height: 40 }]}
                        />
                    </View>

                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm password"
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            onChangeText={() => { }}
                            style={[styles.textInput, { height: 40 }]}
                        />
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Profile2')}
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
                </Animated.View>
            </View>
        );

    }

};

export default EditProfileScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     commandButton: {
//         padding: 15,
//         borderRadius: 10,
//         backgroundColor: '#FF6347',
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     panel: {
//         padding: 20,
//         backgroundColor: '#FFFFFF',
//         paddingTop: 20,
//         width: '100%',
//     },
//     header: {
//         backgroundColor: '#FFFFFF',
//         shadowColor: '#333333',
//         shadowOffset: { width: -1, height: -3 },
//         shadowRadius: 2,
//         shadowOpacity: 0.4,
//         paddingTop: 20,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//     },
//     panelHeader: {
//         alignItems: 'center',
//     },
//     panelHandle: {
//         width: 40,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#00000040',
//         marginBottom: 10,
//     },
//     panelTitle: {
//         fontSize: 27,
//         height: 35,
//     },
//     panelSubtitle: {
//         fontSize: 14,
//         color: 'gray',
//         height: 30,
//         marginBottom: 10,
//     },
//     panelButton: {
//         padding: 13,
//         borderRadius: 10,
//         backgroundColor: '#2e64e5',
//         alignItems: 'center',
//         marginVertical: 7,
//     },
//     panelButtonTitle: {
//         fontSize: 17,
//         fontWeight: 'bold',
//         color: 'white',
//     },
//     action: {
//         flexDirection: 'row',
//         marginTop: 10,
//         marginBottom: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#f2f2f2',
//         paddingBottom: 5,
//     },
//     actionError: {
//         flexDirection: 'row',
//         marginTop: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#FF0000',
//         paddingBottom: 5,
//     },
//     textInput: {
//         flex: 1,
//         marginTop: Platform.OS === 'ios' ? 0 : -8,
//         paddingLeft: 10,
//         color: '#333333',
//     },
//     button: {
//         alignItems: 'center',
//         marginTop: 20
//     },
//     signIn: {
//         width: '80%',
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 10
//     },
//     textSign: {
//         fontSize: 18,
//         fontWeight: 'bold'
//     },
//     buttonContainer: {
//         marginTop: 10,
//         height: Dimensions.get('window').height / 10,
//         backgroundColor: '#009387',
//         padding: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 10,
//         width: Dimensions.get('window').width * 0.8,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#ffffff',
//     },
//     uploadBtn: {
//         height: 125,
//         width: 125,
//         borderRadius: 10,
//         alignItems: 'center',
//         justifyContent: 'center',


//     },
// });