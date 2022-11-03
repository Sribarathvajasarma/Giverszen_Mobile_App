
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import Settings from '../screens/Settings';
import CustomDrawer from '../components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import TabNavigator from './TabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../screens/EditProfile';
import Chat from '../screens/Chat';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import Goals from '../screens/Goals';
import Report from '../screens/Report';
import ViewOwnLisitngs from '../screens/ViewOwnListings';
import RequesterScreen from '../screens/RequesterScreen';
import { LanguageContext } from '../contexts/LanguageContext';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Delivery from '../screens/Delivery';
import AddUser from '../screens/AddUser';
import DriverRoute from '../screens/DriverRoute';
import DelivaryDetail from '../screens/DelivaryDetails';

const Stack = createNativeStackNavigator();
export const ProfileStack = ({ navigation }) => {                                    //Create stack navigation for profile
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={ProfileScreen} name="Profile2"
                options={{
                    headerTitle: 'Profile',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",
                    headerStyle: {
                        backgroundColor: '#009387'
                    },
                }} />
            <Stack.Screen component={EditProfile} name="EditProfile" options={{
                headerTitle: 'Edit profile',
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: '#009387'
                },
            }} />
            <Stack.Screen component={ViewOwnLisitngs} name="ViewOwnListing" options={({ route }) => ({
                headerShown: true,
                title: '',
                headerBackTitleVisible: false,
                headerTransparent: true,
                headerTintColor: '#fff'
            })} />
            <Stack.Screen component={RequesterScreen} name="Requester" options={({ route }) => ({
                headerTitle: 'Request Details',
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: '#009387'
                },
            })} />
        </Stack.Navigator>
    )
}

export const MessageStack = ({ navigation }) => {                               //Create Stack navigator for message screen
    return (
        <Stack.Navigator>
            <Stack.Screen component={MessagesScreen} name="Message" options={{
                headerLeft: () =>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon name="menu" size={30} color="#fff" type="material-community" />
                    </TouchableOpacity>
                ,
                headerShown: true,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerStyle: { backgroundColor: '#009387' },
            }} />
            <Stack.Screen component={Chat} name="Chat" options={({ route }) => ({
                title: route.params.userName,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerStyle: { backgroundColor: '#009387' },
            })} />
        </Stack.Navigator>
    )
}

export const DriverStack = ({ navigation }) => {                          //Create Stack navigator for driver screen
    return (
        <Stack.Navigator>
            <Stack.Screen component={Delivery} name="Delivery"
                options={{
                    headerTitle: 'Delivery',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: '#009387' },
                }} />
            <Stack.Screen component={DelivaryDetail} name="DeliveryDetails" options={({ route }) => ({
                title: "Request Details",
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerStyle: { backgroundColor: '#009387' },
            })} />
            <Stack.Screen component={DriverRoute} name="DriverRoute" options={({ route }) => ({
                title: "Route to Delivery",
                headerTitleAlign: 'center',
                headerTintColor: "#fff",
                headerStyle: { backgroundColor: '#009387' },
            })} />
        </Stack.Navigator>
    )
}

const Drawer = createDrawerNavigator()                                        //Create drawer navigator
const AppStack = () => {
    const { dispatch, lang_state } = useContext(LanguageContext)              //Get current language from context api
    const [role, setRole] = useState("")
    useEffect(() => {
        const set_role = async () => {
            const get_role = await AsyncStorage.getItem('userRole')             //Get the role of the current user to check weather he/she is a driver
            setRole(get_role)
        }
        set_role()
    }, [])

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#009387',
            drawerActiveTintColor: '#fff',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: { marginLeft: -25, fontSize: 15 }
        }}>
            <Drawer.Screen component={TabNavigator} name={lang_state.language === 'T' ? "வீடு" : (lang_state.language === 'S' ? 'නිවස' : 'Home')} options={{
                drawerIcon: ({ color }) => (<Ionicons name="home-outline" size={22} color={color} />)
            }} />
            <Drawer.Screen component={ProfileStack} name={lang_state.language === 'T' ? "சுயவிபரம்" : (lang_state.language === 'S' ? 'පැතිකඩ' : 'Profile')}
                options={{ drawerIcon: ({ color }) => (<Ionicons name="person-outline" size={22} color={color} />) }} />
            <Drawer.Screen component={MessageStack} name={lang_state.language === 'T' ? "உரையாடல்கள்" : (lang_state.language === 'S' ? 'පණිවිඩ' : 'Messages')}
                options={{ drawerIcon: ({ color }) => (<Feather name="mail" size={22} color={color} />) }} />
            <Drawer.Screen component={Settings} name={lang_state.language === 'T' ? "அமைப்புகள்" : (lang_state.language === 'S' ? 'සැකසුම්' : 'Settings')}
                options={{
                    drawerIcon: ({ color }) => (<Ionicons name="settings-outline" size={22} color={color} />),
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: '#009387' },
                }} />
            <Drawer.Screen component={AddUser} name={lang_state.language === 'T' ? "பயனரைச் சேர்க்கவும்" : (lang_state.language === 'S' ? 'පරිශීලක එකතු කරන්න' : 'Add User')}
                options={{
                    drawerIcon: ({ color }) => (<Feather name="user-plus" size={22} color={color} />),
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: '#009387' },
                }} />
            <Drawer.Screen component={Goals} name={lang_state.language === 'T' ? "மென்பொருள் விவரங்கள்" : (lang_state.language === 'S' ? 'මෘදුකාංග විස්තර' : 'About us')}
                options={{
                    drawerIcon: ({ color }) => (<Entypo name="heart-outlined" size={22} color={color} />),
                    headerTitle: "About us",
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: '#009387' },
                }} />
            <Drawer.Screen component={Report} name={lang_state.language === 'T' ? "புகார்" : (lang_state.language === 'S' ? 'පැමිණිලි' : 'Reporuser')}
                options={{
                    drawerIcon: ({ color }) => (<Entypo name="emoji-sad" size={22} color={color} />),
                    headerTitle: "Report User",
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",
                    headerStyle: { backgroundColor: '#009387' },
                }} />
            {role === "driver" ?
                <Drawer.Screen component={DriverStack} name={lang_state.language === 'T' ? "டிரைவர் பகுதி" : (lang_state.language === 'S' ? 'රියදුරු ප්රදේශය' : 'Driver Area')}
                    options={{
                        drawerIcon: ({ color }) => (<AntDesign name="car" size={22} color={color} />),
                        headerShown: false,
                    }} /> : null}
        </Drawer.Navigator>
    )
}

export default AppStack
