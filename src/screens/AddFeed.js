import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { InputField, InputWrapper } from '../styles/AddFeedStyle'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const AddFeed = () => {
    return (
        <View style={styles.container}>
            <InputWrapper>
                <InputField
                    placeholder="what's on your mind?"
                    multiline
                    numberOfLines={4}
                />

            </InputWrapper>
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => { }}>
                    <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => { }}>
                    <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    )
}

export default AddFeed

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})