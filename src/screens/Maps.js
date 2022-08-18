



import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Button,
    Text,
    View,
    TextInput,
    ImageBackground,
    ActivityIndicator,
    Linking,
    TouchableOpacity,
    LogBox,
    Image
} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'




export default function MapFunction({ route }) {
    const [seconds, setSeconds] = useState(0);
    const [cords, setCords] = useState({})
    const [region, setRegion] = useState({})
    const itemData = route.params.itemData
    const location = route.params.location


    // useEffect(() => {
    //     LogBox.ignoreLogs(['Error on GMAPS route request: ZERO_RESULTS']);
    // }, [])

    // const fetch_data = async () => {
    //     let response = await fetch("https://giverzen6.herokuapp.com/api/get")
    //     if (!response.ok) {
    //         throw new Error(`Error! status: ${response.status}`);
    //     }
    //     response = await response.json()
    //     setCords({ latitude: parseFloat(response.results[0].latitude), longitude: parseFloat(response.results[0].longitude) })
    // }





    useEffect(() => {

        const find_region = () => {
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
                    latitudeDelta: deltaLat + 0.05, longitudeDelta: deltaLng + 0.05,
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

            <MapClass hookValue={itemData.coordinate} Location={location} region={region}></MapClass>

        );
    }

}

let Container = styled(View)`
	width: 100%;
	height: 100%;
	background-color: white;
`;

let Map = styled(MapView)`
	width: 100%;
	height: 100%;
`;



// const origin = { latitude: 9.704264, longitude: 80.069339 };

// const destination = { latitude: 9.712623, longitude: 80.058015 };

const GOOGLE_MAPS_APIKEY = 'AIzaSyBg9yp_6i0LuulJmzGrWFyVvUJaL7pwef4';

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
                <Map
                    initialRegion={this.props.region}
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
                        coordinate={current}

                    ><Image source={require('../../assets/human.png')} style={{ height: 50, width: 50 }} />

                    </MapView.Marker>}
                    {/* <MapView.Marker coordinate={{ latitude: 80.0000, longitude: 7.0000 }}><Image source={require('../../assets/human.png')} style={{ height: 35, width: 35 }} /></MapView.Marker> */}


                    <MapViewDirections
                        origin={current}
                        destination={someHookValue}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="blue"
                        onReady={result => {

                            this.setState({ distance: result.distance, duration: Number((result.duration).toFixed(2)) })

                            this.forceUpdate()
                        }}

                    />

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