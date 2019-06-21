/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import MainScreen from './screen/MainScreen'
import DetailsScreen from './screen/DetailsScreen'

export default class App extends Component {

  static navigationOptions = {
    header: null,
    title: 'EatWat'
  }
  
    render() {
      return (
        <AppContainer />
      );
    }
  }


const AppStackNavigator = createStackNavigator({
  Home: MainScreen,
  Detail: DetailsScreen
})

const AppContainer = createAppContainer(AppStackNavigator);

