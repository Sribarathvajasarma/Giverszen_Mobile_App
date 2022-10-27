import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, ScrollView, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Addforum({ navigation }) {
    const [image, setImage] = useState(null);                                             //Create a state to store image url
    const [data, setData] = useState({ category: "", description: "", image: "" })         //Create and object state to store post values

    const pickImage = async () => {                                         //Function to get image from gallery
        let result = await ImagePicker.launchImageLibraryAsync({           //Using expo image picker function
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if (!result.cancelled) {
            setImage(result.uri);                                        //set uri to image state
            let base64Img = `data:image/jpg;base64,${result.base64}`;         //Convert it to base64 encoded format
            let data = {
                "file": base64Img,
                "upload_preset": "blko7fqh",
            }

            fetch('https://api.cloudinary.com/v1_1/dqt5uhnm0/upload', {             //Upload image into cloudinary and get cloudinary url
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            }).then(async r => {
                let data = await r.json()
                handleImageChange(data.url)                        //Set image url to data.url
            }).catch(err => console.log(err))
        };
    }

    const handleImageChange = (val) => {                            //Function to handle image changes
        setData({
            ...data,
            image: val
        })
    }

    const handleDescriptionChange = (val) => {
        setData({
            ...data,
            description: val
        })
    }

    const handleCategoryChange = (val) => {
        setData({
            ...data,
            category: val
        })
    }

    const handleSubmit = async () => {
        let userId = await AsyncStorage.getItem('userId')                //Get current userId from async storage 
        let userAvatar = await AsyncStorage.getItem('userAvatar')
        fetch("https://giverzenbackend.herokuapp.com/api/posts", {                     //Post values to api with method POST
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: data.category,
                Description: data.description,
                postImage: data.image,
                userID: userId,
            })
        }).then((response) => response.json())
            .then(async (responseData) => {
                console.log(responseData)
                if (responseData.code === 1) {
                    Alert.alert('Forum added succesfully')                           //Display response
                } else {
                    Alert.alert('Sorry unable to add Forum, Please try again')
                }
            })
            .done();
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginBottom: 20 }}>
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 50, marginLeft: 30, marginBottom: 20 }}>
                        <TouchableOpacity style={[styles.uploadBtn, !image ? {
                            borderStyle: 'dashed', borderWidth: 1
                        } : { borderStyle: 'none' }]} onPress={pickImage}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            {!data.avatar && <Text style={{ textAlign: 'center', fontSize: 16, opacity: 0.3, fontWeight: 'bold' }}>Upload Image</Text>}
                        </TouchableOpacity>
                    </View>
                    <Text style={{ margin: 20, fontSize: 15 }}>Category</Text>
                    <TextInput placeholder='Enter the food type'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }} onChangeText={(val) => handleCategoryChange(val)} />
                    <Text style={{ margin: 20, fontSize: 15 }}>Description</Text>
                    <TextInput style={{ textAlignVertical: 'top', borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 100, paddingLeft: 10, borderRadius: 10 }}
                        numberOfLines={5}
                        placeholder="Description"
                        multiline
                        onChangeText={(val) => handleDescriptionChange(val)} />
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Add Forum</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.pop()}
                            style={[styles.signIn, { borderColor: '#009387', borderWidth: 1, marginTop: 15, width: '90%' }]}>
                            <Text style={[styles.textSign, { color: '#009387' }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Addforum

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
