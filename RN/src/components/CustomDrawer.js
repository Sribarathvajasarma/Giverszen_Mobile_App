import { StyleSheet, Text, View, Image, Share } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { ImageBackground } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AuthContext } from './context'

const CustomDrawer = (props) => {
    const { signOut } = React.useContext(AuthContext)
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#009387' }}>
                <ImageBackground source={require('../../assets/green_back.jpg')} style={{ padding: 20 }}>
                    <Image source={{ uri: 'https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651322378/avatar/ptc4fshdcc9xnbjzsqxu.jpg' }} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
                    />
                    <Text style={{ color: '#fff', fontSize: 18 }}>Barath</Text>
                    <Text style={{ color: '#fff' }}>200 Points</Text>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />

                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#009387' }}>
                <TouchableOpacity style={{ paddingVertical: 15 }} onPress={onShare}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="share-social-outline" size={22} />
                        <Text style={{ fontSize: 15, marginLeft: 5 }}>Invite Friends</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { signOut() }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit-outline" size={22} />
                        <Text style={{ fontSize: 15, marginLeft: 5 }}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer

