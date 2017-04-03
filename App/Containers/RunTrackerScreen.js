import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import { Actions as NavigationActions } from 'react-native-router-flux'


class RunTrackerScreen extends React.Component {

   state = {
    initialPosition: {},
    lastPosition: {},
    coordinates: []
  };

  watchID: ?number = null;

    componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition: position.coords});
        this.setState({lastPosition: position.coords});
        console.log(initialPosition, "this is init post")
        
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({lastPosition: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
              }});
      
      this.setState({
        coordinates: [...this.state.coordinates, {latitude: position.coords.latitude, longitude: position.coords.longitude}]
      }
      )
      console.log("this is long for last pos",position.coords)
      console.log({latitude: position.coords.latitude, longitude: position.coords.longitude})

    });
  }
    componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  render () {
    console.log("THIS IS STATEEEEEE", this.state)
    // console.log(this.state.initialPosition, "this is state")
    // if(!this.state.initialPosition.latitude){
    //   return (
    //     <Text style={styles.title}>LOADING </Text>
    //   )

    // }
    return (
      
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <TouchableOpacity onPress={() => NavigationActions.pop()} style={{
          position: 'absolute',
          paddingTop: 30,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Image source={Images.backButton} />
        </TouchableOpacity>
        <ScrollView style={styles.container}>
          <View style={{alignItems: 'center', paddingTop: 60}}>
            <Image source={Images.usageExamples} style={styles.logo} />
            <Text style={styles.titleText}>RUN</Text>
          </View>

          <View style={styles.section}>
          </View>
          <View
            style={{
              alignItems: 'center'
            }}>
            <MapView.Animated
              style={{
                width: 320,
                height: 320
              }}
              initialRegion={{
                latitude: this.state.lastPosition.latitude,
                longitude: this.state.lastPosition.longitude,
                latitudeDelta: 0.00022,
                longitudeDelta: 0.00021,
              }}

              showsUserLocation={true}
              followsUserLocation={true}
              showsCompass={true}
            >
            <MapView.Polyline
                coordinates={this.state.coordinates}
                strokeColor="blue"
                strokeWidth={5}
            
            />
            </MapView.Animated>
          </View>


          {/*<View style={styles.screenButtons} />*/}

        </ScrollView>
      </View>
    )
  }
}

export default StackNavigator({
  RunTrackerScreen: {screen: RunTrackerScreen}
}, {
  headerMode: 'screen',
  initialRouteName: 'RunTrackerScreen',
  navigationOptions: {
    header: {
      visible: true,
      style: {
        backgroundColor: '#3e243f'
      }
    }
  }
})
