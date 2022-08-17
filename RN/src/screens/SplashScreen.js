import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const SplashScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1660664113/GNL_wpqcae.png" }} style={styles.logo} resizeMode='stretch' />

      </View>

      <Animatable.View
        style={styles.footer}
        animation="fadeInUpBig">
        <Text style={styles.title}>Share your extra with Giverzen!</Text>
        <Text style={styles.text}>Login now to show your impact</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login Now</Text>
            <MaterialIcons
              name="navigate-next"
              color="#fff"
              size={20} />
          </TouchableOpacity>
        </View>

      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#009387'
  // },
  // header: {
  //   flex: 2,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // footer: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   paddingVertical: 50,
  //   paddingHorizontal: 30
  // },
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
    height: Dimensions.get('window').height * 0.4,
    margin: 20
  },
  logo: {
    width: height_logo,
    height: height_logo
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold'
  },
  text: {
    color: 'grey',
    marginTop: 5
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: 50,
    backgroundColor: '#009387',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: Dimensions.get('window').width * 0.4,
    flexDirection: 'row'

  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  textSign: {
    color: 'white',
    fontWeight: 'bold'
  }
});