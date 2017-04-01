import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import RunTrackerScreen from './RunTrackerScreen'



class RunTracker extends React.Component {


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
          <View style={{alignItems: 'center', paddingTop: 60}}>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText} >
            </Text>
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
