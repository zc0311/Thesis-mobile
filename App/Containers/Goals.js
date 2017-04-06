import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';
import { StackNavigator } from 'react-navigation'
import ScrollableTabView from 'react-native-scrollable-tab-view'

@connect(store => ({
  userinfo: store.login.username
}))

export default class Goals extends React.Component {
  constructor(props) {
    super(props);
      this.state = {

      };
    }


  render () {
    return (
        <View>
         <RoundedButton
            text={this.state.text}
            onPress={this.handleClick}
          />
        </View>
    )
  }
}

// export default StackNavigator({
//   Goals: {screen: Goals}
// }, {
//   headerMode: 'screen',
//   initialRouteName: 'Goals',
//   navigationOptions: {
//     header: {
//       visible: true,
//       style: {
//         backgroundColor: 'teal'
//       }
//     }
//   }
// })


