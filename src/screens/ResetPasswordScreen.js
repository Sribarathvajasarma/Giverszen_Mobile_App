import React from "react";
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet, TextInput, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResetPasswordScreen = ({ navigation }) => {
    const [data, setData] = React.useState({                 //Create data object state to store values given by user
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const handleValidPass = (val) => {                           //Function to validate password
        if (val.trim().length > 7) {
            setData({
                ...data,
                isValidPass: true,
            });
        } else {
            setData({
                ...data,
                isValidPass: false,
            });
        }
    };

    const handleCfValidPass = (val) => {                       //Function to validate confirm password
        if (val.trim().length > 7) {
            setData({
                ...data,
                isValidCfPass: true
            });
        } else {
            setData({
                ...data,
                isValidCfPass: false
            });
        }
    };

    const handlePasswordChange = (val) => {                            //Function to handle password change
        if (val.trim().length > 7) {
            setData({
                ...data,
                password: val,
                isValidPass: true,
            })
        } else {
            setData({
                ...data,
                password: val,
                isValidPass: false,
            })
        }
    }

    const handleConfirmPasswordChange = (val) => {
        if (val.trim().length > 7) {
            setData({
                ...data,
                confirm_password: val,
                isValidCfPass: true
            })
        } else {
            setData({
                ...data,
                confirm_password: val,
                isValidCfPass: false
            })
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry,
        });
    };

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry,
        });
    };

    const ResetPassword = async (password) => {
        const email = await AsyncStorage.getItem('email', email)
        if (password === data.confirm_password) {
            fetch("https://giverzenbackend.herokuapp.com/api/reset", {                //Reset password using rest api
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            }).then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code === 1) {
                        Alert.alert('Password Suceesfully Changed', 'Now you Can Login the Giverszen', [{ text: 'okay' }])  //Show successfull message
                        navigation.navigate('Login')
                    } else { console.log(responseData); }                            //Show error message
                }).done();
        } else {
            Alert.alert('password did not match', 'give the correct password', [{ text: 'okay' }])            //Show error message
            console.log('password did not match')
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#009387" barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Reset Your Password Now!</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.text_footer}>
                    Password
                </Text>
                <View style={styles.action}>
                    <FontAwesome name="lock" color="#05375a" size={20} />
                    <TextInput
                        placeholder="Your Password"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                        onEndEditing={(e) => handleValidPass(e.nativeEvent.text)} />
                    <TouchableOpacity onPress={updateSecureTextEntry}>
                        {data.secureTextEntry ? (
                            <Feather name="eye-off" color="green" size={20} />
                        ) : (
                            <Feather name="eye" color="green" size={20} />
                        )}
                    </TouchableOpacity>
                </View>
                {
                    data.isValidPass ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Password great than 8 Digit and Character.</Text>
                        </Animatable.View>
                }
                <Text style={[styles.text_footer, { marginTop: 20, },]}>{" "}Confirm Password</Text>
                <View style={styles.action}>
                    <FontAwesome name="lock" color="#05375a" size={20} />
                    <TextInput
                        placeholder=" Confirm Your Password"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => handleConfirmPasswordChange(val)}
                        onEndEditing={(e) => handleCfValidPass(e.nativeEvent.text)}
                    />
                    <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                        {data.secureTextEntry ? (<Feather name="eye-off" color="green" size={20} />) : (<Feather name="eye" color="green" size={20} />)}
                    </TouchableOpacity>
                </View>
                {
                    data.isValidCfPass ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Password great than 8 Digit and Character.</Text>
                        </Animatable.View>
                }
                <View>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { ResetPassword(data.password) }}>
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={[styles.signIn, { marginTop: 70 }]}>
                            <Text style={[styles.textSign, { color: '#fff' }]}> Reset Password</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#009387",
    },
    header: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    footer: {
        flex: 3,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 30,
    },
    text_footer: {
        color: "#05375a",
        fontSize: 18,
    },
    action: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#FF0000",
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        paddingLeft: 10,
        color: "#05375a",
    },
    errorMsg: {
        color: "#FF0000",
        fontSize: 14,
    },
    button: {
        alignItems: "center",
        marginTop: 50,
    },
    signIn: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
