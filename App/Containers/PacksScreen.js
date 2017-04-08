import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, AppRegistry, ListView } from 'react-native'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, { dialogStyle } from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';
import { StackNavigator } from 'react-navigation'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import styles from './Styles/LaunchScreenStyles'


@connect(store => ({
    userobj: store.login.userobj
}))

export default class PacksScreen extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
        };
    }


    render() {
        console.log(this.props.userobj)
        // if (!this.props.userobj) {
        //     return (
        //         <Text>LOADING </Text>
        //     )
        // }

        return (
            <View>
                <View>
                    <Text style={{ fontSize: 50, paddingTop: 40, paddingBottom: 15 }}>
                        PACKS
                    </Text>
                </View>
                    {this.props.userobj.Packs.map((ele, idx) => {
                        return (<Text key={idx}>{ele["name"]}</Text>)
                        }
                    )}
                <View>
                </View>
            </View>
        )
    }
}

//Rabbit Goal: {ele["description"]}