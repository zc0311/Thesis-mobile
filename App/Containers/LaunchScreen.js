import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import ButtonBox from './ButtonBox'
import {Actions as NavigationActions } from 'react-native-router-flux'
import LoginActions from '../Redux/LoginRedux'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/LaunchScreenStyles'


var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: 'KhDTuf4lq48s3Db6kEvHHaLGaQCb7ETk', domain: 'lameme.auth0.com', allowedConnections: ['facebook']});

@connect(store => ({
  loggedIn: store,
}))

export default class LaunchScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.showLogin = this.showLogin.bind(this);
  }

  showLogin() {
    console.log(this.props)
    lock.show({connections: ['facebook', 'Username-Password-Authentication']}, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      // Authentication worked!
      console.log('Logged in with Auth0!');
    });
  }

  render () {

    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>
          <View style={{paddingTop: 150}}>
            <View style={styles.buttonsContainer}>
              <ButtonBox onPress={NavigationActions.runTracker} style={styles.componentButton} image={Images.chevronRight} text="Let's Run" />
              <ButtonBox onPress={this.showLogin} style={styles.usageButton} image={Images.components} text='View Profile' />
            </View>
            </View>


        </ScrollView>
      </View>
    )
  }
}


