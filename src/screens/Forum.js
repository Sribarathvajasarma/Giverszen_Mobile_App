import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container, Card, UserInfo, UserImg, UserName, Interaction, UserInfoText, PostTime, PostText, PostImg, InteractionWrapper, InteractionText, Divider } from '../styles/FeedStyle'
import Ionicons from 'react-native-vector-icons/Ionicons'
const Forum = ({ navigation }) => {
  return (
    <ScrollView>

      <Container>
        <Card>
          <UserInfo>
            <UserImg source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1656731789/B-Social/e7pqrakivxyncp0stqzy.jpg" }} />
            <UserInfoText>
              <UserName>Barath</UserName>
              <PostTime>4 hours ago</PostTime>
            </UserInfoText>
          </UserInfo>
          <PostText>This is the food recovery hierarchy which shows efficient method to reduce excess food wastage. you can get more information in visiting link given below.
          </PostText>
          <PostText>link :-https://www.edmonton.ca/programs_services/garbage_waste/how-to-reduce-food-waste
          </PostText>
          <PostImg source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1660190049/Food-Waste-Hierarchy-Graphic-800x510_f7axv8.jpg" }} />
          <InteractionWrapper>
            <Interaction>
              <Ionicons name="heart-outline" size={25} />
              <InteractionText>Like</InteractionText>
            </Interaction>
            <Interaction>
              <Ionicons name="md-chatbubble-outline" size={25} />
              <InteractionText>Comment</InteractionText>
            </Interaction>

          </InteractionWrapper>
        </Card>
        <Card>
          <UserInfo>
            <UserImg source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1656731789/B-Social/e7pqrakivxyncp0stqzy.jpg" }} />
            <UserInfoText>
              <UserName>Barath</UserName>
              <PostTime>4 hours ago</PostTime>
            </UserInfoText>
          </UserInfo>
          <PostText>How to reduce food waste at home?</PostText>
          <PostImg source={{ uri: "https://res.cloudinary.com/dqt5uhnm0/image/upload/v1660190428/ArticleImages_FoodWasteAtHome_sxkyj7.png" }} />
          <Divider />
          <InteractionWrapper>
            <Interaction>
              <Ionicons name="heart-outline" size={25} />
              <InteractionText>Like</InteractionText>
            </Interaction>
            <Interaction>
              <Ionicons name="md-chatbubble-outline" size={25} />
              <InteractionText>Comment</InteractionText>
            </Interaction>

          </InteractionWrapper>
        </Card>

        {/* <Button onPress={() => navigation.navigate('AddFeed')} title="press" /> */}
      </Container>
    </ScrollView>


  )
}

export default Forum

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,

  },
})