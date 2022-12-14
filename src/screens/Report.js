import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Report = ({ navigation }) => {
    const [visible, setVisible] = useState(false);                       //Create states to store values
    const [isChecked, setChecked] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [username, setUsername] = useState('');                       //To Get username by async storage first set the state
    const toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        setVisible(!visible);
    };
    const map = useRef(1)
    const [data, setData] = useState({                                 //Create data object state to store values given by user
        username: '',
        complaint: '',
        reportedto: '',
    })

    const handleNameChange = (val) => {                                 //Function to handle value changes in name field 
        setData({
            ...data,
            reportedto: val,

        })
    }

    const handleComplaintChange = (val) => {
        setData({
            ...data,
            complaint: val,
        })
    }

    useEffect(() => {
        const fetch_data = async () => {
            let userName = await AsyncStorage.getItem('userName')                //Get current user's username from async storage
            setUsername(userName)                                               //Set that value in username state
        }
        fetch_data()
    }, [])

    const handlesubmit3 = () => {
        var date = new Date().getDate()
        var month = new Date().getMonth()
        var year = new Date().getFullYear()
        var posted_date = date + '/' + month + '/' + year                          //Get current date and format

        fetch("https://giverzenbackend.herokuapp.com/api/complaints2", {             //Post reporting details to rest api
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                reportedto: data.reportedto,
                complaint: data.complaint,
                date: posted_date
            })
        }).then((response) => response.json())
            .then(async (responseData) => {
                if (responseData) {
                    Alert.alert('Complaint added successfully')                     //Show successfull message
                }
            }).done();
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginBottom: 20 }}>
                <View style={styles.container}>
                    <Text style={{ margin: 20, fontSize: 15 }}>Report User</Text>
                    <TextInput placeholder='Enter the user name that you want to report'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleNameChange(val)} />
                    <Text style={{ margin: 20, fontSize: 15 }}> Complaint</Text>
                    <TextInput placeholder='Enter the complaint'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}
                        onChangeText={(val) => handleComplaintChange(val)} />
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={handlesubmit3}>
                            <Text style={styles.buttonText}>Add Complaint</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}
                            style={[styles.signIn, { borderColor: '#009387', borderWidth: 1, marginTop: 15, width: '90%' }]}>
                            <Text style={[styles.textSign, { color: '#009387' }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
};

export default Report;

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