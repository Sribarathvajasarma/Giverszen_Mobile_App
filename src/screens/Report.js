import React, { useState } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Dimensions, ScrollView,Image } from 'react-native';
//import Checkbox from 'expo-checkbox';
//import DropDownPicker from 'react-native-dropdown-picker';





const Report = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);
    //const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const toggleBottomNavigationView = () => {
        //Toggling the visibility state of the bottom sheet
        setVisible(!visible);


    };


    
    return (


        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginBottom: 20 }}>
                <View style={styles.container}>

                {/* <Image source={require('../../assets/REP.png')}/> */}
    
                    <Text style={{ margin: 20, fontSize: 15 }}>User Name</Text>
                    <TextInput placeholder='Enter the user name that you want to report'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}

                    />

                    <Text style={{ margin: 20, fontSize: 15 }}> Complaint</Text>
                    <TextInput placeholder='Enter the complaint'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}

                    />
                 

                   

                  
                    <Text style={{ margin: 20, fontSize: 15 }}>
                        {/* <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />  */}
                         I accept that the complaint placed here is true</Text>

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
