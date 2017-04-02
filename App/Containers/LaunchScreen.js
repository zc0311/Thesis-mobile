import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import ButtonBox from './ButtonBox'
import { Actions as NavigationActions } from 'react-native-router-flux'
// Styles
import styles from './Styles/LaunchScreenStyles'
export default class LaunchScreen extends React.Component {

  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>
            <View style={styles.buttonsContainer}>
              <ButtonBox onPress={NavigationActions.runTracker} style={styles.componentButton} image={Images.chevronRight} text="Let's Run" />
              <ButtonBox style={styles.usageButton} image={Images.components} text='View Profile' />
            </View>


        </ScrollView>
      </View>
    )
  }
}
