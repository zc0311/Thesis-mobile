import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import RoundedButton from '../../App/Components/RoundedButton'

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

  render () {
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

    <View style={{
      alignItems: 'center'
    }}><Text style={{fontSize: 50, paddingTop: 20, paddingBottom: 20, opacity: this.state.timerOpacity}}>
       {this.state.timer || '0:00'}
    </Text></View>

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
        latitude: 50,
        longitude: -122.4324,
        latitudeDelta: 1.1922,
        longitudeDelta: 1.1421,
      }}
    >
    <MapView.Polyline
        coordinates={[
          {latitude: 40, longitude: -100},
          {latitude: 50, longitude: -122.4324},
          {latitude: 70, longitude: -130}
        ]}
        strokeColor="blue"
        strokeWidth={5}
     
     />
    </MapView>
  </View>

         <RoundedButton
            text={this.state.text}
            onPress={this.handleClick}
          />

          <View style={styles.screenButtons} />

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
