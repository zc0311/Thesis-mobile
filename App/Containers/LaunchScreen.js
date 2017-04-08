import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import ButtonBox from './ButtonBox'
import {Actions as NavigationActions } from 'react-native-router-flux'
import LoginActions from '../Redux/LoginRedux'
import { connect } from 'react-redux'
import styles from './Styles/LaunchScreenStyles'
import userDefaults from 'react-native-user-defaults'
import axios from 'axios';
import RoundedButton from '../../App/Components/RoundedButton'


var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: 'KhDTuf4lq48s3Db6kEvHHaLGaQCb7ETk', domain: 'lameme.auth0.com', allowedConnections: ['facebook']})


 class LaunchScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }

    this.showLogin = this.showLogin.bind(this)
  }

  showLogin () {
    lock.show({connections: ['facebook', 'Username-Password-Authentication']}, (err, profile, token) => {
      if (err) {
        console.log(err)
        return
      } else {
      this.props.success(profile);
      var userID = profile.userId;
      axios.post('https://lemiz2.herokuapp.com/api/users', { params: {
        userID,
        profile,
      }})
      .then((result) => {
        console.log(result)
        // dispatch(signInSuccess(result.data));
        this.props.updateuser(result.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }
    })
  }


  handleClick = () => {

  }

  componentWillMount() {
    if (!this.props.username) {
      this.showLogin()
    } 
  }

  render () {
    // console.log(this.props.userobj, "THIS IS PROPS")
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>
          <View style={{paddingTop: 25}}>
          <RoundedButton
            text={"LET'S RUN!"}
            onPress={NavigationActions.runTracker}
          />
          </View>
          <View style={{paddingTop: 25}}>
            <View style={styles.buttonsContainer}>
              <ButtonBox onPress={NavigationActions.packsScreen} style={styles.componentButton} image={Images.colorRun} text="View my Packs" />
              <ButtonBox onPress={NavigationActions.cgscreen} style={styles.usageButton} image={Images.home} text='Challenges & Goals' />
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.login.username,
    userobj: state.login.userobj

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    success: (username) => dispatch(LoginActions.loginSuccess(username)),
    updateuser: (userobj) => dispatch(LoginActions.loginUpdate(userobj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
