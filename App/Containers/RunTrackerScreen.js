import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';

@connect(store => ({
  userinfo: store.login.username
}))

class RunTrackerScreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        text: 'start',
        timerOpacity: 0.0,
        timer: '',
        start: '', 
        end: '',
        timeMsg: '',
        initialPosition: {},
        lastPosition: {},
        coordinates: []
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
    }, 
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 250, maximumAge: 0, desiredAccuracy: 0, frequency: 1 })
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
    var runHistoryEntry = {
      duration: totalSeconds,
      distance: 0.00, // add distance
      coordinates: this.state.coordinates,
      initialPosition: this.state.initialPosition,
      today: Date.now(),
      userID: this.props.userinfo.userId,
    }
    axios.post('https://lemiz2.herokuapp.com/api/runHistory', { params: {
      runHistoryEntry
    }})
    .then((result) => {
      console.log("axios sent")
      console.log(result)
      // dispatch(signInSuccess(result.data));
    })
    .catch((err) => {
      console.log("axios error");
      console.log(err)
    })
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    if (totalSeconds >= 3600) {
      var timeMsg = 'Total time: \n' + hours + ' hr \n' + minutes + ' min ' + seconds.toFixed(2) + ' sec';
    } else {
      var timeMsg = 'Total time: \n' + minutes + ' min ' + seconds.toFixed(2) + ' sec';
    }
    this.setState({text: 'start', timerOpacity: 0.0, timer: '0:00', end: endTime, timeMsg: timeMsg});
    this.popupDialog.show();
    navigator.geolocation.clearWatch(this.watchID)

  }


  watchID: ?number = null;

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position)
        this.setState({initialPosition: position.coords})
        this.setState({lastPosition: position.coords})
      },
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 250, maximumAge: 0}
    )
  }
  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render () {
    if(!this.state.initialPosition.latitude){
      return (
        <Text style={styles.title}>LOADING </Text>
      )
    }
    return (

      <View style={styles.mainContainer}>

        <View style={styles.popupContainer}>
          <PopupDialog 
            dialogStyle={styles.popup}
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          >
          <View >
            <Text style={styles.popupText}>{this.state.timeMsg}</Text>
            <RoundedButton text="okay" onPress={() => {this.popupDialog.dismiss()}}> 
            </RoundedButton>
          </View>
         </PopupDialog>
        </View>

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
        backgroundColor: 'teal'
      }
    }
  }
})
