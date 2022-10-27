import { StyleSheet, Text, View, Platform, StatusBar, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext';

import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { AuthContext } from '../components/context';
import { ScrollView } from 'react-native';

const SignUp = ({ navigation }) => {
    const { dispatch, lang_state } = useContext(LanguageContext)                  //Get current language using context api
    const [data, setData] = useState({                                           //Create data object state to store values given by user
        email: '',
        password: '',
        confirm_password: '',
        username: '',
        check_textInputChange: false,
        check_textInputChange2: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidEmail: true,
        isValidUsername: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    })

    const { signUp } = React.useContext(AuthContext)                 //Get signUp function from api

    const textInputChange = (val) => {                                //Function to handle input changes
        if (val.length >= 4) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUsername: true
            })
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUsername: false
            })
        }
    }

    const validateEmail = (email) => {                              //Function to validate email
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    const textInputChange2 = (val) => {
        if (validateEmail(val)) {
            setData({
                ...data,
                email: val,
                check_textInputChange2: true,
                isValidEmail: true
            })
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange2: false,
                isValidEmail: false
            })
        }
    }
    const handlePasswordChange = (val) => {
        if (val.length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            })
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            })
        }
    }

    const handleConfirmPasswordChange = (val) => {
        if (val === data.password) {
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword: true
            })
        } else {
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword: false
            })
        }
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

    const handleValidEmail = (val) => {
        if (validateEmail(val)) {
            setData({
                ...data,
                isValidEmail: true
            })
        } else {
            setData({
                ...data,
                isValidEmail: false
            })
        }
    }

    const signUpHandle = (username, email, password) => {
        fetch("https://giverzenbackend.herokuapp.com/api/register", {                  //Post data into api to register user
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username,
                longitude: '0.00000',
                latitude: '0.00000',
            })
        }).then((response) => response.json())
            .then(async (responseData) => {
                if (responseData.msg === 'Register Success') {
                    signUp(responseData)                           //Call signUp function
                }
                else {
                    Alert.alert(responseData.msg)                 //Show error message
                }
            }).done();
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <Animatable.View animation="fadeInLeft">
                <View style={styles.header}>
                    {lang_state.language === 'T' ? <Text style={styles.text_header}>இப்போது பதிவு செய்யவும்</Text> : (lang_state.language === 'S' ? <Text style={styles.text_header}>දැන්ම ලියාපදිංචි වන්න</Text> : <Text style={styles.text_header}>Register Now</Text>)}
                </View></Animatable.View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}>
                <ScrollView>
                    {lang_state.language === 'T' ? <Text style={styles.text_footer}>பயனர் பெயர்</Text> : (lang_state.language === 'S' ? <Text style={styles.text_footer}>පරිශීලක නාමය</Text> : <Text style={styles.text_footer}>Username</Text>)}
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20} />
                        <TextInput
                            placeholder={lang_state.language === 'T' ? "உங்கள் பயனர் பெயர்" : (lang_state.language === 'S' ? "ඔබේ පරිශීලක නාමය" : "Your username")}
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
                    {data.isValidUsername ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            {lang_state.language === 'T' ? <Text style={styles.errorMsg}>பயனர் பெயர் குறைந்தது 4 எழுத்துகள் நீளமாக இருக்க வேண்டும்.</Text> : (lang_state.language === 'S' ? <Text style={styles.errorMsg}>පරිශීලක නාමය අවම වශයෙන් අක්ෂර 4 ක් දිග විය යුතුය.</Text> : <Text style={styles.errorMsg}>Username must be atleast 4 characters long.</Text>)}
                        </Animatable.View>}
                    {lang_state.language === 'T' ? <Text style={[styles.text_footer, { marginTop: 25 }]}>மின்னஞ்சல்</Text> : (lang_state.language === 'S' ? <Text style={[styles.text_footer, { marginTop: 25 }]}>විද්යුත් තැපෑල</Text> : <Text style={[styles.text_footer, { marginTop: 25 }]}>Email</Text>)}
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20} />
                        <TextInput
                            placeholder={lang_state.language === 'T' ? "உங்கள் மின்னஞ்சல்" : (lang_state.language === 'S' ? "ඔබේ විද්යුත් තැපැල් ලිපිනය" : "Your Email")}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange2(val)}
                            onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)} />
                        {data.check_textInputChange2 ?
                            <Animatable.View
                                animation="bounceIn">
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20} />
                            </Animatable.View> : null}
                    </View>
                    {data.isValidEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            {lang_state.language === 'T' ? <Text style={styles.errorMsg}>மின்னஞ்சல் வடிவம் தவறானது</Text> : (lang_state.language === 'S' ? <Text style={styles.errorMsg}>ඊමේල් ආකෘතිය වලංගු නොවේ</Text> : <Text style={styles.errorMsg}>Email format is not valid</Text>)}
                        </Animatable.View>}
                    {lang_state.language === 'T' ? <Text style={[styles.text_footer, { marginTop: 25 }]}>கடவுச்சொல்</Text> : (lang_state.language === 'S' ? <Text style={[styles.text_footer, { marginTop: 25 }]}>මුරපදය</Text> : <Text style={[styles.text_footer, { marginTop: 25 }]}>Password</Text>)}
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20} />
                        <TextInput
                            placeholder={lang_state.language === 'T' ? "உங்கள் கடவுச்சொல்" : (lang_state.language === 'S' ? "ඔබගේ මුරපදය" : "Your Password")}
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)} />
                        <TouchableOpacity onPress={updateSecureTextEntry}>
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20} /> :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20} />}
                        </TouchableOpacity>
                    </View>
                    {data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            {lang_state.language === 'T' ? <Text style={styles.errorMsg}>கடவுச்சொல் குறைந்தது 6 எழுத்துகள் நீளமாக இருக்க வேண்டும்</Text> : (lang_state.language === 'S' ? <Text style={styles.errorMsg}>මුරපදය අවම වශයෙන් අක්ෂර 6 ක් දිග විය යුතුය.</Text> : <Text style={styles.errorMsg}>Password must be atleast 6 characters long.</Text>)}
                        </Animatable.View>}
                    {lang_state.language === 'T' ? <Text style={[styles.text_footer, { marginTop: 25 }]}>கடவுச்சொல்லை உறுதிப்படுத்தவும்</Text> : (lang_state.language === 'S' ? <Text style={[styles.text_footer, { marginTop: 25 }]}>මුරපදය තහවුරු කරන්න</Text> : <Text style={[styles.text_footer, { marginTop: 25 }]}>Confirm Password</Text>)}
                    <View style={styles.action}>
                        <FontAwesome
                            name="lock"
                            color="#05375a"
                            size={20} />
                        <TextInput
                            placeholder={lang_state.language === 'T' ? "கடவுச்சொல்லை உறுதிப்படுத்தவும்" : (lang_state.language === 'S' ? "මුරපදය තහවුරු කරන්න" : "Confirm your password")}
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)} />
                        <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                            {data.confirm_secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20} /> :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20} />}
                        </TouchableOpacity>
                    </View>
                    {data.isValidConfirmPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            {lang_state.language === 'T' ? <Text style={styles.errorMsg}>கடவுச்சொற்கள் பொருந்தவில்லை</Text> : (lang_state.language === 'S' ? <Text style={styles.errorMsg}>මුරපද නොගැලපේ</Text> : <Text style={styles.errorMsg}>Passwords not matching</Text>)}
                        </Animatable.View>}
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => { signUpHandle(data.username, data.email, data.password) }}>
                            {lang_state.language === 'T' ? <Text style={styles.buttonText}>பதிவு செய்க</Text> : lang_state.language === 'S' ? <Text style={styles.buttonText}>ලියාපදිංචි වන්න</Text> : <Text style={styles.buttonText}>SignUp</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}>
                            {lang_state.language === 'T' ? <Text style={[styles.textSign, { color: '#009387' }]}>உள்நுழைக</Text> : (lang_state.language === 'S' ? <Text style={[styles.textSign, { color: '#009387' }]}>ඇතුල් වන්න</Text> : <Text style={[styles.textSign, { color: '#009387' }]}>Sign In</Text>)}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </KeyboardAvoidingView>
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
})