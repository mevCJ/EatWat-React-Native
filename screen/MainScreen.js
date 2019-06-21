/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Switch,Button,Slider, StyleSheet, Text, View} from 'react-native';
import MapView, { PROVIDER_GOOGLE,Marker, Circle } from 'react-native-maps';

export default class MainScreen extends Component {

  static navigationOptions = {
    title: 'EatWat'
  }

  constructor(props){
    super(props);
    this.state = {
        curLongitude: 0,
        curLatitude: 0,
        searchRad:1500,
        results: [],
        chosen: "",
        blindMode: false
    };
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
      this.fetchdata(position.coords.latitude,position.coords.longitude);
    },
    (error) => console.log(JSON.stringify(error)),
    { enableHighAccuracy: false, timeout: 2000})
  
}

fetchdata(lat,lng){
  const GOOGLE_MAPS_APIKEY = '';
   fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${this.state.searchRad}&type=restaurant&key=${GOOGLE_MAPS_APIKEY}`)
  .then((response)=>response.json())
  .then((responseJson)=> {
    this.setState({
      results: responseJson.results
    })})
    .catch((error)=>{
    console.error(error);
    });
}

randomPlace(){
  var randNum = Math.floor(Math.random() * this.state.results.length) ;
  this.props.navigation.navigate('Detail',{data: this.state.results[randNum], blind: this.state.blindMode});
}


  render() {

    console.log(this.state.results.length)
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: this.state.curLatitude,
            longitude: this.state.curLongitude,
            latitudeDelta: 0.05,
            longitudeDelta:0.05,
          }}
          showsUserLocation={true}
        >

        {this.state.results.map((val,key) => (
        <Marker
          key={key}
          coordinate={{latitude:val.geometry.location.lat,longitude:val.geometry.location.lng}}
          title={val.name}
        />
        ))}

        <Circle center={{latitude:this.state.curLatitude,longitude:this.state.curLongitude}} radius={this.state.searchRad} ></Circle>
        </MapView>
      </View>

      <View style={{margin:20, flex:1}}>
        <View style={styles.row}>
          <Text style={{fontSize:20}}>Range:</Text>
          <Slider
          value={this.state.searchRad}
          onValueChange={value => (
            this.setState({searchRad:value}),
            this.fetchdata(this.state.curLatitude,this.state.curLongitude)
            )}
          minimumValue={1000}
          maximumValue={3000}
          style={styles.slider}/>
          <Text> {this.state.searchRad}</Text>
        </View>

        <View style={styles.row}>
          <Text style={{fontSize:20}}>Blind mode: </Text>
          <Switch onValueChange={() => this.setState({blindMode: !this.state.blindMode})}
          value={this.state.blindMode}
          style={styles.switch}/>
        </View>

        <View style={styles.randButton}>
        <Button onPress={()=>this.randomPlace()} style={styles.randButton} title="Gimme Food"/>
        </View>
      
      </View>
    </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
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
  randButton: {
    display:'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    position:'absolute',
    bottom: 0,
    right: 0,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  slider: {
    marginLeft: 50,
    height: 30,
    width:'50%'
  },
  switch:{
    marginLeft:20,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
  }
 });
