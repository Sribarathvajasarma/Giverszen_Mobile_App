import { StyleSheet, Text, View, Platform, StatusBar, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'


import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { AuthContext } from '../components/context';
import { ScrollView } from 'react-native';

const SignUp = ({ navigation }) => {



    const [data, setData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        username: '',
        check_textInputChange: false,
        check_textInputChange2: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true
    })

    const { signUp } = React.useContext(AuthContext)



    const textInputChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            })
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            })
        }
    }

    const textInputChange2 = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                email: val,
                check_textInputChange2: true
            })
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange2: false
            })
        }
    }
    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        })
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        })
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        })
    }


    const signUpHandle = (username, email, password) => {
        if (password === data.confirm_password) {
            signUp(username, email, password)
        }
        else {
            console.log('password did not match')
        }





    }
    return (

        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <Animatable.View
                animation="fadeInLeft"
            >
                <View style={styles.header}>
                    <Text style={styles.text_header}>Register Now</Text>
                </View></Animatable.View>

            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}>
                <ScrollView>
                    <Text style={styles.text_footer}>Username</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Username"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)} />
                        {data.check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn">
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20} />


                            </Animatable.View>
                            : null}



                    </View>
                    <Text style={[styles.text_footer, { marginTop: 25 }]}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange2(val)} />
                        {data.check_textInputChange2 ?
                            <Animatable.View
                                animation="bounceIn">
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20} />


                            </Animatable.View>
                            : null}



                    </View>
                    <Text style={[styles.text_footer, { marginTop: 25 }]}>Password</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)} />
                        <TouchableOpacity onPress={updateSecureTextEntry}>
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                /> :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20} />}

                        </TouchableOpacity>




                    </View>
                    <Text style={[styles.text_footer, { marginTop: 25 }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm your password"
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)} />
                        <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                            {data.confirm_secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                /> :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20} />}

                        </TouchableOpacity>




                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => { signUpHandle(data.username, data.email, data.password) }}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>

        </View>

    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        paddingTop: 20,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    footer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        height: Dimensions.get('window').height * 0.8,
        margin: 20
    },


    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
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
        height: 60,
        backgroundColor: '#009387',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    // container: {
    //     flex: 1,
    //     backgroundColor: '#009387'
    // },
    // header: {
    //     flex: 1,
    //     justifyContent: 'flex-end',
    //     paddingHorizontal: 20,
    //     paddingBottom: 20
    // },
    // footer: {
    //     flex: 6,
    //     backgroundColor: '#fff',
    //     borderTopLeftRadius: 30,
    //     borderTopRightRadius: 30,
    //     paddingHorizontal: 20,
    //     paddingVertical: 30
    // },
    // text_header: {
    //     color: '#fff',
    //     fontWeight: 'bold',
    //     fontSize: 30
    // },
    // text_footer: {
    //     color: '#05375a',
    //     fontSize: 18
    // },
    // action: {
    //     flexDirection: 'row',
    //     marginTop: 10,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#f2f2f2',
    //     paddingBottom: 5
    // },
    // actionError: {
    //     flexDirection: 'row',
    //     marginTop: 10,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#FF0000',
    //     paddingBottom: 5
    // },
    // textInput: {
    //     flex: 1,
    //     marginTop: Platform.OS === 'ios' ? 0 : -12,
    //     paddingLeft: 10,
    //     color: '#05375a',
    // },
    // errorMsg: {
    //     color: '#FF0000',
    //     fontSize: 14,
    // },
    // button: {
    //     alignItems: 'center',
    //     marginTop: 50
    // },
    // signIn: {
    //     width: '100%',
    //     height: 50,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 10
    // },
    // textSign: {
    //     fontSize: 18,
    //     fontWeight: 'bold'
    // },
    // buttonContainer: {

    //     width: '100%',
    //     height: Dimensions.get('window').height / 10,
    //     backgroundColor: '#009387',
    //     padding: 10,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderRadius: 10,
    //     width: Dimensions.get('window').width * 0.9,
    // },
    // buttonText: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: '#ffffff',
    // },
})