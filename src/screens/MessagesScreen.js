import { StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection, } from '../styles/MessageStyle';
import { MessagesContext } from '../contexts/MessageContext';

const MessagesScreen = ({ navigation }) => {
    const { dispatch, state } = useContext(MessagesContext)
    const [user, setUser] = useState('')

    useEffect(() => {
        const fetch_data = async () => {
            let userId = await AsyncStorage.getItem('userId')                      //Get current users's userId using async storage
            let userName = await AsyncStorage.getItem('userName')                 //Get current users's userName using async storage
            setUser(userId)
            dispatch({ type: 'START_LOADING' })
            fetch("https://giverzenbackend.herokuapp.com/api/conversations", {           //Get conversations from api 
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
                    dispatch({ type: 'COVERSATIONS_INIT', payload: newArr })                 //Call COVERSATIONS_INIT action 
                }).done();
        }
        fetch_data()
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