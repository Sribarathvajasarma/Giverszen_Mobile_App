import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  StatusBar,
  Alert
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
//import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotPassword = ({ navigation }) => {
  const [data, setData] = React.useState({
    email: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidEmail: true,
  //  isValidPassword: true,
  });

  const textInputChange = (val) => {
    if (val.trim().length > 3 || val.trim().length == 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
        isValidEmail: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const handleValidEmail = (val) => {
    if (val.trim().length > 4 || val.trim().length == 4) {
      setData({
        ...data,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        isValidEmail: false,
      });
    }
  };
  const forgotpassword = async(email) => {
    console.log(email);
    await AsyncStorage.setItem('email', email)
    fetch("https://giverszen1.herokuapp.com/user/forgot", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email
       
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if(responseData.code === 0){
          Alert.alert('The email doesnot exist','you try correct email',[
            {text:'okay'}
          ])
         // navigation.navigate('ForgotPassword')
        }
        else{
          Alert.alert('Send the Pin Number' ,'please check your email.',[
            {text:'okay'}
          ])
          navigation.navigate('PinNumber')
        }
       console.log(responseData);
      // navigation.navigate('PinNumber')
      //  console.log(responseData.msg)
      })
      .done();

      
    
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Don't worry we have the solution</Text>
        
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.text_footer}>email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />

          <TextInput
            placeholder="Your email"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidEmail ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Email must be 4 characters long.
            </Text>
          </Animatable.View>
        )}

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              forgotpassword(data.email);
            }}
          >
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={[
                styles.signIn,
                {
                  marginTop: 35,
                },
              ]}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                  },
                ]}
              >
                {" "}
                Submit
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => navigation.navigate("PinNumber")}
            style={[
              styles.signIn,
              {
                borderColor: "#009387",
                borderWidth: 1,
                marginTop: 35,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: "#009387",
                },
              ]}
            >
              {" "}
              Go to Next Page
            </Text>
          </TouchableOpacity> */}
        </View>
      </Animatable.View>
    </View>
  );
};

export default ForgotPassword;

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
