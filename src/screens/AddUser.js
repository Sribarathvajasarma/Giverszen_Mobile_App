import React, { useState } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Dimensions, ScrollView, } from 'react-native';


const AddUser = ({ navigation }) => {
  
  
    return (


        <SafeAreaView style={styles.container}>
            <ScrollView style={{ marginBottom: 20 }}>
                <View style={styles.container}>


                    <Text style={{ margin: 20, fontSize: 15 }}>User Name</Text>
                    <TextInput placeholder='Enter the user name'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}

                    />

                    <Text style={{ margin: 20, fontSize: 15 }}> Phone Number</Text>
                    <TextInput placeholder='Enter the phone number'
                        style={{ borderWidth: 1, borderColor: '#000000', marginHorizontal: 20, height: 60, paddingLeft: 10, borderRadius: 10 }}

                    />
        
                </View>

            </ScrollView>
        </SafeAreaView>

    )
        ;

};

export default AddUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 2,
        marginLeft: 5,
        backgroundColor: '#fff',
    },

});
