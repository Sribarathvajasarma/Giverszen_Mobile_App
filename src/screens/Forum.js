import { ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Container, Card, UserInfo, UserImg, UserName, Interaction, UserInfoText, PostTime, PostText, PostImg, InteractionWrapper, InteractionText, Divider } from '../styles/FeedStyle'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useEffect } from 'react'
import { FAB } from 'react-native-paper'

const Forum = ({ navigation }) => {
  const [post, setPost] = useState([])                           //create state to store forum data
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch_data = async () => {
      try {
        setIsLoading(true)
        fetch("https://giverzenbackend.herokuapp.com/api/posts").then((response) => response.json())        //Get forum data from api
          .then((responseData) => {
            const postArray = []
            responseData.results.map((item, index) => {
              let posts = { username: item.username, email: item.email, avatar: item.avatar, Description: item.Description, postImage: item.postImage }
              postArray.push(posts)
            })
            setPost(postArray)
            setIsLoading(false)
          }).done();
      }
      catch (e) {
        console.log(e);
      }
    }
    fetch_data()
  }, [])

  return (
    <>
      <ScrollView>
        <Container>
          {post.map((item, index) => (
            <Card key={index}>
              <UserInfo>
                <UserImg source={{ uri: item.avatar }} />
                <UserInfoText>
                  <UserName>{item.username}</UserName>
                  <PostTime>{item.email}</PostTime>
                </UserInfoText>
              </UserInfo>
              <PostText>{item.Description}
              </PostText>
              <PostImg source={{ uri: item.postImage }} />
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
          ))}
        </Container>

      </ScrollView>
      <FAB
        style={styles.fab}
        small
        icon='plus'
        label='Add'
        onPress={() => { navigation.navigate('AddForum') }} />
    </>
  )
}

export default Forum

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  fab: {
    backgroundColor: '#219653',
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 5
  },
})
