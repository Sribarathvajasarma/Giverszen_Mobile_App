import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useReducer, useState, useContext } from "react";
import { reducer as MessagesReducer, initialState } from '../reducers/MessagesReducer'
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Container,
    Card,
    UserInfo,
    UserImgWrapper,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
} from '../styles/MessageStyle';
import { MessagesContext } from '../contexts/MessageContext';

// const Messages = [
//     {
//         id: '1',
//         userName: 'Sahar',
//         userImg: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651321465/avatar/p28mjywjy3e8edyjvt4a.png",
//         messageTime: '4 mins ago',
//         messageText:
//             'Hey, when will you come to pickup food?',
//     },
//     {
//         id: '2',
//         userName: 'Thuvethika',
//         userImg: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651321465/avatar/p28mjywjy3e8edyjvt4a.png",
//         messageTime: '2 hours ago',
//         messageText:
//             'Sorry, I need to change the pickup time',
//     },
//     {
//         id: '3',
//         userName: 'Shan',
//         userImg: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651321465/avatar/p28mjywjy3e8edyjvt4a.png",
//         messageTime: '1 hours ago',
//         messageText:
//             'Bye..',
//     },
//     {
//         id: '4',
//         userName: 'Sinthijan',
//         userImg: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651321465/avatar/p28mjywjy3e8edyjvt4a.png",
//         messageTime: '1 day ago',
//         messageText:
//             'I will come there on time. bye',
//     },
//     {
//         id: '5',
//         userName: 'Ravi',
//         userImg: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1651321465/avatar/p28mjywjy3e8edyjvt4a.png",
//         messageTime: '2 days ago',
//         messageText:
//             'I will wait there to pickup food, be there on time',
//     },
// ];


const MessagesScreen = ({ navigation }) => {
    const { dispatch, state } = useContext(MessagesContext)
    const [user, setUser] = useState('')

    useEffect(() => {
        const fetch_data = async () => {

            let userId = await AsyncStorage.getItem('userId')
            let userName = await AsyncStorage.getItem('userName')
            setUser(userId)
            dispatch({ type: 'START_LOADING' })
            fetch("https://giverzenbackend.herokuapp.com/api/conversations", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sending: userId,

                })
            }).then((response) => response.json())
                .then((responseData) => {
                    let newArr = [];
                    responseData.conversations.forEach(item => {
                        if (item.username !== userName) {
                            if (item.sender === userId) {
                                newArr.push({ id: item.recipient, username: item.username, avatar: item.avatar, text: item.text, media: item.media })

                            } else {

                                newArr.push({ id: item.sender, username: item.username, avatar: item.avatar, text: item.text, media: item.media })

                            }

                        }
                    })

                    dispatch({ type: 'COVERSATIONS_INIT', payload: newArr })

                })
                .done();



        }
        fetch_data()


    }, [])


    useEffect(() => {
        console.log(state.Conversations)
    }, [])

    return (
        <Container>
            <FlatList
                data={state.Conversations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate('Chat', {
                        userName: item.username,
                        authId: user,
                        otherId: item.id,
                        avatar: item.avatar
                    })}>
                        <UserInfo>
                            <UserImgWrapper>
                                <UserImg source={{ uri: item.avatar }} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.username}</UserName>
                                </UserInfoText>
                                <MessageText>{item.text}</MessageText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
            />
        </Container >
    )
}

export default MessagesScreen

const styles = StyleSheet.create({})