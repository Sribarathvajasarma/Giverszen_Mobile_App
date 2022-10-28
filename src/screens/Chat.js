import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { SocketContext } from '../contexts/SocketContext'

const Chat = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const { dispatch, state } = useContext(SocketContext)

    useEffect(() => {
        const fetch_data = async () => {
            fetch("https://giverzenbackend.herokuapp.com/api/message", {                    //Get all messages of particular conversation
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sending: route.params.authId,
                    recipient: route.params.otherId
                })
            }).then((response) => response.json())
                .then((responseData) => {
                    let messArr = []
                    let messObj = {}
                    let count = 1
                    responseData.messages.forEach(item => {                   //Check each message sender and give user according to that and store it in array
                        if (item.sender === route.params.authId) {
                            messObj = {
                                _id: count,
                                text: item.text,
                                createdAt: item.created_at,
                                user: {
                                    _id: 1,
                                    name: 'React Native',
                                    avatar: route.params.avatar,
                                },
                            }
                        } else {
                            messObj = {
                                _id: count,
                                text: item.text,
                                createdAt: item.created_at,
                                user: {
                                    _id: 2,
                                    name: 'React Native',
                                    avatar: 'https://placeimg.com/140/140/any',
                                },
                            }
                        }
                        messArr.push(messObj)                        //Push object into array 
                        count = count + 1
                    })
                    setMessages(messArr.reverse())                      //Set array to messages state
                }).done();
        }
        fetch_data()
    }, [])

    useEffect(() => {
        state.payload.on('addMessageToClient', msg => {                         //Add new message to socket
            if (msg.recipient === parseInt(route.params.authId)) {
                var rand = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 10; i++)
                    rand += possible.charAt(Math.floor(Math.random() * possible.length));              //Create unique message id
                let new_msg = {
                    _id: rand,
                    text: msg.text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                }
                setMessages(previousMessages => GiftedChat.append(previousMessages, new_msg))
            }
        })
    }, [state.payload])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        let msg = { sender: parseInt(route.params.authId), recipient: parseInt(route.params.otherId), text: messages[0].text, media: '' }
        state.payload.emit('addMessage', msg)                                                         //Send new message to server using socket
        fetch("https://giverzenbackend.herokuapp.com/api/add_message", {             //Post new message to server to insert it in the database
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sending: parseInt(route.params.authId),
                recipient: parseInt(route.params.otherId),
                text: messages[0].text,
                media: ''
            })
        }).then((response) => response.json())
            .then((responseData) => {
                console.log('message added successfully')                            //Show successfull message
            })
            .done();
    }, [])

    const onLongPress = (context, message) => {
        const options = ['Delete Message', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    setMessages(messages.filter((mess) => mess._id !== message._id))            //Delete message from message array
                    break;
                case 1:
                    break;
            }
        });
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons name='send-circle' style={{ marginBottom: 5, marginRight: 5 }} size={32} color='#009387' />
                </View>
            </Send>
        )
    }

    const scrollToBottomComponent = () => {
        return (
            <FontAwesome5Icon name='angle-double-down' size={22} color="#333" />
        )
    }

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#009387'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        )
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            onLongPress={onLongPress}
        />
    )
}

export default Chat

const styles = StyleSheet.create({})