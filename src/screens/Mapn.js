import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Animated, Image, TouchableOpacity, Dimensions, Platform, ActivityIndicator, } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { markers } from '../global/data';
import { ListingsContext } from '../contexts/ListingsContext';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const Mapn = () => {
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, foodstate } = useContext(ListingsContext)
    const initialMapState = { listings: foodstate.listings };
    const [state, setState] = React.useState(initialMapState);
    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    useEffect(() => {
        const find_region = () => {                                  //Function to find appropriate initial region for the given points
            const regionContainingPoints = points => {
                let minLat, maxLat, minLng, maxLng;

                // init first point
                (point => {
                    minLat = point.latitude;
                    maxLat = point.latitude;
                    minLng = point.longitude;
                    maxLng = point.longitude;
                })(points[0]);

                // calculate rect
                points.forEach(point => {
                    minLat = Math.min(minLat, point.latitude);
                    maxLat = Math.max(maxLat, point.latitude);
                    minLng = Math.min(minLng, point.longitude);
                    maxLng = Math.max(maxLng, point.longitude);
                });

                const midLat = (minLat + maxLat) / 2;
                const midLng = (minLng + maxLng) / 2;

                const deltaLat = (maxLat - minLat);
                const deltaLng = (maxLng - minLng);

                return {
                    latitude: midLat, longitude: midLng,
                    latitudeDelta: deltaLat, longitudeDelta: deltaLng,
                };
            }

            let result = state.listings.map(a => a.coordinate);
            const data = regionContainingPoints([
                ...result
            ]);
            setState({ listings: initialMapState.listings, region: data })
        }
        setIsLoading(true)
        find_region()
        setIsLoading(false)
    }, [state.listings])


    useEffect(() => {
        mapAnimation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= state.drivers.length) {
                index = state.drivers.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }
            clearTimeout(regionTimeout);
            const regionTimeout = setTimeout(() => {
                if (mapIndex !== index) {
                    mapIndex = index;
                    const { coordinate } = state.listings[index];
                    _map.current.animateToRegion(
                        {
                            ...coordinate,
                            latitudeDelta: state.region.latitudeDelta,
                            longitudeDelta: state.region.longitudeDelta,
                        },
                        350
                    );
                }
            }, 10);
        });
    }, [state.listings]);

    const interpolations = state.listings.map((marker, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            ((index + 1) * CARD_WIDTH),
        ];
        const scale = mapAnimation.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: "clamp"
        });
        return { scale };
    });

    const onMarkerPress = (mapEventData) => {
        const markerID = mapEventData._targetInst.return.key;
        let x = (markerID * CARD_WIDTH) + (markerID * 20);
        if (Platform.OS === 'ios') {
            x = x - SPACING_FOR_CARD_INSET;
        }
        _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
    }

    const _map = React.useRef(null);
    const _scrollView = React.useRef(null);

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
    }
    else if (state.listings) {
        return (
            <View style={styles.container}>
                <MapView
                    ref={_map}
                    initialRegion={state.region}
                    style={styles.container}
                    provider={PROVIDER_GOOGLE}>
                    {state.listings.map((marker, index) => {
                        const scaleStyle = {
                            transform: [
                                {
                                    scale: interpolations[index].scale,
                                },
                            ],
                        };
                        return (
                            <MapView.Marker key={index} coordinate={marker.coordinate} onPress={(e) => onMarkerPress(e)}>
                                <Animated.View style={[styles.markerWrap]}>
                                    <Animated.Image
                                        source={require('../../assets/imageedit_4_8648725550.png')}
                                        style={[styles.marker, scaleStyle]}
                                        resizeMode="cover" />
                                </Animated.View>
                            </MapView.Marker>
                        );
                    })}
                </MapView>
                <View style={styles.searchBox}>
                    <TextInput
                        placeholder="Search here"
                        placeholderTextColor="#000"
                        autoCapitalize="none"
                        style={{ flex: 1, padding: 0 }} />
                    <Ionicons name="ios-search" size={20} />
                </View>
                <ScrollView
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    height={50}
                    style={styles.chipsScrollView}
                    contentInset={{ // iOS only
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 20
                    }}
                    contentContainerStyle={{
                        paddingRight: Platform.OS === 'android' ? 20 : 0
                    }}>
                </ScrollView>
                <Animated.ScrollView
                    ref={_scrollView}
                    horizontal
                    pagingEnabled
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + 20}
                    snapToAlignment="center"
                    style={styles.scrollView}
                    contentInset={{
                        top: 0,
                        left: SPACING_FOR_CARD_INSET,
                        bottom: 0,
                        right: SPACING_FOR_CARD_INSET
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
                    }}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: mapAnimation,
                                    }
                                },
                            },
                        ],
                        { useNativeDriver: true }
                    )}
                >
                    {state.listings.map((marker, index) => (
                        <View style={styles.card} key={index}>
                            <Image
                                source={{ uri: marker.image }}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={styles.textContent}>
                                <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                                <Text numberOfLines={1} style={styles.cardDescription}>{marker.description}</Text>
                                <View style={styles.button}>
                                    <TouchableOpacity onPress={() => { }} style={[styles.signIn, { borderColor: '009387', borderWidth: 1 }]}>
                                        <Text style={[styles.textSign, { color: '#009387' }]}>Request Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </Animated.ScrollView>
            </View>
        );
    }
};

export default Mapn;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        position: 'absolute',
        marginTop: Platform.OS === 'ios' ? 40 : 20,
        flexDirection: "row",
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    chipsScrollView: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 90 : 80,
        paddingHorizontal: 10
    },
    chipsIcon: {
        marginRight: 5,
    },
    chipsItem: {
        flexDirection: "row",
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        height: 35,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        // padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 2,
        padding: 10,
    },
    cardtitle: {
        fontSize: 12,
        // marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
    },
    marker: {
        width: 30,
        height: 30,
        //tintColor: '#009387'
    },
    button: {
        alignItems: 'center',
        marginTop: 5
    },
    signIn: {
        width: '100%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },
    textSign: {
        fontSize: 14,
        fontWeight: 'bold'
    }
});