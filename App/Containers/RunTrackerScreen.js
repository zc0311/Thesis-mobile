import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'



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
        console.log(initialPosition, "this is init post")
        
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
      this.setState({
        coordinates: [...this.state.coordinates, {latitude: position.coords.latitude, longitude: position.coords.longitude}]
      }
      )
      console.log("this is LAST position", lastPosition)
      console.log("this is long for last pos",position.coords)
      console.log({latitude: position.coords.latitude, longitude: position.coords.longitude})

    });
  }


  render () {
    console.log("THIS IS STATEEEEEE", this.state)
    // console.log(this.state.initialPosition, "this is state")
    if(!this.state.initialPosition.latitude){
      return (
        <Text style={styles.title}>LOADING </Text>
      )

    }
    return (
      
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={{
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
            {/*<Text style={styles.sectionText} >
              The Plugin Examples screen is a playground for 3rd party libs and logic proofs.
              Items on this screen can be composed of multiple components working in concert.  Functionality demos of libs and practices
            </Text>*/}
          </View>
          <View
    style={{
      alignItems: 'center'
    }}>
    <MapView
      style={{
        width: 320,
        height: 320
      }}
      initialRegion={{
        latitude: this.state.initialPosition.latitude,
        longitude: this.state.initialPosition.longitude,
        latitudeDelta: 1.1922,
        longitudeDelta: 1.1421,
      }}
    >
    <MapView.Polyline
        coordinates={this.state.coordinates}
        strokeColor="blue"
        strokeWidth={5}
     
     />
    </MapView>
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
      visible: false,
      style: {
        backgroundColor: '#3e243f'
      }
    }
  }
})
