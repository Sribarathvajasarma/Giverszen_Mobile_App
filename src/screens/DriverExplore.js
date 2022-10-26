import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Animated, Image, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { DriverContext } from '../contexts/DriverContext';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.5;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const DriverExplore = ({ navigation, route }) => {
    const item = route.params.item
    const location = route.params.location
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state1 } = useContext(DriverContext)
    const initialMapState = { drivers: state1.drivers };
    const [state, setState] = React.useState(initialMapState);
    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    useEffect(() => {
        const find_region = () => {                              //Function to find appropriate initial region in map for given points
            const regionContainingPoints = points => {
                let minLat, maxLat, minLng, maxLng;
                (point => {
                    minLat = point.latitude;
                    maxLat = point.latitude;
                    minLng = point.longitude;
                    maxLng = point.longitude;
                })(points[0]);

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
                    latitudeDelta: deltaLat + 0.01, longitudeDelta: deltaLng + 0.01,
                };
            }
            let result = state.drivers.map(a => a.coordinate);
            const data = regionContainingPoints([
                ...result
            ]);
            setState({ drivers: initialMapState.drivers, region: data })
        }
        setIsLoading(true)
        find_region()
        setIsLoading(false)
    }, [state.drivers])


    useEffect(() => {
        if (!isLoading) {
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
                        const { coordinate } = state.drivers[index];
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
            })
        };
    }, [state.drivers]);

    const interpolations = state.drivers.map((marker, index) => {
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
    else {
        return (
            <View style={styles.container}>
                <MapView
                    ref={_map}
                    initialRegion={state.region}
                    style={styles.container}
                    provider={PROVIDER_GOOGLE}
                >
                    {
                        state.drivers.map((marker, index) => {
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
                                            source={{ uri: 'https://res.cloudinary.com/dqt5uhnm0/image/upload/v1664360457/carMarker_fhnqix.png' }}
                                            style={[styles.marker, scaleStyle]}
                                            resizeMode="cover"
                                        />
                                    </Animated.View>
                                </MapView.Marker>
                            );
                        })}
                </MapView>
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
                    {state.drivers.map((marker, index) => (
                        <View style={styles.card} key={index}>
                            <Image
                                source={{
                                    uri: marker.image
                                }}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={styles.textContent}>
                                <Text numberOfLines={1} style={styles.cardtitle}>{marker.Name}</Text>
                                <Text numberOfLines={1} style={styles.cardDescription}>{marker.Vehicle}</Text>
                                <View style={styles.button}>
                                    <TouchableOpacity
                                        onPress={() => { navigation.navigate('driverDetails', { driverData: marker, item: item, location: location }) }}
                                        style={[styles.signIn, {
                                            borderColor: '009387',
                                            borderWidth: 1
                                        }]}
                                    >
                                        <Text style={[styles.textSign, {
                                            color: '#009387'
                                        }]}>Request Now</Text>
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

export default DriverExplore;

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
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 50,
        height: 30,
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