import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    LogBox,
    Image
} from 'react-native';
import styled from 'styled-components/native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import { GOOGLE_MAPS_APIKEY } from "@env"

const DriverRoute = ({ route }) => {
    const [seconds, setSeconds] = useState(0);
    const [cords, setCords] = useState({})
    const [region, setRegion] = useState({})
    const driverData = route.params.driverData
    const origin = { longitude: parseFloat(driverData.pickup_longitude), latitude: parseFloat(driverData.pickup_latitude) }
    const destination = { longitude: parseFloat(driverData.dest_longitude), latitude: parseFloat(driverData.dest_latitude) }

    useEffect(() => {
        LogBox.ignoreLogs(['Failed prop type']);                     //Avoid unneccesry warnings
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={[styles.section, { height: 500 }]}>
                    <MapClass hookValue={destination} Location={origin}></MapClass>
                </View>
            </ScrollView>
        </View>
    );
}

export default DriverRoute

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

const origin = { latitude: 9.704264, longitude: 80.069339 };
const destination = { latitude: 9.712623, longitude: 80.058015 };
const region = {
    latitude: 6.8603615,
    longitude: 79.8645085,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}

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
        const someHookValue = this.props.hookValue;               //Get prop value and store it in constant
        const current = this.props.Location;
        return (
            <Container>
                <Map
                    initialRegion={region}
                >
                    <MapView.Marker
                        coordinate={someHookValue}
                    >
                        <MapView.Callout onPress={() => {
                            console.log('Press to Get Direction');
                            this.handleGetDirections();
                        }}>
                            <Text>Press to Get Direction</Text>

                        </MapView.Callout>
                    </MapView.Marker>
                    {current && <MapView.Marker
                        coordinate={current}>
                        <Image source={require('../../assets/human.png')} style={{ height: 50, width: 50 }} />
                    </MapView.Marker>}
                </Map>
                <View style={{
                    position: 'absolute',
                    margin: 20,
                    right: 0,
                    bottom: 10,
                    height: 100,
                    width: 200,
                    backgroundColor: '#DEF7FA',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                }}>
                    <Text>distance : {this.state.distance} km</Text>
                    <Text>time : {this.state.duration} min</Text></View>
            </Container>
        );
    }
}