import { StyleSheet, Text, View, Platform, StatusBar, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { AuthContext } from '../components/context';

const Login = ({ navigation }) => {
    const { dispatch, lang_state } = useContext(LanguageContext)         //Get current language using context api
    const [data, setData] = useState({                                     //Create data object state to store values
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidPassword: true,
        isValidUsername: true
    })
    const { signIn } = React.useContext(AuthContext)                  //Get signIn function from auth context

    const validateEmail = (email) => {                                //function to validate email
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    const textInputChange = (val) => {                                 //function to handle input changes
        if (validateEmail(val)) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true,
                isValidUsername: true
            })
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false,
                isValidUsername: false
            })
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
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

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUsername: true
            })
        } else {
            setData({
                ...data,
                isValidUsername: false
            })
        }
    }

    const loginHandle = (email, password) => {
        fetch("https://giverzenbackend.herokuapp.com/api/login", {                //post values into api
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }).then((response) => response.json())
            .then(async (responseData) => {
                if (responseData.msg === 'Login Success') {
                    signIn(responseData)                                     //Call signIn function
                } else {
                    Alert.alert("Invalid Authentication, Try again")          //Show error message
                }
            })
            .done();
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <Animatable.View
                animation="fadeInLeft">
                <View style={styles.header}>
                    {lang_state.language === 'T' ? <Text style={styles.text_header}>உள்நுழைக</Text> : (lang_state.language === 'S' ? <Text style={styles.text_header}>ඇතුල් වන්න</Text> : <Text style={styles.text_header}>Login Now</Text>)}
                </View></Animatable.View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}>
                {lang_state.language === 'T' ? <Text style={styles.text_footer}>மின்னஞ்சல்</Text> : (lang_state.language === 'S' ? <Text style={styles.text_footer}>විද්යුත් තැපෑල</Text> : <Text style={styles.text_footer}>Email</Text>)}
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color="#05375a"
                        size={20} />
                    <TextInput
                        placeholder={lang_state.language === 'T' ? "உங்கள் மின்னஞ்சல்" : (lang_state.language === 'S' ? "ඔබේ විද්යුත් තැපැල් ලිපිනය" : "Your Email")}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)} />
                    {data.check_textInputChange ?
                        <Animatable.View
                            animation="bounceIn">
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20} />
                        </Animatable.View> : null}
                </View>
                {data.isValidUsername ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        {lang_state.language === 'T' ? <Text style={styles.errorMsg}>மின்னஞ்சல் வடிவம் தவறானது</Text> : (lang_state.language === 'S' ? <Text style={styles.errorMsg}>ඊමේල් ආකෘතිය වලංගු නොවේ</Text> : <Text style={styles.errorMsg}>Email format is not valid</Text>)}
                    </Animatable.View>}
                {lang_state.language === 'T' ? <Text style={[styles.text_footer, { marginTop: 35 }]}>கடவுச்சொல்</Text> : (lang_state.language === 'S' ? <Text style={[styles.text_footer, { marginTop: 35 }]}>මුරපදය</Text> : <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>)}
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
                    </Animatable.View>
                }
                <View>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={{ color: '#009387', marginTop: 15 }} > Forgot password</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => { loginHandle(data.email, data.password) }}>
                        {lang_state.language === 'T' ? <Text style={styles.buttonText}>உள்நுழைக</Text> : (lang_state.language === 'S' ? <Text style={styles.buttonText}>ඇතුල් වන්න</Text> : <Text style={styles.buttonText}>SignIn</Text>)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}
                        style={[styles.signIn, { borderColor: '#009387', borderWidth: 1, marginTop: 15 }]}>
                        {lang_state.language === 'T' ? <Text style={[styles.textSign, {
                            color: '#009387'
                        }]}>பதிவு செய்ய</Text> : (lang_state.language === 'S' ? <Text style={[styles.textSign, {
                            color: '#009387'
                        }]}>ලියාපදිංචි වන්න</Text> : <Text style={[styles.textSign, {
                            color: '#009387'
                        }]}>Sign up</Text>)}
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
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
        height: Dimensions.get('window').height * 0.6,
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