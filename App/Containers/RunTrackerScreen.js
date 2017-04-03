import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'

class RunTrackerScreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        text: 'start',
        timerOpacity: 0.0,
        timer: '',
        start: '', 
        end: '',
        timeMsg: ''
      };
    }

  handleClick = () => {
    if (this.state.text === 'start') {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  startTimer = () => {
    var startTime = (Date.now()/1000).toFixed(2);
    this.setState({text: 'stop', timerOpacity: 1.0, start: startTime});
    var startTimeSeconds = Math.floor(startTime);
    var sw = setInterval(() => {
      var currentTimeSeconds = Math.floor(Date.now()/1000);
      var secondsElapsed = currentTimeSeconds - startTimeSeconds;
      var hours = Math.floor(secondsElapsed / 3600);
      var minutes = Math.floor((secondsElapsed - (hours * 3600)) / 60);
      var seconds = Math.floor(secondsElapsed - (hours * 3600) - (minutes * 60));
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (secondsElapsed >= 3600) {
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        var timer = hours + ':' + minutes + ':' + seconds;
      } else {
        var timer = minutes + ':' + seconds;
      }
      if (this.state.text === 'start') {
        clearInterval(sw);
      } else {
        this.setState({timer: timer});
      }
    }, 1000)
  }

  stopTimer = () => {
    var endTime = (Date.now()/1000).toFixed(2);
    var totalSeconds = (endTime - this.state.start).toFixed(2);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    if (totalSeconds >= 3600) {
      var timeMsg = 'Your total time: ' + hours + ' hr ' + minutes + ' min ' + seconds + ' sec';
    } else {
      var timeMsg = 'Your total time: ' + minutes + ' min ' + seconds + ' sec';
    }
    this.setState({text: 'start', timerOpacity: 0.0, timer: '0:00', end: endTime, timeMsg: timeMsg});
    window.alert(timeMsg);
  }
  state = {
    initialPosition: {},
    lastPosition: {},
    coordinates: []
  };

  watchID: ?number = null;

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position)
        this.setState({initialPosition: position.coords})
        this.setState({lastPosition: position.coords})
        console.log(initialPosition, 'this is init post')
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({lastPosition: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421
      }})

      this.setState({
        coordinates: [...this.state.coordinates, {latitude: position.coords.latitude, longitude: position.coords.longitude}]
      }
      )
      console.log('this is long for last pos', position.coords)
      console.log({latitude: position.coords.latitude, longitude: position.coords.longitude})
    })
  }
  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render () {
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

    <View style={{
      alignItems: 'center'
    }}><Text style={{fontSize: 50, paddingTop: 20, paddingBottom: 20, opacity: this.state.timerOpacity}}>
       {this.state.timer || '0:00'}
    </Text></View>
          <View style={styles.section} />
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
                longitudeDelta: 0.00021
              }}

              showsUserLocation
              followsUserLocation
              showsCompass
            >
              <MapView.Polyline
                coordinates={this.state.coordinates}
                strokeColor='blue'
                strokeWidth={5}

            />
            </MapView.Animated>
          </View>

         <RoundedButton
            text={this.state.text}
            onPress={this.handleClick}
          />

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
