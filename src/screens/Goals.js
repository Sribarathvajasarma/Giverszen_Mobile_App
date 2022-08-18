import React from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
    Button,
    TouchableOpacity
} from 'react-native';

import { data } from '../global/data';
import Swiper from 'react-native-deck-swiper';
import { Transitioning, Transition } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



const { width } = Dimensions.get('window');

const stackSize = 4;
const colors = {
    red: '#EC2379',
    blue: '#0070FF',
    gray: '#777777',
    white: '#ffffff',
    black: '#000000'
};
const ANIMATION_DURATION = 200;

const transition = (
    <Transition.Sequence>
        <Transition.Out
            type='slide-bottom'
            durationMs={ANIMATION_DURATION}
            interpolation='easeIn'
        />
        <Transition.Together>
            <Transition.In
                type='fade'
                durationMs={ANIMATION_DURATION}
                delayMs={ANIMATION_DURATION / 2}
            />
            <Transition.In
                type='slide-bottom'
                durationMs={ANIMATION_DURATION}
                delayMs={ANIMATION_DURATION / 2}
                interpolation='easeOut'
            />
        </Transition.Together>
    </Transition.Sequence>
);

const swiperRef = React.createRef();
const transitionRef = React.createRef();

const Card = ({ card }) => {
    return (
        <View style={styles.card}>
            <Text style={{ alignContent: 'center' }}>fefefefefewfw</Text>
            <Text>dcsvsdvsvsdvdsvsvd sdvvefer wfefre rgergegr eregegwfef rerververd ddvdfv dvdvfvfd dfvdfvfdv</Text>
        </View>
    );
};



export default function Goals() {
    const [index, setIndex] = React.useState(0);
    const onSwiped = () => {
        transitionRef.current.animateNextTransition();
        setIndex((index + 1) % data.length);
    };

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar hidden={true} />
            <View style={styles.swiperContainer}>
                <Swiper
                    ref={swiperRef}
                    cards={data}
                    cardIndex={index}
                    renderCard={card => <Card card={card} />}
                    infinite
                    backgroundColor={'transparent'}
                    onSwiped={onSwiped}
                    onTapCard={() => swiperRef.current.swipeLeft()}
                    cardVerticalMargin={50}
                    stackSize={stackSize}
                    stackScale={10}
                    stackSeparation={14}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    disableTopSwipe
                    disableBottomSwipe
                    cardStyle={{ height: 1000 }}


                />
            </View>
            <View style={styles.bottomContainer}>
                <Transitioning.View
                    ref={transitionRef}
                    transition={transition}
                    style={styles.bottomContainerMeta}
                >
                </Transitioning.View>
                <View style={styles.bottomContainerButtons}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => swiperRef.current.swipeRight()} >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                    {/* <MaterialCommunityIcons.Button
                        name='circle-outline'
                        size={94}
                        backgroundColor='transparent'
                        underlayColor='transparent'
                        activeOpacity={0.3}
                        color={colors.blue}
                        onPress={() => swiperRef.current.swipeRight()}
                    /> */}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    swiperContainer: {
        flex: 0.55
    },
    bottomContainer: {
        flex: 0.45,
        justifyContent: 'space-evenly'
    },
    bottomContainerMeta: { alignContent: 'flex-end', alignItems: 'center' },
    bottomContainerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    cardImage: {
        width: 160,
        flex: 1,
        resizeMode: 'contain'
    },
    card: {
        height: 80,
        flex: 0.45,
        borderRadius: 8,
        shadowRadius: 25,
        // shadowColor: colors.black,
        // shadowOpacity: 0.08,
        // shadowOffset: { width: 0.5, height: 0.5 },
        shadowColor: '#009387',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        elevation: 1,
        backgroundColor: colors.white

    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    done: {
        textAlign: 'center',
        fontSize: 30,
        color: colors.white,
        backgroundColor: 'transparent'
    },
    text: {},
    heading: { fontSize: 24, marginBottom: 10, color: colors.gray },
    price: { color: colors.blue, fontSize: 32, fontWeight: '500' },
    buttonContainer: {
        marginTop: 100,
        width: '70%',
        height: Dimensions.get('window').height / 15,
        backgroundColor: '#009387',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});