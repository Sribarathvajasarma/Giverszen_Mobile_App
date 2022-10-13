
import Homen from '../screens/Homen';
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


const Stack = createNativeStackNavigator();



export const ProfileStack = ({ navigation }) => {
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


        </Stack.Navigator>
    )
}

export const MessageStack = ({ navigation }) => {
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

                headerStyle: {
                    backgroundColor: '#009387'
                },
            }} />
            <Stack.Screen component={Chat} name="Chat" options={({ route }) => ({
                title: route.params.userName,
                headerTitleAlign: 'center',
                headerTintColor: "#fff",

                headerStyle: {
                    backgroundColor: '#009387'
                },
            })} />


        </Stack.Navigator>
    )
}

const Drawer = createDrawerNavigator()
const AppStack = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#009387',
            drawerActiveTintColor: '#fff',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                marginLeft: -25,
                fontSize: 15
            }
        }}>
            <Drawer.Screen component={TabNavigator} name="Home" options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />

                )
            }} />
            <Drawer.Screen component={ProfileStack} name="Profile"
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={22} color={color} />

                    )


                }} />
            <Drawer.Screen component={MessageStack} name="Messages"
                options={{
                    drawerIcon: ({ color }) => (
                        <Feather name="mail" size={22} color={color} />

                    )
                }}
            />
            <Drawer.Screen component={Settings} name="Settings"
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={22} color={color} />

                    ),
                    headerShown: false,

                }} />
                 <Drawer.Screen component={AddUser} name="Add non-smart phone user"
                options={{
                    drawerIcon: ({ color }) => (
                        <Feather name="user-plus" size={22} color={color} />

                    ),
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",

                    headerStyle: {
                        backgroundColor: '#009387'
                    },
                }} />
            <Drawer.Screen component={Goals} name="About us"
                options={{
                    drawerIcon: ({ color }) => (
                        <Entypo name="heart-outlined" size={22} color={color} />

                    ),
                    headerTitle: "About us",
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",

                    headerStyle: {
                        backgroundColor: '#009387'
                    },
                }} />

            <Drawer.Screen component={Report} name="Report"
                options={{
                    drawerIcon: ({ color }) => (
                        <Entypo name="emoji-sad" size={22} color={color} />

                    ),
                    headerShown: true,
                    title: 'Report User',
                    headerTitleAlign: 'center',
                    headerTintColor: "#fff",

                    headerStyle: {
                        backgroundColor: '#009387'
                    },
                }} />


        </Drawer.Navigator>
    )
}

export default AppStack
