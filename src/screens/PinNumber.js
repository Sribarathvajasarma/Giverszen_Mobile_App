import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const PinNumber = ({ navigation }) => {
  const [data, setData] = React.useState({
    //Create data object state to store values
    pinNumber: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidPin: true,
  });

  const textInputChange = (val) => {
    //Function to handle input field value changes
    if (val.trim().length > 3 || val.trim().length == 0) {
      setData({
        ...data,
        pinNumber: val,
        check_textInputChange: true,
        isValidPin: true,
      });
    } else {
      setData({
        ...data,
        pinNumber: val,
        check_textInputChange: false,
        isValidPin: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidPin = (val) => {
    //Function to validate pin number
    if (val.trim().length > 4 || val.trim().length == 4) {
      setData({
        ...data,
        isValidPin: true,
      });
    } else {
      setData({
        ...data,
        isValidPin: false,
      });
    }
  };

  const showAlert = (responseData) => {
    Alert.alert("Now you can ......", responseData);
  };

  const buttonHandle = (pinNumber) => {
    fetch("https://giverzenbackend.herokuapp.com/api/confirmPinNumber", {
      //Post pin number given by user to api
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pinNumber: pinNumber,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.code === 0) {
          Alert.alert("The Pin Number is doesnot Match", "try next time", [
            { text: "okay" }, //Show unsuccessfull message
          ]);
        } else if (responseData.code === 2) {
          Alert.alert("The Pin Number is empty", "Put the Pin Number", [
            //Show unsuccessfull message
            { text: "okay" },
          ]);
        } else {
          Alert.alert("pin number is match Now", "you can reset You Password", [
            //Show successfull message
            { text: "okay" },
          ]);
          navigation.navigate("ResetPasswordScreen"); //navigate to ResetPasswordScreen screen
        }
      })
      .done();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome !</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.text_footer}>PinNumber</Text>
        <View style={styles.action}>
          <FontAwesome name="angle-right" color="#05375a" size={20} />
          <TextInput
            placeholder="Your PinNumber"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            onEndEditing={(e) => handleValidPin(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidPin ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              PinNumber great than 4 Number Digit.
            </Text>
          </Animatable.View>
        )}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              buttonHandle(data.pinNumber);
            }}
          >
            <LinearGradient
              colors={["#08d4c4", "#01ab9d"]}
              style={[styles.signIn, { marginTop: 35 }]}
            >
              <Text style={[styles.textSign, { color: "#fff" }]}> Submit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default PinNumber;

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
