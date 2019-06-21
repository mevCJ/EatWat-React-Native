/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import MapView,{ PROVIDER_GOOGLE} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

export default class DetailsScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      opening: "",
      picRef: "",
      objData: {},
      curLongitude: 0,
      curLatitude: 0,
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    var data = navigation.getParam('data');
    console.log(data);

    this.setState({
      objData: data,
      picRef: data.photos[0].photo_reference,
    })

    if(data.opening_hours.open_now === false)
      this.setState({opening: "Close Now"})
    else
      this.setState({opening: "Open Now"})
  }

  componentDidMount = () => {
    this.getPos();
  };
  
  async getPos(){
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          curLatitude: position.coords.latitude,
          curLongitude: position.coords.longitude,
          error: null,
        })
      },
      (error) => console.log(JSON.stringify(error)),
      { enableHighAccuracy: false, timeout: 2000})
    
  }

  render() {

    const origin = {latitude: this.state.curLatitude, longitude: this.state.curLongitude};
    const destination = {latitude: this.state.objData.geometry.location.lat, longitude: this.state.objData.geometry.location.lng};
    const GOOGLE_MAPS_APIKEY = '';

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>

          { this.props.navigation.getParam('blind') === false &&
          <View>
            <View>
              <Image
              style={{width: 500, height: 300}}
              source={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference=${this.state.picRef}&key=${GOOGLE_MAPS_APIKEY}`}}/>
              <LinearGradient colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.80)']}  style={styles.linearGradient}/>
              <Text style={styles.nameTitle}>{this.state.objData.name}</Text>
            </View>
            <Text style={styles.description}>Rating                  : {this.state.objData.rating}</Text>
            <Text style={styles.description}>Operating Hours : {this.state.opening}</Text>
          </View>
          }

          <View style={{marginTop:20}}>
            <Text style={styles.subTitle}>Directions</Text>
            <View style={styles.mapContainer}>

              <MapView 
              region={{            
              latitude: this.state.curLatitude,
              longitude: this.state.curLongitude,
              latitudeDelta: 0.05,
              longitudeDelta:0.05,}}
              provider={PROVIDER_GOOGLE}
              style={styles.map}>
                <MapViewDirections
                  origin={origin}
                  destination={destination}
                  apikey={GOOGLE_MAPS_APIKEY}
                />
              </MapView>   
            </View>
          </View>

        </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  nameTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    color: 'white',
    margin: 10

  },
  linearGradient: {
    position:'absolute',
    width:'100%',
    height:'100%',
    opacity: 0.5
  },
  description: {
    fontSize: 18,
    marginTop: 3,
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 10,
  },
  mapContainer: {
    height: 400,
    width: 500,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    paddingVertical: 5
  },
 });
