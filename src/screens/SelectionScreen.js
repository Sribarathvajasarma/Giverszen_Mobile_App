import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import React, { useState } from "react";

import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, TextSection, } from '../styles/MessageStyle';



const SelectionScreen = ({ navigation }) => {
    const [options, setOptions] = useState([{ "name": "Food", "type": "food", "image": "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1661305836/selection-of-chinese-food-that-may-cause-chinese-restaurant-syndrome_f5zw2n.jpg" }, { "name": "Non-Food", "type": "nonfood", "image": "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1664261498/getty_883231284_200013331818843182490_335833_lbdjhl.jpg" }])           //Options array
    return (
        <Container>
            <FlatList
                data={options}
                keyExtractor={item => item.type}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate('AddListing', {
                        type: item.type
                    })}>
                        <UserInfo>
                            <UserImgWrapper>
                                <UserImg source={{ uri: item.image }} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.name}</UserName>
                                </UserInfoText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
            />
        </Container >
    )
}

export default SelectionScreen

const styles = StyleSheet.create({})