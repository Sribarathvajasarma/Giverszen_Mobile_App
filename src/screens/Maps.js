import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View, ScrollView, TouchableOpacity, LogBox, Image } from 'react-native';
import styled from 'styled-components/native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import { GOOGLE_MAPS_APIKEY } from "@env"
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function MapFunction({ navigation, route }) {
    const [seconds, setSeconds] = useState(0);
    const [cords, setCords] = useState({})
    const [region, setRegion] = useState({})
    const itemData = route.params.itemData
    const location = route.params.location

    useEffect(() => {
        LogBox.ignoreLogs(['Failed prop type']);                       //Avoid warnings

    }, [])

    useEffect(() => {
        const find_region = () => {                                     //Function to find appropriate initial region for the given points
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
                    latitudeDelta: deltaLat + 0.001, longitudeDelta: deltaLng + 0.001,
                };
            }


            const data = regionContainingPoints([
                location, itemData.coordinate
            ]);

            setRegion(data)
        }
        find_region()
    }, [location, itemData])

    if (itemData && location && region) {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={[styles.section, { height: 500 }]}>
                        <MapClass hookValue={itemData.coordinate} Location={location} region={region}></MapClass>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>vfvdvdvdf</Text>
                    </View>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Best Before</Text>
                        <Text style={[styles.sectionContent, { color: '#009387' }]}>22 Aug 2022 10.00.00</Text>
                    </View>
                    <View style={[styles.section, { height: 100 }]}>
                        <Text style={styles.title}>Poster Name</Text>
                        <Text style={styles.sectionContent}>Vithiyasahar</Text>
                    </View>
                    <View style={[styles.section, { height: 150 }]}>
                        <Text style={styles.title}>description</Text>
                        <Text style={styles.sectionContent}>dvdfvdfvd</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>Action</Text>
                        <View style={styles.categories}>
                            <TouchableOpacity>
                                <View style={styles.categoryContainer}>
                                    <Entypo name="message" size={20} style={{ marginTop: 1 }} color="#fff" />
                                    <Text style={styles.category}>Chat</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('driver', { item: itemData, location: location })}>
                                <View style={styles.categoryContainer}>
                                    <AntDesign name="car" size={20} style={{ marginTop: 1 }} color="#fff" />
                                    <Text style={styles.category}>Request a driver</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
    },
    name: {
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionContent: {
        fontSize: 16,
        textAlign: 'justify',
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    categoryContainer: {
        flexDirection: 'row',
        backgroundColor: '#009387',
        borderRadius: 20,
        margin: 10,
        padding: 10,
        paddingHorizontal: 15,
    },
    category: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
    },
    titleContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageTitle: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 24,
    },
    navTitle: {
        color: 'white',
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    sectionLarge: {
        minHeight: 300,
    },
    mainCardView: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#050505",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 14,
        marginTop: 6,
        marginBottom: 6,
        marginLeft: 16,
        marginRight: 16,
    },
    subCardView: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "#FC0808 ",
        borderColor: "#050505",
        borderWidth: 1,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

let Container = styled(View)`
	width: 100%;
	height: 100%;
	background-color: white;
`;

let Map = styled(MapView)`
	width: 100%;
	height: 100%;
`;

class MapClass extends Component {

    constructor() {
        super();
        this.state = {
            distance: 0,
            duration: 0
        };
    }

    handleGetDirections = () => {
        const data = {
            destination,
            params: [
                {
                    key: "dirflg",
                    value: "d"
                }
            ]
        }
        getDirections(data)
    }

    pressed(e) {
        console.log('pressed');
    }

    render() {
        const someHookValue = this.props.hookValue;
        const current = this.props.Location;

        return (
            <Container>
                <Map initialRegion={this.props.region}>
                    <MapView.Marker
                        coordinate={someHookValue}>
                        <MapView.Callout onPress={() => {
                            console.log('Press to Get Direction');
                            this.handleGetDirections();
                        }}>
                            <Text>Press to Get Direction</Text>
                        </MapView.Callout>
                    </MapView.Marker>
                    {current && <MapView.Marker coordinate={current}><Image source={require('../../assets/human.png')} style={{ height: 50, width: 50 }} />
                    </MapView.Marker>}
                    <MapViewDirections
                        origin={current}
                        destination={someHookValue}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="blue"
                        onReady={result => {
                            this.setState({ distance: result.distance, duration: Number((result.duration).toFixed(2)) })
                            this.forceUpdate()
                        }} />
                </Map>
                <View style={{ position: 'absolute', margin: 20, right: 0, bottom: 10, height: 100, width: 200, backgroundColor: '#DEF7FA', alignItems: 'center', justifyContent: 'center', shadowColor: '#171717', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.2, shadowRadius: 3, }}>
                    <Text>distance : {this.state.distance} km</Text>
                    <Text>time : {this.state.duration} min</Text></View>
            </Container>
        );
    }
}