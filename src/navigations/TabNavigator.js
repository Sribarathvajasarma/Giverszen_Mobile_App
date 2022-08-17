import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Homen from '../screens/Homen';
import Mapn from '../screens/Mapn';
import Goals from '../screens/Goals';
import Forum from '../screens/Forum';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddListing from '../screens/AddListing';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddFeed from '../screens/AddFeed';
import Pending from '../screens/Pending';
import FoodListings from '../screens/FoodListings';
import NonFoodListings from '../screens/NonFoodListings';
import ViewListings from '../screens/ViewListings';
import Maps from '../screens/Maps'
const Stack = createNativeStackNavigator();
export const AddListingStack = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={AddListing} name="Add" />


        </Stack.Navigator>
    )
}
export const HomenStack = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Homen} name="Home" />
            <Stack.Screen component={AddListingStack} name="AddListing" options={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerTitle: "Add New Listing",

                headerStyle: {
                    backgroundColor: '#009387'
                }
            }} />
            <Stack.Screen component={FoodListings} name="FoodListings" options={{
                title: 'Food Listings',
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",

                headerStyle: {
                    backgroundColor: '#009387'
                }
            }} />
            <Stack.Screen component={NonFoodListings} name="NonFoodListings" options={{
                title: 'Non-Food Listings',
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",

                headerStyle: {
                    backgroundColor: '#009387'
                }
            }} />

            <Stack.Screen component={ViewListings} name="ViewListings" options={({ route }) => ({
                headerShown: true,
                title: '',
                headerBackTitleVisible: false,
                headerTransparent: true,
                headerTintColor: '#fff'
            })} />





        </Stack.Navigator>
    )
}


export const PendingStack = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Pending} name="Pending2"
                options={{
                    title: 'Confirmed',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",

                    headerStyle: {
                        backgroundColor: '#009387'
                    }
                }}
            />
            <Stack.Screen component={Maps} name="Maps"
                options={{
                    title: 'Route to Pickup',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",

                    headerStyle: {
                        backgroundColor: '#009387'
                    }
                }} />


        </Stack.Navigator>
    )
}

export const ForumStack = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Forum} name="Forum" options={{
                headerShown: true,
                title: 'Forum',
                headerTitleAlign: 'center',
                headerTintColor: "#fff",

                headerStyle: {
                    backgroundColor: '#009387'
                }
            }} />
            <Stack.Screen component={AddFeed} name="AddFeed" />


        </Stack.Navigator>
    )
}




const Tab = createBottomTabNavigator()
const TabNavigator = () => {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: '#009387'
            },

            tabBarInactiveTintColor: '#fff',
            tabBarActiveTintColor: '#F3F02B'

        }}>
            <Tab.Screen name="Home2" component={HomenStack} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home-outline" color={color} size={size} />
                )
            }} />
            <Tab.Screen name="Map" component={Mapn} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="map-outline" color={color} size={size} />
                )
            }} />
            <Tab.Screen name="Pending" component={PendingStack} options={{
                tabBarIcon: ({ color, size }) => (
                    <AntDesign name="clockcircle" color={color} size={size} />
                ),

            }} />
            <Tab.Screen name="ForumStack" component={ForumStack} options={{
                tabBarIcon: ({ color, size }) => (
                    <Entypo name="publish" color={color} size={size} />
                ),

            }} />


        </Tab.Navigator>
    )
}

export default TabNavigator